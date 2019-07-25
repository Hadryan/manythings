/* eslint-disable */
const assert = require('assert')
const request = require('superagent')
const pause = require('@marcopeg/utils/lib/pause')
const { createDbConnection } = require('../lib/db')
const { createProfile, profiles } = require('../lib/create-profile')

describe.skip('Notifications', function () {
    this.timeout(1000 * 60 * 5)
    const db = createDbConnection()
    let user1 = null
    let user2 = null
    
    before(async function () {
        await db.start()
        await db.truncateAll()
        await db.query('TRUNCATE fetchq_sys_metrics')
        await db.query('TRUNCATE fetchq_sys_metrics_writes')

        user1 = await createProfile(profiles.MPEG, {
            confirmEmail: true,
        })
        user2 = await createProfile(profiles.ALI, {
            confirmEmail: true,
        })
        await user1.login()
        await user2.login()
        await user1.buildProfile()
        await user2.buildProfile()
    })

    after(async function () {
        await db.stop()
    })

    it('should upsert a notification', async function () {
        const r = await user1.notify(user2.identity.id, 'talk', { count: 4 })
        assert.equal(r.data.worker.sendNotification.success, true)
        await db.query('SELECT * FROM fetchq_mnt()')
        const r1 = await db.query(`SELECT * FROM fetchq_metric_get('prf::${user2.identity.id}', 'talk')`)
        assert.equal(r1[0][0].current_value, 1)
    })
})