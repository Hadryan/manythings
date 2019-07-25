
const headers2jwt = (superagentResponse) => {
    const cookie = superagentResponse.headers['set-cookie']
        .find(header => header.indexOf('creators::session') !== -1)

    const tokens = cookie.split(';')
    return tokens[0].split('=')[1]
}

module.exports = {
    headers2jwt,
}
