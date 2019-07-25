/* eslint-disable */
const assert = require('assert')
const request = require('superagent')

const { createDbConnection } = require('../lib/db')

describe('Clean up database', function () {
    this.timeout(1000 * 60 * 5)
    const db = createDbConnection()

    it('should clean up the db', async function () {
        await db.start()
        await db.truncateAll()
        await db.stop()
    })

})
