/* eslint-disable */
const assert = require('assert')
const request = require('superagent')
const { createDbConnection } = require('../lib/db')
const { createProfile, profiles } = require('../lib/create-profile')

const graphQLTest = require('../lib/graphql-test-queries')
const graphQLRequest = require('../lib/graphql-request')
const { jsonDecode } = require('../lib/json-encode')

describe('Connection Request', function () {
    this.timeout(1000 * 60 * 5)
    const db = createDbConnection()
    let user1 = null
    let user2 = null
    
    before(async function () {
        await db.start()
        await db.truncateAll()
        user1 = await createProfile(profiles.MPEG, {})
        user2 = await createProfile(profiles.MFF, {})
        await user1.login()
        await user2.login()
    })

    after(async function () {
        await db.stop()
    })

    beforeEach(async function () {
        await db.query('truncate rel_connections_out;')
        await db.query('truncate rel_connections_in;')
    })

    it('should create an outbound connection request', async function () {
        // create connection request
        await user1.connectionRequest(user2.identity.id)

        // find connection request
        let q = await graphQLRequest(graphQLTest.getConnectionOut, {
            originId: user1.identity.id,
            targetId: user2.identity.id,
        })
        q = jsonDecode(q.body.data.test.getConnectionOut)
        
        assert.equal(q.length, 1)
    })

    it('should create an inbound connection request', async function () {
        // create connection request
        await user1.connectionRequest(user2.identity.id)
        
        // find connection request
        let q = await graphQLRequest(graphQLTest.getConnectionIn, {
            originId: user1.identity.id,
            targetId: user2.identity.id,
        })
        q = jsonDecode(q.body.data.test.getConnectionIn)

        assert.equal(q.length, 1)
    })

    it('should ignore multiple requests', async function () {
        await user1.connectionRequest(user2.identity.id)
        await user1.connectionRequest(user2.identity.id)
        
        // find connection request
        let q = await graphQLRequest(graphQLTest.getConnectionIn, {
            originId: user1.identity.id,
            targetId: user2.identity.id,
        })
        q = jsonDecode(q.body.data.test.getConnectionIn)

        assert.equal(q.length, 1)
    })

    it('should accept mirrored requests', async function () {
        await user1.connectionRequest(user2.identity.id)
        await user2.connectionRequest(user1.identity.id)

        let r1 = await graphQLRequest(graphQLTest.getConnectionIn)
        r1 = jsonDecode(r1.body.data.test.getConnectionIn)
        assert.equal(r1.length, 2)

        let r2 = await graphQLRequest(graphQLTest.getConnectionOut)
        r2 = jsonDecode(r2.body.data.test.getConnectionOut)
        assert.equal(r2.length, 2)
    })
})