/* eslint-disable */
const assert = require('assert')
const pause = require('@marcopeg/utils/lib/pause')
const { createDbConnection } = require('../lib/db')
const { createProfile, profiles } = require('../lib/create-profile')

describe.skip('service/sendmail', function () {
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
            // confirmEmail: true,
            login: true,
        })
    })

    it('should queue the email', async function () {
        const res = await db.query([
            'select count(*) from sendmail',
            `where ref_type='signup:confirm'`,
            `and ref_id='${user.identity.id}'`
        ].join(' '))
        assert.equal(res[0][0].count, 1)
    })

    // @TODO: can we do it in a while loop?
    it.skip('should send the email', async function () {
        this.timeout(18000)
        await pause(10000)
        const res = await db.query([
            'select count(*) from sendmail',
            `where ref_type='signup:confirm'`,
            `and ref_id='${user.identity.id}'`,
            'and was_sent=true'
        ].join(' '))
        assert.equal(res[0][0].count, 1)
    })
})

