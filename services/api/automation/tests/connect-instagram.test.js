/* eslint-disable */
const assert = require('assert')
const request = require('superagent')

const { createDbConnection } = require('../lib/db')
const { headers2jwt } = require('../lib/headers2jwt')
const { createProfile, profiles } = require('../lib/create-profile')

const graphQLTest = require('../lib/graphql-test-queries')
const graphQLRequest = require('../lib/graphql-request')
const { jsonDecode } = require('../lib/json-encode')

describe('Connect Instagram', function () {
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
        user = await createProfile(profiles.MPEG, {
            confirmEmail: true,
        })
    })

    it('should add social info into the profile', async function () {
        // connect instagram channel
        const username = 'alialfredji'
        await user.connectInstagram(username)

        // get profile data
        let profileData = await graphQLRequest(graphQLTest.getProfileByUname, {
            uname: user.profile.uname,
        })
        profileData = jsonDecode(profileData.body.data.test.getProfileByUname)

        // fetch instagram channel 
        let channelData = await graphQLRequest(graphQLTest.getChannel, {
            profileId: profileData.id,
            vendor: 'instagram',
        })
        channelData = jsonDecode(channelData.body.data.test.getChannel)

        // test if channel has the same username as when first connected
        assert.deepEqual(username, channelData.username)
    })

})
