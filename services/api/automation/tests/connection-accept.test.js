/* eslint-disable */
const assert = require('assert')
const request = require('superagent')
const pause = require('@marcopeg/utils/lib/pause')
const { createDbConnection } = require('../lib/db')
const { createProfile, profiles } = require('../lib/create-profile')

const graphQLTest = require('../lib/graphql-test-queries')
const graphQLRequest = require('../lib/graphql-request')
const { jsonDecode } = require('../lib/json-encode')

describe('Accept Connection Invite', function () {
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
        await db.query('truncate rel_connections;')
        await db.query('truncate rel_talk_rooms;')
        await db.query('truncate rel_talk_rooms_statuses;')
    })

    it('should establish a connection', async function () {
        // create connection request
        await user1.connectionRequest(user2.identity.id)

        // find connection request
        let q = await graphQLRequest(graphQLTest.getConnectionIn, {
            targetId: user2.identity.id,
        })
        q = jsonDecode(q.body.data.test.getConnectionIn)
        
        // accept connection
        await user2.acceptConnectionRequest(q[0].originId)
        let q2 = await graphQLRequest(graphQLTest.getConnection)
        q2 = jsonDecode(q2.body.data.test.getConnection)

        assert.equal(q2.length, 1)
        assert.equal(q2[0].p1, user2.identity.id)
        assert.equal(q2[0].p2, user1.identity.id)
    })

    it('should clear out connection request after accepting', async function () {
        // create connection request
        await user1.connectionRequest(user2.identity.id)

        // find connection request
        let q = await graphQLRequest(graphQLTest.getConnectionIn, {
            targetId: user2.identity.id,
        })
        q = jsonDecode(q.body.data.test.getConnectionIn)
        
        // accept connection
        await user2.acceptConnectionRequest(q[0].originId)

        // connection request should be cleared out
        let q2 = await graphQLRequest(graphQLTest.getConnectionIn)
        q2 = jsonDecode(q2.body.data.test.getConnectionIn)

        let q3 = await graphQLRequest(graphQLTest.getConnectionOut)
        q3 = jsonDecode(q3.body.data.test.getConnectionOut)
        
        assert.equal(q2.length, 0)
        assert.equal(q3.length, 0)
    })

    it('should create a new talk room', async function () {
        // create connection request
        await user1.connectionRequest(user2.identity.id)

        // find connection request
        let q = await graphQLRequest(graphQLTest.getConnectionIn, {
            targetId: user2.identity.id,
        })
        q = jsonDecode(q.body.data.test.getConnectionIn)

        // accept connection
        await user2.acceptConnectionRequest(q[0].originId)

        // talk room should be created
        let q2 = await graphQLRequest(graphQLTest.getTalkRoom, {
            participants: [user2.identity.id, user1.identity.id],
        })
        q2 = jsonDecode(q2.body.data.test.getTalkRoom)
        
        assert.equal(!!q2, true)
    })
})