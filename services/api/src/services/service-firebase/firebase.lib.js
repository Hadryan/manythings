
// https://firebase.google.com/docs/reference/admin
import * as admin from 'firebase-admin'

let client = null

export const getClient = () => client

export const init = (_config) => {
    client = admin.initializeApp({
        credential: admin.credential.cert(_config.credential),
        databaseURL: _config.databaseURL,
        storageBucket: _config.storageBucket,
    }, _config.name)
}

// https://googleapis.dev/nodejs/firestore/latest/CollectionReference.html
export const getDocById = (collection, docId) => new Promise((resolve, reject) => {
    getClient().firestore().collection(collection).doc(docId).get()
        .then(doc => (
            doc.exists
                ? resolve(doc.data())
                : reject('Document not found')
        ))
        .catch(err => reject(err))
})

// https://googleapis.dev/nodejs/storage/latest/File.html
export const getFileByKey = (key) => new Promise((resolve, reject) => {
    getClient().storage().bucket().file(key).download()
        .then(data => (
            !data || !data.length
                ? reject('Buffer not found')
                : resolve(data[0])
        ))
        .catch(err => reject(err))
})