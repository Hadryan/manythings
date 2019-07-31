
import { POSTGRES_BEFORE_START } from '@forrestjs/service-postgres/lib/hooks'

import * as memcachedModel from './memcached.model'
import * as hooks from './hooks'
// import { set, get, remove } from './memcached.lib'

export default ({ registerAction, registerHook }) => {
    registerHook(hooks)

    registerAction({
        hook: `${POSTGRES_BEFORE_START}/searchapi`,
        name: hooks.FEATURE_NAME,
        handler: ({ registerModel }) => {
            registerModel(memcachedModel)
        },
    })

    // registerAction({
    //     hook: '$START_FEATURE',
    //     name: hooks.FEATURE_NAME,
    //     handler: async () => {
    //         // set('1', { name: 'ali'}, ['user', 'google'])
    //         // console.log(await get('1'))
    //         // console.log(await remove('1'))
    //     },
    // })
}