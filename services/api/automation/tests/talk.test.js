/* eslint-disable */

const { createDbConnection } = require('../lib/db')
const { createProfile, profiles } = require('../lib/create-profile')
const { jsonDecode } = require('../lib/json-encode')
const graphQLTest = require('../lib/graphql-test-queries')
const graphQLRequest = require('../lib/graphql-request')

describe('Talk', function () {
    this.timeout(1000 * 60 * 5)
    const db = createDbConnection()
    let user1 = null
    let user2 = null

    before(async function () {
        await db.start()
    })
    
    after(async function () {
        await db.stop()
    })

    // beforeEach(async function () {
    //     // await db.truncateAll()

    //     // // signup
    //     // user1 = await createProfile(profiles.MPEG, {})
    //     // user2 = await createProfile(profiles.MFF, {})

    //     // // login
    //     // await user1.login()
    //     // await user2.login()
    // })

    async function testUsers (p1, p2) {
        await db.truncateAll()
        const user1 = await createProfile(p1, {})
        const user2 = await createProfile(p2, {})

        // login
        await user1.login()
        await user2.login()

        // connect
        await user1.connectionRequest(user2.identity.id)
        let q = await graphQLRequest(graphQLTest.getConnectionIn, {
            targetId: user2.identity.id,
        })
        q = jsonDecode(q.body.data.test.getConnectionIn)
        await user2.acceptConnectionRequest(q[0].originId)

        const res = await graphQLRequest(graphQLTest.getTalkRoomsRawData)
        const rooms = jsonDecode(res.body.data.test.getTalkRoomsRawData)

        const test = rooms.every(item => item.status.length === 2)
        if (!test) throw new Error('some status does not get created')
    }

    const tests = [
        [ profiles.MPEG, profiles.MFF ],
        [ profiles.MFF, profiles.MPEG ],
        [ profiles.MUSTI, profiles.MPEG ],
        [ profiles.MUSTI, profiles.MFF ],
    ]
    
    tests.map(u => it(`${u[0].uname} -> ${u[1].uname}`, async function () {
        await testUsers(u[0], u[1])
    }))

    async function connect(user1, user2) {
        await user1.connectionRequest(user2.identity.id)
        let q = await graphQLRequest(graphQLTest.getConnectionIn, {
            targetId: user2.identity.id,
        })
        q = jsonDecode(q.body.data.test.getConnectionIn)
        await user2.acceptConnectionRequest(q[0].originId)
    }

    it('Should handle multiple connections', async function () {
        await db.truncateAll()
        const user1 = await createProfile(profiles.MUSTI, {})
        const user2 = await createProfile(profiles.MPEG, {})

        await user1.login()
        await user2.login()

        console.log('connect user1 -> user2')
        await connect(user1, user2)

        const user3 = await createProfile(profiles.MFF, {})
        await user2.login()

        console.log('connect user2 -> user1')
        await connect(user3, user1)
        console.log('connect user3 -> user2')
        await connect(user3, user2)
        
    })
})
