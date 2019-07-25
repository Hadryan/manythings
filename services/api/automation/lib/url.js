
const url = (endpoint) => `http://localhost:8080/api${endpoint}`
const graphqlUrl = () => `${url('')}/graphql`

module.exports = {
    url,
    graphqlUrl,
}
