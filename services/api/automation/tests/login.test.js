/* eslint-disable */
const assert = require('assert')
const request = require('superagent')

const { createDbConnection } = require('../lib/db')
const { headers2jwt } = require('../lib/headers2jwt')
const { createProfile, profiles } = require('../lib/create-profile')

describe('Login', function () {
    this.timeout(10000)
    const db = createDbConnection()
    
    before(async function () {
        await db.start()
    })

    after(async function () {
        await db.stop()
    })

    describe('login into active account - MPEG', function () {
        let user = null

        beforeEach(async function () {
            await db.truncateAll()
            user = await createProfile(profiles.MPEG, {
                confirmEmail: true,
            })
        })

        it('should login', async function () {
            await user.login()
        })

        it('should receive a profile', async function () {
            await user.login()
            const profile = await user.getProfile()
            // console.log(profile)
        })
    })
})
