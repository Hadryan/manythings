
import { POSTGRES_BEFORE_START } from '@forrestjs/service-postgres/lib/hooks'

import * as settingsModel from './settings.model'
import * as hooks from './hooks'
import { start } from './settings.lib'

export default ({ registerAction, registerHook }) => {
    registerHook(hooks)

    // Add Auth Data Model
    registerAction({
        hook: `${POSTGRES_BEFORE_START}/searchapi`,
        name: hooks.FEATURE_NAME,
        handler: ({ registerModel }) => {
            registerModel(settingsModel)
        },
    })

    registerAction({
        hook: '$START_FEATURE',
        name: hooks.FEATURE_NAME,
        handler: start,
    })
}