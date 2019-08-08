import * as hooks from './hooks'
import { init, start } from './fetchq.lib'

const KNOWN_QUEUES = ['workflow']

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
        queues: getConfig('fetchq.queues', KNOWN_QUEUES),
    }

    setConfig('fetchq', config)
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
            await init(config)
        },
    })

    registerAction({
        ...defaults,
        hook: '$START_SERVICE',
        handler: async ({}, ctx) => {
            const config = buildConfig(ctx)
            await start(config)
        },
    })
}