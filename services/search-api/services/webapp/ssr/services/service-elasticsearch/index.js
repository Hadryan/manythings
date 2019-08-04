
import { init, start, getClient } from './elasticsearch.lib'

export default async ({ registerAction, getConfig }) => {
    registerAction({
        hook: '$INIT_SERVICE',
        name: 'elasticsearch',
        trace: __filename,
        handler: async ({ getConfig }) => {
            const clusters = getConfig('elasticsearch.clusters')

            const config = clusters.reduce((acc, curr) => ({
                ...acc,
                [curr]: {
                    nodes: getConfig(`elasticsearch.${curr}.nodes`, '').split(','),
                    indexes: getConfig(`elasticsearch.${curr}.indexes`, []),
                },
            }), {})

            init(config)
        }
    })

    registerAction({
        hook: '$START_SERVICE',
        name: 'elasticsearch',
        trace: __filename,
        handler: async ({ getConfig, logger }) => {
            const clusters = getConfig('elasticsearch.clusters')

            await Promise.all(clusters.map(async cluster => {
                await start(cluster)
                await getClient(cluster).ping({}, err => {
                    if (err) throw new Error(`[elasticsearch] '${cluster}' cluster is down!`)
                    logger.info(`[elasticsearch] '${cluster}' cluster is available`)
                })
            }))
        }
    })
}