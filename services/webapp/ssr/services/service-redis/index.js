import * as hooks from './hooks'

import redis from 'redis'

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
}