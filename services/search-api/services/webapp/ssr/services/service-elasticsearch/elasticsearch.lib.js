
import { Client } from '@elastic/elasticsearch'

let config = null
const connections = new Map()

export const init = (_config) => {
    config = _config
}

export const start = (clusterName) => new Promise((resolve, reject) => {
    try {
        const clusterConfig = config[clusterName]
        const client = new Client({ nodes: clusterConfig.nodes })

        client.cluster.health({}, err => {
            if (err) reject(err)

            connections.set(clusterName, {
                config: clusterConfig,
                client,
            })

            resolve()
        })
    } catch (err) {
        reject(err)
    }
})


export const getClient = (clusterName) =>
    connections.get(clusterName).client