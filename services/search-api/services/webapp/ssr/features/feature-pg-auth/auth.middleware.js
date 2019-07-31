import { getModel } from '@forrestjs/service-postgres'
import { logout } from './auth-account.lib'

export const addAuth = (config, ctx) => (req, res, next) => {
    const AuthAccount = getModel('AuthAccount')
    req.auth = {}

    req.auth.validate = async () => {
        const { auth_id: authId, auth_etag: authEtag } = await req.session.get()
        if (!authId) return null

        // Try to fetch the account record and verify that it is still valid
        // based on status and login etag.
        const record = await AuthAccount.findByRef(authId)
        if (!record || record.status === -1 || record.etag !== authEtag) return null

        // Store the authentication record instance in the request for
        // later data manipulation.
        req.auth.record = record
        return record.dataValues
    }

    req.auth.logout = () => logout(req, res)

    req.auth.hasGrant = (grant) => {
        const normalize = grants => (Array.isArray(grants) ? grants : [grants]).filter(i => i)
        
        // get grants value from session
        const granted = normalize(req.session.data.auth_grants)
        const required = normalize(grant)

        // token has no grants
        if (!granted.length) return false
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
            return false
        })
    }

    next()
}
