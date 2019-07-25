
module.exports = {
    getConnectionsSnap: `
        query getConnectionsSnap ($profileId: Float!) {
            test {
                getConnectionsSnap (profileId: $profileId)
            }
        }
    `,
    getProfileSnap: `
        query getProfileSnap ($profileId: Float!) {
            test {
                getProfileSnap (profileId: $profileId)
            }
        }
    `,
    getTalkSnap: `
        query getTalkSnap ($profileId: Float!) {
            test {
                getTalkSnap (profileId: $profileId)
            }
        }
    `,
    getProfileByUname: `
        query getProfileByUname ($uname: String!) {
            test {
                getProfileByUname (uname: $uname)
            }
        }
    `,
    getChannel: `
        query getChannel (
            $profileId: Float!
            $vendor: String!
        ) {
            test {
                getChannel (
                    profileId: $profileId
                    vendor: $vendor
                )
            }
        }
    `,
    getConnectionOut: `
        query getConnectionOut (
            $originId: Float
            $targetId: Float
        ) {
            test {
                getConnectionOut (
                    targetId: $targetId
                    originId: $originId
                )
            }
        }
    `,
    getConnectionIn: `
        query getConnectionIn (
            $originId: Float
            $targetId: Float
        ) {
            test {
                getConnectionIn (
                    targetId: $targetId
                    originId: $originId
                )
            }
        }
    `,
    getConnection: `
        query getConnection {
            test {
                getConnection
            }
        }
    `,
    getTalkRoom: `
        query getTalkRoom ($participants: [Float]!) {
            test {
                getTalkRoom (participants: $participants)
            }
        }
    `,
    getTalkRoomsRawData: `
        query getTalkRoomsRawData {
            test {
                getTalkRoomsRawData
            }
        }
    `,
    getProfileSuggestions: `
        query getProfileSuggestions (
            $profileId: ID!
        ) {
            test {
                getProfileSuggestions(
                    profileId: $profileId
                )
            }
        }
    `,
}
