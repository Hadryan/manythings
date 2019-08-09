
import * as hooks from './hooks'

import workflow from './workers/workflow'

export default ({ registerHook, registerAction }) => {
    registerHook(hooks)

    registerAction({
        hook: '$FETCHQ_INIT',
        name: hooks.FEATURE_NAME,
        trace: __filename,
        handler: async ({ registerWorker }, ctx) => {
            registerWorker(workflow(ctx))
        }
    })
}