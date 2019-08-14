
import georedis from 'georedis'

import * as hooks from './hooks'

const groups = {}

export const init = async (args, ctx) => {
    const client = georedis.initialize(args.client)

    await ctx.createHook.serie(hooks.REDIS_GEO_CONNECT, {
        addGroup: (groupName) => {
            groups[groupName] = client.addSet(groupName)
        },
        deleteGroup: (groupName) => {
            client.deleteSet(groupName)
            groups[groupName] = null
        },
    })
}

/*
###
###
### Client actions
###
*/

const computeGeoSet = (geos = []) => new Promise((resolve, reject) => {
    const set = {}
    geos.forEach(item => {
        if (!item[0]) reject('[service-redis-geo] computeGeoSet - Missing key')
        if (!item[1]) reject('[service-redis-geo] computeGeoSet - Missing latitude')
        if (!item[2]) reject('[service-redis-geo] computeGeoSet - Missing longitude')

        set[item[0]] = {
            latitude: item[1],
            longitude: item[2],
        }
    })
    
    resolve(set)
})

export const create = (groupName, geos = []) =>
    new Promise(async (resolve, reject) => groups[groupName].addLocations(
        await computeGeoSet(geos).catch(err => reject(err)),
        (err, res) => err ? reject(err) : resolve(res)    
    ))

export const update = (groupName, geos = []) =>
    new Promise(async (resolve, reject) => groups[groupName].updateLocations(
        await computeGeoSet(geos).catch(err => reject(err)),
        (err, res) => err ? reject(err) : resolve(res)    
    ))

export const remove = (groupName, keys = []) =>
    new Promise((resolve, reject) => groups[groupName].removeLocations(
        keys,
        (err, res) => err ? reject(err) : resolve(res)
    ))

export const get = (groupName, keys = []) =>
    new Promise((resolve, reject) => groups[groupName].locations(
        keys,
        (err, res) => err ? reject(err) : resolve(res)    
    ))

export const getNearby = (groupName, coords = [], range, options = {}) =>
    new Promise((resolve, reject) => groups[groupName].nearby(
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
    ))
