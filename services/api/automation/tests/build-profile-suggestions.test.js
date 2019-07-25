const graphQLTest = require('../lib/graphql-test-queries')
const graphQLRequest = require('../lib/graphql-request')

describe('getProfileSuggestions', function () {
    this.timeout(10000)

    it('should not work if the guy is not an influencer', async function () {
        const data = {
            profileId: 3,
        }
        const res = await graphQLRequest(graphQLTest.getProfileSuggestions, data)
        const suggestions = JSON.parse(res.body.data.test.getProfileSuggestions)

        console.log(suggestions)
    })
})
