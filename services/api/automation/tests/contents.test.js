/* eslint-disable */
const assert = require('assert')
const request = require('superagent')
const { url, graphqlUrl } = require('../lib/url')
const { createDbConnection } = require('../lib/db')
const { createProfile, profiles } = require('../lib/create-profile')
// const mutations = require('../lib/graphql-mutations')

describe.skip('contents', function () {
    this.timeout(1000 * 60 * 5)
    const db = createDbConnection()

    let user = null
    let post = null

    before(async function () {
        await db.start()
        await db.truncateAll()
        user = await createProfile(profiles.MPEG, {
            confirmEmail: true,
        })
        await user.login()
        await db.query(`update rel_profiles set "grant" = '{user,admin}' where id = ${user.identity.id}`)
    })

    after(async function () {
        await db.stop()
    })

    // res.message is a json encoded payload containing at least the postId
    it('should create a post', async function () {
        const res = await request
            .post(graphqlUrl())
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${user.jwt}`)
            .send({
                query: mutations.createPost,
                variables: {
                    type: 'default',
                    tags: ['news'],
                    payload: JSON.stringify({
                        title: 'foo',
                    })
                },
            })
        // retrieve the new post's data for future operations
        post = JSON.parse(res.body.data.session.admin.createPost.message)
    })

    it('should add a like to the post', async function () {
        const res = await request
            .post(graphqlUrl())
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${user.jwt}`)
            .send({
                query: mutations.postLike,
                variables: {
                    postId: post.id,
                    value: true,
                },
            })
        // console.log('add like', res.body.data.session.posts)
    })


})
