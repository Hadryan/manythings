/* eslint-disable */
const assert = require('assert')
const request = require('superagent')

const { url, graphqlUrl } = require('../lib/url')
const { createDbConnection } = require('../lib/db')
const { headers2jwt } = require('../lib/headers2jwt')
const { createProfile, profiles } = require('../lib/create-profile')

describe('Populate Demo Data', function () {
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

    describe('Create basic users', function () {
        
        it('should create user: mpeg', async function () {
            users.mpeg = await createProfile(profiles.MPEG, {
                confirmEmail: true,
                connectInstagram: 'mpeg',
            })
            await users.mpeg.makeAdmin()
        })

        it('should create user: ali', async function () {
            users.ali = await createProfile(profiles.ALI, {
                confirmEmail: true,
                connectInstagram: 'instagram',
            })
            await users.ali.makeAdmin()
        })

        it('should create user: musti', async function () {
            users.musti = await createProfile(profiles.MUSTI, {
                confirmEmail: true,
                connectInstagram: 'mustafaalfredji',
            })
            await users.musti.makeAdmin()
        })

        it('should create user: alissa', async function () {
            users.alissa = await createProfile(profiles.ALISSA, {
                confirmEmail: true,
            })
        })
        
        it('should create user: emma', async function () {
            users.emma = await createProfile(profiles.EMMA, {})
        })
    })

    describe('Create optional users', function () {

        it('should create user: CRISTIANO', async function () {
            users.cristiano = await createProfile(profiles.CRISTIANO, {
                confirmEmail: true,
                connectInstagram: profiles.CRISTIANO.uname,
            })
        })

        it('should create user: EMMAWATSON', async function () {
            users.emmawatson = await createProfile(profiles.EMMAWATSON, {
                confirmEmail: true,
                connectInstagram: profiles.EMMAWATSON.uname,
            })
        })

        it('should create user: ROBERT', async function () {
            users.robert = await createProfile(profiles.ROBERT, {
                confirmEmail: true,
                connectInstagram: profiles.ROBERT.uname,
            })
        })

        it('should create user: REALMADRID', async function () {
            users.realmadrid = await createProfile(profiles.REALMADRID, {
                confirmEmail: true,
                connectInstagram: profiles.REALMADRID.uname,
            })
        })

        it('should create user: ANI', async function () {
            users.ani = await createProfile(profiles.ANI, {
                confirmEmail: true,
                connectInstagram: profiles.ANI.uname,
            })
        })

        it('should create user: MFF', async function () {
            users.mff = await createProfile(profiles.MFF, {
                confirmEmail: true,
                connectInstagram: profiles.MFF.uname,
            })
        })
        
        it('should create user: MEM', async function () {
            users.mem = await createProfile(profiles.MEM, {
                confirmEmail: true,
                connectInstagram: profiles.MEM.uname,
            })
        })

    })

    describe('Login users', function () {
        it('should login mpeg', async function () {
            await users.mpeg.login()
            await users.ali.login()
            await users.musti.login()
        })
    })

    describe('Create connection invitations', function () {
        it('should connect mpeg with ali', async function () {
            await users.mpeg.connectionRequest(users.ali.identity.id)
        })
        it('should connect mpeg with musti', async function () {
            await users.mpeg.connectionRequest(users.musti.identity.id)
        })
        it('should connect mff with musti', async function () {
            await users.mff.connectionRequest(users.musti.identity.id)
        })
        it('should connect emmawatson with musti', async function () {
            await users.emmawatson.connectionRequest(users.musti.identity.id)
        })
        it('should connect ali with musti', async function () {
            await users.ali.connectionRequest(users.musti.identity.id)
        })
        it('should connect robert with musti', async function () {
            await users.robert.connectionRequest(users.musti.identity.id)
        })
        // it.skip('should connect musti with mpeg', async function () {
        //     await users.musti.connectionRequest(users.mpeg.identity.id)
        // })
    })

    describe('Accept invitation', function () {
        it('ali should accept mpeg invite', async function () {
            const res1 = await db.query(`select * from rel_connections_in where profile_id = ${users.ali.identity.id} limit 1;`)
            await users.ali.acceptConnectionRequest(res1[0][0].origin_id)
        })
    })

    describe('import posts', function () {
        it ('should import posts', async function () {
            await users.mpeg.importPosts('1oCXMzWxW-FySQU6_ibDG7uEn_TlIXLDIgPHVRB8sWLY')
        })
    })

    // describe.skip('Populate rel_discovery with geom to do benchmark tests', async function () {
    //     for (let i = 1000; i < 10000; i++) {
    //         const value = Math.random() * i / 120
    //         let q = null

    //         if (value === 0) {
    //             q = [
    //                 'INSERT INTO rel_discovery',
    //                 '(profile_id, username, fan_base, categories, geom, payload, created_at, updated_at)',
    //                 `VALUES ${[
    //                     `(${i + 1},`,
    //                     'NULL,',
    //                     '0,',
    //                     'NULL,',
    //                     `ST_GeomFromText('POINT(-1.3342 13.444402)', 4326),`,
    //                     `'{}',`,
    //                     'NOW(),',
    //                     'NOW())',
    //                 ].join(' ')}`,
    //                 'ON CONFLICT DO NOTHING;',
    //             ].join(' ')
    //         } else {
    //             q = [
    //                 'INSERT INTO rel_discovery',
    //                 '(profile_id, username, fan_base, categories, geom, payload, created_at, updated_at)',
    //                 `VALUES ${[
    //                     `(${i + 1},`,
    //                     'NULL,',
    //                     '0,',
    //                     'NULL,',
    //                     `ST_GeomFromText('POINT(${value / -2} ${value})', 4326),`,
    //                     `'{}',`,
    //                     'NOW(),',
    //                     'NOW())',
    //                 ].join(' ')}`,
    //                 'ON CONFLICT DO NOTHING;',
    //             ].join(' ')
    //         }

    //         const res = await db.query(q)
    //         console.log(res)
    //     }
    // })

})
