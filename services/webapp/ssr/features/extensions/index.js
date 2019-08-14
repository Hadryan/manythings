
import * as hooks from './hooks'

import * as pg from '@forrestjs/service-postgres'
import * as serviceJwt from '@forrestjs/service-jwt';

export default ({ registerHook, registerAction }) => {
    registerAction({
        hook: '$EXPRESS_ROUTE',
        name: hooks.FEATURE_NAME,
        trace: __filename,
        handler: ({ registerRoute }, ctx) => {
            registerRoute.get('/ig_profile/:id', async (req, res) => {
                const queryStr = [
                    'select * from ig_profile',
                    'where profile_id = :profileId',
                    'limit 10',
                ].join(' ')
                const res1 = await pg.query(queryStr, {
                    replacements: {
                        profileId: req.params.id,
                    },
                }, 'cerberus')


                await serviceJwt.verify(req.headers['x-grapi-signature'], '123')
                res.send(res1[0])
            })
            // console.log('shoo')
            // const config = buildConfig(ctx)
            // registerMiddleware(addAuth(config, ctx))
        },
    })

    registerAction({
        hook: '$START_FEATURE',
        name: hooks.FEATURE_NAME,
        trace: __filename,
        handler: async ({}) => {
            
        },
    })
}
