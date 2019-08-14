
import * as hooks from './hooks'

import { init } from './redis-geo.lib'

export {
    create,
    update,
    remove,
    get,
    getNearby
} from './redis-geo.lib'

export default ({ registerHook, registerAction }) => {
    registerHook(hooks)

    const defaults = {
        name: hooks.SERVICE_NAME,
        trace: __filename,
    }

    registerAction({
        ...defaults,
        hook: '$REDIS_CONNECT',
        handler: async (args, ctx) => init(args, ctx),
    })

    // registerAction({
    //     ...defaults,
    //     hook: '$REDIS_GEO_CONNECT',
    //     handler: async ({ addGroup }, ctx) => {
    //         // await addGroup('cars')
    //         // const res = await service.update('cars', [
    //         //     ['sho1', 10.10, 11.12],
    //         //     ['sho2', 11.11, 12.12],
    //         //     ['sho3', 12.12, 13.13],
    //         //     ['sho4', 13.13, 14.14],
    //         //     ['sho5', 13.13, 14.14],
    //         // ])
            
    //         // console.log(res)

    //         // // const res1 = await service.get('cars', ['sho1', 'sho2'])
    //         // // console.log(res1)

    //         // const res2 = await service.remove('cars', ['sho1', 'sho2'])
    //         // console.log(res2)

    //         // const res3 = await service.getNearby('cars', [10.10, 11.11], 500000000)
    //         // console.log(res3)
    //     },
    // })
}