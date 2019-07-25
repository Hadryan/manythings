/* eslint-disable */
const assert = require('assert')
const request = require('superagent')

const { createDbConnection } = require('../lib/db')
const { headers2jwt } = require('../lib/headers2jwt')
const { url, graphqlUrl } = require('../lib/url')

describe('Signup', function () {

    const db = createDbConnection()
    let termsDocument = null
    let privacyDocument = null
    
    before(async function () {
        await db.start()

        const termsDoc = await request
                .post(graphqlUrl())
                .set('Accept', 'application/json')
                .send({
                    query: `query Q {
                        misc {
                          getDocument(name:"terms") {
                            name version title text html released payload checksum 
                        }}}`,
                })
        
        const privacyDoc = await request
                .post(graphqlUrl())
                .set('Accept', 'application/json')
                .send({
                    query: `query Q {
                        misc {
                          getDocument(name:"privacy") {
                            name version title text html released payload checksum 
                        }}}`,
                })
        
        termsDocument = termsDoc.body.data.misc.getDocument
        privacyDocument = privacyDoc.body.data.misc.getDocument
    })

    after(async function () {
        await db.stop()
    })

    // all those tests are dependedn on each other because they
    // simulate a signup session
    describe('happy case', function () {
        let jwt = null

        before(async function () {
            await db.truncateAll()
        })

        it('should validate username', async function () {
            const res = await request
                .post(url('/v1/signup/uname'))
                .set('Accept', 'application/json')
                .send({ uname: 'mpeg' })
                
            jwt = headers2jwt(res)    
        })

        it('should validate email', async function () {
            try {
                await request
                    .post(url('/v1/signup/email'))
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${jwt}`)
                    .send({ email: 'marco.pegoraro@gmail.com' })
            } catch (err) {
                throw new Error(`${err.response.status} ${err.response.text}`)
            }
        })

        it('should validate password', async function () {
            try {
                await request
                    .post(url('/v1/signup/passwd'))
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${jwt}`)
                    .send({ passwd: '12345' })
            } catch (err) {
                throw new Error(`${err.response.status} ${err.response.text}`)
            }
        })

        // @TODO: verify the jwt that we get back?
        // -- it should define a short session --
        it('should finalize signup', async function () {
            this.timeout(5000)
            try {
                await request
                    .post(url('/v1/signup'))
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${jwt}`)
                    .send({
                        uname: 'mpeg',
                        email: 'marco.pegoraro@gmail.com',
                        passwd: '12345',
                        terms: {
                            name: termsDocument.name,
                            version: termsDocument.version,
                            checksum: termsDocument.checksum,
                        },
                        privacy: {
                            name: privacyDocument.name,
                            version: privacyDocument.version,
                            checksum: privacyDocument.checksum,
                        },
                    })
            } catch (err) {
                throw new Error(`${err.response.status} ${err.response.text}`)
            }
        })

        it('should activate the account', async function () {
            try {
                await request
                    .get(url('/v1/signup/activate/000000/mpeg'))
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${jwt}`)
            } catch (err) {
                throw new Error(`${err.response.status} ${err.response.text}`)
            }
        })
    })

})
