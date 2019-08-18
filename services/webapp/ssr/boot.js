
import { registerAction, FINISH } from '@forrestjs/hooks'
import { createHookApp, logBoot } from '@forrestjs/hooks'

require('es6-promise').polyfill()
require('isomorphic-fetch')

process.env.NODE_ENV === 'development' && registerAction({
    hook: FINISH,
    name: '♦ boot',
    handler: () => logBoot(),
})

export default createHookApp({
    services: [
        require('@forrestjs/service-env'),
        require('@forrestjs/service-logger'),
        require('./services/service-redis'),
        // require('./services/service-redis-geo'),
        // require('@forrestjs/service-jwt'),
        // require('@forrestjs/service-express'),
        // require('@forrestjs/service-express-cookies'),
        // require('@forrestjs/service-express-graphql'),
        // require('@forrestjs/service-express-graphql-test'),
        // require('@forrestjs/service-express-ssr'),
        // require('./services/service-express-session'),
        // require('./services/service-express-device'),
        // require('./services/service-express-request'),
        // require('@forrestjs/service-hash'),
        // require('@forrestjs/service-postgres'),
        // require('@forrestjs/service-postgres-pubsub'),
        // require('./services/service-elasticsearch'),
        // require('./services/service-fetchq'),
        // require('./services/service-firebase'),
        // require('./services/service-heremaps'),
    ],
    features: [
        // require('@forrestjs/feature-locale'),
        // require('./features/extensions'),
        // require('./features/feature-pg-auth'),
        // require('./features/feature-pg-session'),
        // require('./features/feature-pg-session-info'),
        // require('./features/feature-pg-session-history'),
        // require('./features/feature-pg-settings'),
        // require('./features/feature-pg-memcached'),
    ],
    settings: ({ setConfig, getEnv }) => {
        // setConfig('expressSSR', {
        //     // multilanguage cache policy
        //     shouldCache: (req) => (req.query.locale === undefined),
        //     getCacheKey: (req) => ({ value: [ req.url, req.locale.language, req.locale.region ] }),
        // })

        // setConfig('fetchq', {
        //     logLevel: getEnv('LOG_LEVEL'),
        //     connect: {
        //         host: getEnv('PG_HOST'),
        //         port: getEnv('PG_PORT'),
        //         database: getEnv('PG_DATABASE'),
        //         user: getEnv('PG_USERNAME'),
        //         password: getEnv('PG_PASSWORD'),
        //     },
        // })

        // setConfig('hash.rounds', getEnv('HASH_ROUNDS'))

        // setConfig('elasticsearch', {
        //     'default': {
        //         nodes: getEnv('ELS_NODES'),
        //         indexes: getEnv('ELS_INDEXES'),
        //     },
        // })

        // setConfig('postgres.connections', [
        //     {
        //         connectionName: 'default',
        //         host: getEnv('PG_HOST'),
        //         port: getEnv('PG_PORT'),
        //         database: getEnv('PG_DATABASE'),
        //         username: getEnv('PG_USERNAME'),
        //         password: getEnv('PG_PASSWORD'),
        //         maxAttempts: Number(getEnv('PG_MAX_CONN_ATTEMPTS', 25)),
        //         attemptDelay: Number(getEnv('PG_CONN_ATTEMPTS_DELAY', 5000)),
        //         models: [],
        //     },
        // ])

        // setConfig('postgresPubSub', [{
        //     host: getEnv('PG_HOST'),
        //     port: getEnv('PG_PORT'),
        //     database: getEnv('PG_DATABASE'),
        //     username: getEnv('PG_USERNAME'),
        //     password: getEnv('PG_PASSWORD'),
        // }])

        // setConfig('jwt', {
        //     secret: getEnv('JWT_SECRET'),
        //     duration: getEnv('JWT_DURATION'),
        // })

        // setConfig('redis', {
        //     port: getEnv('REDIS_PORT'),
        //     host: getEnv('REDIS_HOST'),
        //     password: getEnv('REDIS_PASSWORD'),
        // })

        // setConfig('heremaps', {
        //     appId: getEnv('HEREMAPS_APP_ID'),
        //     appCode: getEnv('HEREMAPS_APP_CODE'),
        // })

        // setConfig('firebase', {
        //     appName: 'default',
        //     projectId: getEnv('FIREBASE_PROJECT_ID'),
        //     privateKeyId: getEnv('FIREBASE_PRIVATE_KEY_ID'),
        //     privateKey: getEnv('FIREBASE_PRIVATE_KEY'),
        //     clientEmail: getEnv('FIREBASE_CLIENT_EMAIL'),
        //     clientId: getEnv('FIREBASE_CLIENT_ID'),
        //     clientCertUrl: getEnv('FIREBASE_CLIENT_CERT_URL'),
        //     databaseUrl: getEnv('FIREBASE_DATABASE_URL'),
        //     storageBucket: getEnv('FIREBASE_STORAGE_BUCKET'),
        // })
    },
})
