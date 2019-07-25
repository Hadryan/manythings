/* eslint-disable */
const assert = require('assert')
const request = require('superagent')

const { createDbConnection } = require('../lib/db')
const { headers2jwt } = require('../lib/headers2jwt')
const { createProfile, profiles } = require('../lib/create-profile')

describe('Confirm email user', function () {
    this.timeout(1000 * 60 * 5)
    const db = createDbConnection()
    const users = {}
    
    before(async function () {
        await db.start()
        await db.truncateAll()
    })

    after(async function () {
        await db.stop()
    })

    it('should create user: mpeg', async function () {
        users.mpeg = await createProfile(profiles.MPEG, {})
    })

})
