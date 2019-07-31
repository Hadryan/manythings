
import { Client } from '@elastic/elasticsearch'

export default async ({ registerAction, getConfig }) => {
    registerAction({
        hook: '$INIT_SERVICE',
        name: 'elasticsearch',
        trace: __filename,
        handler: async ({ getConfig }) => {
            // const client = new Client({
            //     node: getConfig('elasticsearch.host'),
            //     maxRetries: 5,
            //     requestTimeout: 60000,
            //     sniffOnStart: true
            // })

            // console.log(getConfig('elasticsearch.host'))
            // await client.index({
            //     index: 'game-of-thrones',
            //     body: {
            //         character: 'Ned Stark',
            //         quote: 'Winter is coming.'
            //     }
            // })

            // const { body } = await client.search({
            //     index: 'game-of-thrones',
            //     body: {
            //         query: {
            //             match: {
            //                 quote: 'winter'
            //             }
            //         }
            //     }
            // })

            // console.log(body.hits.hits)

            // const { body } = await client.indices.getFieldMapping({
            //     index: 'game-of-thrones',
            //     fields: ['quote', 'character'],
            // })

            // console.log(body['game-of-thrones'].mappings.character.mapping.character)
        }
    })
}