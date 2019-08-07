# service-firebase

Connects to a firebase app. For more ways on how to use it check firebase SDK.
SDK reference: https://firebase.google.com/docs/reference/admin

## Usage

```js
import * as firebase from 'src/services/service-firebase/firebase.lib.js'
firebase.getDocById('collection-name', 'user-id')
firebase.getFileByKey('path/to/file')
firebase.getAuthById('user-id')
firebase.getClient() // do what ever action
```

## Required eniroment variables

```js
registerAction({
    hook: SETTINGS,
    name: '♦ boot',
    handler: async ({ setConfig, getEnv }) => {
        setConfig('firebase', {
            appName: 'default',
            projectId: getEnv('FIREBASE_PROJECT_ID'),
            privateKeyId: getEnv('FIREBASE_PRIVATE_KEY_ID'),
            privateKey: getEnv('FIREBASE_PRIVATE_KEY'),
            clientEmail: getEnv('FIREBASE_CLIENT_EMAIL'),
            clientId: getEnv('FIREBASE_CLIENT_ID'),
            clientCertUrl: getEnv('FIREBASE_CLIENT_CERT_URL'),
            databaseUrl: getEnv('FIREBASE_DATABASE_URL'),
            storageBucket: getEnv('FIREBASE_STORAGE_BUCKET'),
        })
    },
})
```