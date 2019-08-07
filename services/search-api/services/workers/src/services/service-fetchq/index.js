
import fetchq from 'fetchq'
import * as hooks from './hooks'

// Applies default values to `fetchq` config object
const buildConfig = ({ getConfig, setConfig }) => {
    const config = {
        ...getConfig('fetchq', {}),
        connect: getConfig('fetchq.connect', {}),
        logLevel: getConfig('fetchq.logLevel', 'info'),
        workers: getConfig('fetchq.workers', []),
        maintenance: getConfig('fetchq.maintenance', {
            limit: 3,
            sleep: 1500,
        }),
    }

    setConfig('fetchq', config)
    return config
}

export default ({ registerHook, registerAction }) => {
    registerHook(hooks)

    registerAction({
        hook: '$START_SERVICE',
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: async ({ getConfig, createHook }, ctx) => {
            const config = buildConfig(ctx)

            await createHook.serie(hooks.FETCHQ_START, {
                registerWorker: (workerPath) => config.workers.push(workerPath),
            })

            const client = fetchq(config)
            await client.start()
            await client.init()
        },
    })
}