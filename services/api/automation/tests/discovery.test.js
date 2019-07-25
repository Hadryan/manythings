/* eslint-disable */
const assert = require('assert')
const request = require('superagent')
const pause = require('@marcopeg/utils/lib/pause')
const { createDbConnection } = require('../lib/db')
const { createProfile, profiles } = require('../lib/create-profile')

describe('Discovery - search profiles', function () {
    this.timeout(1000 * 60 * 5)
    const db = createDbConnection()
    let user1 = null
    let user2 = null
    let user3 = null
    let user4 = null
    let user5 = null
    
    before(async function () {
        await db.start()
        await db.truncateAll()
        user1 = await createProfile(profiles.MPEG, {
            confirmEmail: true,
            connectInstagram: true,
        })
        user2 = await createProfile(profiles.ALI, {
            confirmEmail: true,
            connectInstagram: true,
        })
        user3 = await createProfile(profiles.MUSTI, {
            confirmEmail: true,
            connectInstagram: true,
        })
        user4 = await createProfile(profiles.ALISSA, {
            confirmEmail: true,
        })
        user5 = await createProfile(profiles.EMMA, {})
        await user1.login()
        await user2.login()
        await user3.login()
        await user1.buildProfile(user1.identity.id)
        await user2.buildProfile(user2.identity.id)
        await user3.buildProfile(user3.identity.id)
    })

    after(async function () {
        await db.stop()
    })

    it('should receive a list of enabled profiles', async function () {
        const r = await user1.getDiscovery()
        assert.equal(r.profiles.length, 1)
    })
})