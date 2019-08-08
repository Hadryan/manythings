
import * as hooks from './hooks'

export default ({ registerHook, registerAction }) => {
    registerHook(hooks)

    registerAction({
        hook: '$API_INIT',
        name: hooks.FEATURE_NAME,
        trace: __filename,
        handler: async ({ registerQuery }) => {
            // registerQuery('session', `
            //     query session {
            //         session { id }
            //     }
            // `)

            // registerQuery('device', `
            //     query device {
            //         device { id }
            //     }
            // `)
        }
    })

    registerAction({
        hook: '$START_FEATURE',
        name: hooks.FEATURE_NAME,
        trace: __filename,
        handler: async () => {
            // try {
            //     const res = await exec('device', {})
            //     console.log(res)
            // } catch (err) {
            //     console.log(err)
            // }
        }
    })
}