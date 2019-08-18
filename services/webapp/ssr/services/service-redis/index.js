
import redis from 'redis'
import georedis from 'georedis'

import * as hooks from './hooks'

import * as geoService from './redis-geo.lib'

// export { default as georedis } from './redis-geo.lib'

// Applies default values to `redis` config object
const buildConfig = ({ getConfig, setConfig }) => {
    const config = {
        ...getConfig('redis', {}),
        port: getConfig('redis.port', 6379),
        host: getConfig('redis.host', 'localhost'),
        password: getConfig('redis.password', 'admin'),
        connectionTimeout: getConfig('redis.connectionTimeout', 3600000),
    }

    setConfig('redis', config)
    return config
}


export default ({ registerHook, registerAction }) => {
    registerHook(hooks)

    const defaults = {
        name: hooks.SERVICE_NAME,
        trace: __filename,
    }

    registerAction({
        ...defaults,
        hook: '$INIT_SERVICE',
        handler: async ({}, ctx) => {
            const config = buildConfig(ctx)

            const client = redis.createClient(config.port, config.host, {
                password: config.password,
                connect_timeout: config.connectionTimeout,
            })
                .on('connect', async () => {
                    ctx.logger.verbose('[service-redis]: client connected')
                    await ctx.createHook.serie(hooks.REDIS_CONNECT, { client })
                })
                .on('error', (err) => {
                    ctx.logger.error('[service-redis] ' + err.message)
                    throw err
                })
        },
    })

    registerAction({
        ...defaults,
        hook: '$REDIS_CONNECT',
        handler: async (args, ctx) => {
            const client = georedis.initialize(args.client)

            await ctx.createHook.serie(hooks.REDIS_GEO_CONNECT, {
                addGroup: (groupName) => {
                    const groupClient = client.addSet(groupName)
                    geoService.setGroup(groupName, groupClient)
                },
                deleteGroup: (groupName) => {
                    client.deleteSet(groupName)
                    geoService.setGroup(groupName, null)
                },
            })
        },
    })

    // registerAction({
    //     ...defaults,
    //     hook: '$REDIS_GEO_CONNECT',
    //     handler: async ({ addGroup }, ctx) => {
    //         // await addGroup('cars')
            
    //         // const res = await geoService.update('cars', [
    //         //     ['sho1', 10.10, 11.12],
    //         //     ['sho2', 11.11, 12.12],
    //         //     ['sho3', 12.12, 13.13],
    //         //     ['sho4', 13.13, 14.14],
    //         //     ['sho5', 13.13, 14.14],
    //         // ])
    //         // console.log(res)

    //         // const res1 = await geoService.get('cars', ['sho1', 'sho2'])
    //         // console.log(res1)

    //         // const res2 = await geoService.remove('cars', ['sho1', 'sho2'])
    //         // console.log(res2)

    //         // const res3 = await geoService.getNearby('cars', [10.10, 11.11], 500000000)
    //         // console.log(res3)
    //     },
    // })
}