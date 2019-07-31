// import { Sequelize } from 'sequelize'
import { getModel } from '@forrestjs/service-postgres'
import * as hooks from './hooks'

export const create = async ({ uname, passw, status = 0, payload = {} }, req, res) => {
    const record = await getModel('Auth').register({
        uname,
        passw,
        status,
        payload,
    })

    // @TODO: createHook ???

    return record.get({ plain: true })
}

export const login = async ({ uname, passw }, req, res) => {
    const record = await getModel('Auth').findLogin({ uname, passw })
    if (!record) {
        throw new Error('Login failed')
    }

    // Initialize a new session if doesn't exits and connect it with the
    // authenticated account.
    await req.session.validate()

    // Decorate the session JWT with the identity informations.
    const auth = {
        auth_id: record.id,
        auth_etag: record.etag,
        auth_grants: record.payload.grants,
    }

    await req.session.set(auth)
    await req.session.write(auth)

    // Login Hook
    await req.hooks.createHook.serie(hooks.PG_AUTH_LOGIN, { req, res })

    await getModel('Auth').bumpLastLogin(record.id)
    return record.get({ plain: true })
}

export const logout = async (options, req, res) => {
    const auth = [ 'auth_id', 'auth_etag', 'auth_grants' ]
    await req.session.unset(auth)
    // await req.session.delete(auth)
    await req.session.create()

    // Logout Hook
    await req.hooks.createHook.serie(hooks.PG_AUTH_LOGOUT, { req, res })

    return { token: req.session.jwt }
}

export const validate = async (options, req, res) => {
    const { auth_id: authId, auth_etag: authEtag } = await req.session.get()
    if (!authId) return null

    // Try to fetch the account record and verify that it is still valid
    // based on status and login etag.
    const record = await getModel('Auth').findByRef(authId)
    if (!record || record.status === -1 || record.etag !== authEtag) return null

    // Store the authentication record instance in the request for
    // later data manipulation.
    req.auth.record = record
    return record.dataValues
}

export const hasGrant = (options, req, res) => {
    const normalize = grants => (Array.isArray(grants) ? grants : [grants]).filter(i => i)
    
    // get grants value from session
    const granted = normalize(req.session.data.auth_grants)
    const required = normalize(options.grant)

    // token has no grants
    if (!granted.length) throw new Error('auth_grants is empty')
    // route requires no grants
    if (!required.length) return true
    // token has admin grants
    if (granted[0] === '*') return true

    return required.every(item => {
        // token has specific grant
        if (granted.indexOf(item) !== -1) return true
        // token has wildchar grant
        if (granted.indexOf(`${item.split(':')[0]}:*`) !== -1) return true
        // required accepts any sub-grant
        if (item.indexOf(':?') !== -1) return granted.some((grant) => (grant.split(':')[0] === item.split(':')[0]))
        // fallback
        throw new Error('Invalid grant')
    })
}
