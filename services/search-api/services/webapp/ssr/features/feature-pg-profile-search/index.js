import * as hooks from './hooks'
import { POSTGRES_BEFORE_START } from '@forrestjs/service-postgres/lib/hooks'

import * as profileSearchModel from './profile-search.model'

import * as pg from '@forrestjs/service-postgres'

export default ({ registerAction, registerHook }) => {
    registerHook(hooks)

    registerAction({
        hook: `${POSTGRES_BEFORE_START}/searchapi`,
        name: hooks.FEATURE_NAME,
        handler: ({ registerModel }) => {
            registerModel(profileSearchModel)
        },
    })

    registerAction({
        hook: '$START_FEATURE',
        name: hooks.FEATURE_NAME,
        handler: async ({}, ctx) => {
            const data = {}
            pg.getModel('ProfileSearch').create(data)

            // const res = await pg.getModel('ProfileSearch').findOne({
            //     raw: true,
            // })


            // console.log(decrypt(res.payload))
        }
    })
}