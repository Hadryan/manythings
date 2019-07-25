import * as hooks from './hooks'

let encryptor = null

export const encrypt = (value) =>
    encryptor.encrypt(value)

export const decrypt = (value) =>
    encryptor.decrypt(value)

export default ({ registerAction, registerHook, ...ctx }) => {
    registerHook(hooks)

    registerAction({
        hook: '$INIT_SERVICE',
        name: hooks.FEATURE_NAME,
        handler: ({ getConfig }) => {
            encryptor = require('simple-encryptor')({
                key: getConfig('simple-encryptor.token'),
                hmac: false,
                debug: true,
            })
        }
    })
}
