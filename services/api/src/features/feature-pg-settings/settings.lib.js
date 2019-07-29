/**
 * in-memory cache for the whole app settings.
 */

import flatten from 'flat'
import * as pg from '@forrestjs/service-postgres'

let treeCache = {}
let flatCache = {}

export const getValue = (path, defaultValue) => {
    let value
    try {
        value = flatCache[path]
    } catch (err) {} // eslint-disable-line

    if (value !== undefined) {
        return value
    }

    if (defaultValue !== undefined) {
        return defaultValue
    }

    throw new Error(`Setting not found: ${path}`)
}

export const getList = (path, defaultValue, delimiter = ',') => getValue(path, defaultValue)
    .split(delimiter)
    .map(i => i.trim())
    .filter(i => i)

export const loop = async () => {
    treeCache = await pg.getModel('Settings').buildTree()
    flatCache = flatten(treeCache)
    setTimeout(loop, getValue('server.settings.interval', 30000))
}

export const init = () => {}

// Fetches settings and caches it in-memory before to move
// on onto other services
export const start = async () => {
    await loop()
}

export const getTree = (scope) => scope
    ? treeCache[scope]
    : treeCache

