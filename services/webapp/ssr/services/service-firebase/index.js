
import * as hooks from './hooks'

import { init } from './firebase.lib'

export default ({ registerAction }) => {
    registerAction({
        hook: '$INIT_SERVICE',
        name: hooks.FEATURE_NAME,
        trace: __filename,
        handler: ({ getConfig }) => init({
            name: getConfig('firebase.appName'),
            databaseURL: getConfig('firebase.databaseUrl'),
            storageBucket: getConfig('firebase.storageBucket'),
            credential: {
                type: getConfig('firebase.type', 'service_account'),
                project_id: getConfig('firebase.projectId'),
                private_key_id: getConfig('firebase.privateKeyId'),
                private_key: getConfig('firebase.privateKey').replace(/\\n/g, '\n'),
                client_email: getConfig('firebase.clientEmail'),
                client_id: getConfig('firebase.clientId'),
                client_x509_cert_url: getConfig('firebase.clientCertUrl'),
                auth_uri: getConfig('firebase.authUri', 'https://accounts.google.com/o/oauth2/auth'),
                token_uri: getConfig('firebase.tokenUri', 'https://oauth2.googleapis.com/token'),
                auth_provider_x509_cert_url: getConfig('firebase.authProviderCertUrl', 'https://www.googleapis.com/oauth2/v1/certs'),
            },
        }),
    })

    // registerAction({
    //     hook: '$START_FEATURE',
    //     name: hooks.FEATURE_NAME,
    //     handler: async () => {
    //         console.log(await getFileByKey('/license/0FhI4dOyqxQcQwEA9oHFNtAzG4H3.jpg'))
    //     }
    // })
}