
const groups = {}

export const setGroup = (name, client) =>
    groups[name] = client

/*
###
###
### Client actions
###
*/

const hasGroup = (groupName) => {
    if (!groups[groupName]) {
        throw new Error('[redis-geo.lib] group not found')
    }

    return groups[groupName]
}

const computeGeoSet = (geos = []) => {
    const set = {}
    geos.forEach(item => {
        if (!item[0]) throw new Error('[redis-geo.lib] computeGeoSet - Missing key')
        if (!item[1]) throw new Error('[redis-geo.lib] computeGeoSet - Missing latitude')
        if (!item[2]) throw new Error('[redis-geo.lib] computeGeoSet - Missing longitude')

        set[item[0]] = {
            latitude: item[1],
            longitude: item[2],
        }
    })
    
    return set
}

export const create = (groupName, geos = []) => new Promise(async (resolve, reject) => {
    try {
        const client = await hasGroup(groupName)
        const geoSet = await computeGeoSet(geos)
        client.addLocations(geoSet, (err, res) => err ? reject(err) : resolve(res))
    } catch (err) { reject(err) }
})

export const update = (groupName, geos = []) => new Promise(async (resolve, reject) => {
    try {
        const client = await hasGroup(groupName)
        const geoSet = await computeGeoSet(geos)
        client.updateLocations(geoSet, (err, res) => err ? reject(err) : resolve(res))
    } catch (err) { reject(err) }
})

export const remove = (groupName, keys = []) => new Promise(async (resolve, reject) => {
    try {
        const client = await hasGroup(groupName)
        client.removeLocations(keys, (err, res) => err ? reject(err) : resolve(res))
    } catch (err) { reject(err) }
})

export const get = (groupName, keys = []) => new Promise(async (resolve, reject) => {
    try {
        const client = await hasGroup(groupName)
        client.locations(keys, (err, res) => err ? reject(err) : resolve(res))
    } catch (err) { reject(err) }
})

export const getNearby = (groupName, coords = [], range, options = {}) =>
    new Promise(async (resolve, reject) => {
        try {
            const client = await hasGroup(groupName)
            client.nearby(
                {
                    latitude: coords[0],
                    longitude: coords[1]
                },
                range || 100,
                {
                    withCoordinates: true,
                    withDistances: true,
                    order: true,
                    units: 'm',
                    count: 100,
                    ...options,
                },
                (err, res) => err ? reject(err) : resolve(res)
            )
        } catch (err) { reject(err) }
    })

