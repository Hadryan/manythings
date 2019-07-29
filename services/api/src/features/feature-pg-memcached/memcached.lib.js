
import * as pg from '@forrestjs/service-postgres'

export const set = async (key, value, meta = {}) =>
    pg.getModel('Memcached').set(String(key), value, meta)

// retrieve a value by key and optional minimum version
export const get = async (key, version = null) =>
    pg.getModel('Memcached').get(String(key), version)

export const remove = async (key) =>
    pg.getModel('Memcached').remove(String(key))
