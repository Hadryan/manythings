/* eslint-disable */
const assert = require('assert')
const request = require('superagent')

const graphQLTest = require('../lib/graphql-test-queries')
const graphQLRequest = require('../lib/graphql-request')
const { jsonDecode } = require('../lib/json-encode')

const { createDbConnection } = require('../lib/db')
const { createProfile, profiles } = require('../lib/create-profile')

describe('Build Connections', function () {
    this.timeout(10000)
    const db = createDbConnection()
    let user = null
    
    before(async function () {
        await db.start()
    })

    after(async function () {
        await db.stop()
    })

    beforeEach(async function () {
        await db.truncateAll()
        user = await createProfile(profiles.ALI, {
            confirmEmail: true,
        })
        await user.login()
    })

    it('should build a profile connections in the database', async function () {
        const res = await user.buildConnections(user.identity.id)
        assert.equal(res.errors, null)

        let qres = await graphQLRequest(graphQLTest.getConnectionsSnap, {
            profileId: user.identity.id,
        })

        qres = jsonDecode(qres.body.data.test.getConnectionsSnap)    
        assert.equal(qres.version, 1)
    })

    it('should udpdate a profile connections in the database', async function () {
        const res1 = await user.buildConnections(user.identity.id)
        const res2 = await user.buildConnections(user.identity.id)
        assert.equal(res1.errors, null)
        assert.equal(res2.errors, null)

        let qres = await graphQLRequest(graphQLTest.getConnectionsSnap, {
            profileId: user.identity.id,
        })

        qres = jsonDecode(qres.body.data.test.getConnectionsSnap)
        assert.equal(qres.version, 2)
    })
})
