import { logout, hasGrant, validate } from './auth.lib'

export const addAuth = (config, ctx) => (req, res, next) => {
    req.auth = {}

    req.auth.validate = async () => validate({}, req, res)
    req.auth.logout = () => logout({}, req, res)
    req.auth.hasGrant = (grant) => hasGrant({ grant }, req, res)

    next()
}
