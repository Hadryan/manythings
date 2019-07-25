module.exports = {
    getLegalDocument: `
        query getLegalDocument($name: String!) {
            misc {
                getDocument(name: $name) {
                    name version title text html released payload checksum 
                }
            }
        }
    `,
}
