
const request = require('superagent')
const { graphqlUrl } = require('./url')

const runQuery = (query, variables = {}, jwt) => {
    if (jwt) {
        return request
            .post(graphqlUrl())
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${jwt}`)
            .send({ query, variables })
    }

    return request
        .post(graphqlUrl())
        .set('Accept', 'application/json')
        .send({ query, variables })
}

module.exports = runQuery
