module.exports = {
    // admin
    importPosts: `
        mutation importPosts (
            $gdoc: String!
        ) {
            session {
                admin {
                    importPosts (gdoc: $gdoc)
                }
            }
        }
    `,

    // connections
    acceptConnection: `
        mutation acceptConnection ($originId: Int!, $profileId: Float!) {
            session {
                connection {
                    accept(originId: $originId)
                }
                talk {
                    newTalkRoom (participants:[$profileId])
                }
            }
        }
    `,
    sendConnection: `
        mutation sendConnection ($targetId: Int!) {
            session {
                connection {
                    send(targetId: $targetId)
                }
            }
        }
    `,

    // social media
    searchYoutube: `
        mutation searchYoutube ($uname: String!) {
            session {
                socialmedia {
                    searchYoutube (uname: $uname) {
                        id username pic
                    }
                }
            }
        }
    `,
    findYoutube: `
        mutation findYoutube ($channelId: String!) {
            session {
                socialmedia {
                    findYoutube (channelId: $channelId) {
                        code
                        videoId
                        profile { id username pic followers }
                    }
                }
            }
        }
    `,
    verifyYoutube: `
        mutation verifyYoutube (
            $channelId: String!,
            $code: String!,
            $videoId: String!
        ) {
            session {
                socialmedia {
                    verifyYoutube (
                        channelId: $channelId,
                        code: $code,
                        videoId: $videoId
                    )
                }
            }
        }
    `,
    verifyInstagram: `
        mutation verifyInstagram (
            $uname: String!,
            $code: String!,
            $postCode: String!
        ) {	
            session {
                socialmedia {
                    verifyInstagram (
                        uname: $uname,
                        code: $code,
                        postCode: $postCode
                    )
                }
            }
        }
    `,
    findInstagram: `
        mutation findInstagram ($uname: String!) {	
            session {
                socialmedia {
                    findInstagram (uname: $uname) {
                        code
                        postCode
                        profile { id username pic followers }
                    }
                }
            }
        }
    `,

    // discovery
    getDiscoveryProfiles: `
        query discoveryProfiles {
            session{
                discovery {
                    profiles {
                        id
                        fanbase
                        username
                        pic
                    }
                }
            }
        }
    `,
}
