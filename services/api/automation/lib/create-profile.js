const request = require('superagent')
const { headers2jwt } = require('./headers2jwt')
const { url } = require('./url')
const profiles = require('./create-profile.fixture')

const graphQLWorker = require('./graphql-worker-queries')
const graphQLSession = require('./graphql-session-queries')
const graphQLMisc = require('./graphql-misc-queries')
const graphQLRequest = require('./graphql-request')
const { createDbConnection } = require('./db')
/*
settings = {
    confirmEmail: true,
    connectInstagram: [null|@username],
}
*/

class Profile {
    constructor (profile = null) {
        this.profile = profile
        this.jwt = null
        this.identity = null
        this.db = createDbConnection()
    }

    setProfile (profile) {
        this.profile = profile
    }

    async getLegalDocument (name) {
        const res = await graphQLRequest(graphQLMisc.getLegalDocument, {
            name,
        }, this.jwt)

        return res.body.data.misc.getDocument
    }

    async create () {
        try {
            const terms = await this.getLegalDocument('terms')
            const privacy = await this.getLegalDocument('privacy')
            const res = await request
                .post(url('/v1/signup'))
                .set('Accept', 'application/json')
                .send({
                    ...this.profile,
                    terms,
                    privacy,
                })
            this.jwt = headers2jwt(res)
        } catch (err) {
            this.error = err
            if (err.response) {
                throw new Error(err.response.text)
            }
            throw err
        }
        return this
    }

    async makeAdmin () {
        await this.db.query(`UPDATE "public"."rel_profiles" SET "grant"='{user,admin}' WHERE "uname"='${this.profile.uname}'`)
    }

    async login (uname = null, passwd = null) {
        try {
            const res = await request
                .post(url('/v1/auth'))
                .set('Accept', 'application/json')
                .send({
                    uname: uname || this.profile.uname,
                    passwd: passwd || this.profile.passwd,
                })
            this.jwt = headers2jwt(res)
            this.identity = res.body
        } catch (err) {
            this.error = err
            throw new Error(err.response.text)
        }
        return this
    }

    async getProfile () {
        try {
            const res = await request
                .get(url('/v1/auth'))
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${this.jwt}`)
            return res.body
        } catch (err) {
            this.error = err
            throw new Error(err.response.text)
        }
        return this
    }

    async confirmEmail () {
        try {
            await request
                .get(url(`/v1/signup/activate/000000/${this.profile.uname}`))
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${this.jwt}`)
        } catch (err) {
            this.error = err
            throw new Error(err.response.text)
        }
        return this
    }

    async connectInstagram (username = null) {
        try {
            let res1 = await graphQLRequest(graphQLSession.findInstagram, {
                uname: username || this.profile.uname,
            }, this.jwt)

            if (res1.body.errors) throw res1.body.errors[0]

            res1 = res1.body.data.session.socialmedia.findInstagram

            await graphQLRequest(graphQLSession.verifyInstagram, {
                uname: res1.profile.username,
                code: res1.code,
                postCode: res1.postCode,
            }, this.jwt)
        } catch (err) {
            this.error = err
            if (err.response) {
                throw new Error(err.response.text)
            }
            throw err
        }
        return this
    }

    async connectYoutube (username = null) {
        try {
            let res1 = await graphQLRequest(graphQLSession.searchYoutube, {
                uname: username || this.profile.uname,
            }, this.jwt)

            if (res1.body.errors) throw res1.body.errors[0]
            res1 = res1.body.data.session.socialmedia.searchYoutube

            let res2 = await graphQLRequest(graphQLSession.findYoutube, {
                channelId: res1[0].id,
            }, this.jwt)

            if (res2.body.errors) throw res2.body.errors[0]
            res2 = res2.body.data.session.socialmedia.findYoutube

            await graphQLRequest(graphQLSession.verifyYoutube, {
                channelId: res2.profile.id,
                code: res2.code,
                videoId: res2.videoId,
            }, this.jwt)
        } catch (err) {
            this.error = err
            if (err.response) {
                throw new Error(err.response.text)
            }
            throw err
        }
        return this
    }

    async getDiscovery () {
        try {
            const res = await graphQLRequest(graphQLSession.getDiscoveryProfiles, {}, this.jwt)
            return res.body.data.session.discovery
        } catch (err) {
            this.error = err
            throw new Error(err.response.text)
        }
    }

    async connectionRequest (targetId) {
        try {
            const res = await graphQLRequest(graphQLSession.sendConnection, {
                targetId: Number(targetId),
            }, this.jwt)

            return res.body
        } catch (err) {
            this.error = err
            throw new Error(err.response.text)
        }
    }

    // accept a request from a specific user
    async acceptConnectionRequest (originId) {
        try {
            const res = await graphQLRequest(graphQLSession.acceptConnection, {
                originId,
                profileId: originId,
            }, this.jwt)

            return res.body
        } catch (err) {
            this.error = err
            throw new Error(err.response.text)
        }
    }

    async buildProfile (profileId = null) {
        try {
            const res = await graphQLRequest(graphQLWorker.buildProfile, {
                token: 'test-token',
                profileId: Number(profileId || this.identity.id),
            })

            return res.body
        } catch (err) {
            this.error = err
            throw new Error(err.response.text)
        }
    }

    async buildConnections (profileId) {
        try {
            const res = await graphQLRequest(graphQLWorker.buildConnections, {
                token: 'test-token',
                profileId: Number(profileId),
            })

            return res.body
        } catch (err) {
            this.error = err
            throw new Error(err.response.text)
        }
    }

    async buildTalk (profileId) {
        try {
            const res = await graphQLRequest(graphQLWorker.buildTalk, {
                token: 'test-token',
                profileId: Number(profileId),
            })

            return res.body
        } catch (err) {
            this.error = err
            throw new Error(err.response.text)
        }
    }

    async importPosts (gdoc) {
        try {
            const res = await graphQLRequest(graphQLSession.importPosts, {
                gdoc,
            }, this.jwt)

            return res.body
        } catch (err) {
            this.error = err
            throw new Error(err.response.text)
        }
    }

    get (endpoint = '/') {
        return request
            .get(url(endpoint))
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${this.jwt}`)
    }

    post (endpoint = '/', data = {}) {
        return request
            .post(url(endpoint))
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${this.jwt}`)
            .send(data)
    }
}

const createProfile = async (profile, settings = {}) => {
    const instance = new Profile(profile)
    try {
        await instance.create()
        if (settings.confirmEmail) {
            await instance.confirmEmail()
        }
        if (settings.connectInstagram) {
            await instance.connectInstagram(settings.connectInstagram !== true ? settings.connectInstagram : null)
        }
        if (settings.login) {
            await instance.login()
        }
    } catch (err) {
        throw err
    }
    return instance
}

module.exports = {
    createProfile,
    profiles,
    Profile,
}
