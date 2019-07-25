
module.exports = {
    buildConnections: `
        mutation buildConnections ($token: String!, $profileId: Int!) {
            worker(token: $token) {
                buildConnections (profileId: $profileId)
            }
        }
    `,
    buildTalk: `
        mutation buildTalk ($token: String!, $profileId: Int!) {
            worker(token: $token) {
                buildTalk (profileId: $profileId)
            }
        }
    `,
    buildProfile: `
        mutation buildProfile ($token: String!, $profileId: Int!) {
            worker(token: $token) {
                buildProfile (profileId: $profileId)
            }
        }
    `,
}
