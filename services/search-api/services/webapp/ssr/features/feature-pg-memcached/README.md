# feature-pg-memcached

Provides storage for json cache with versioning.

## Usage

```js
import * as memcached from 'src/features/feature-pg-memcached/memcached.lib.js'
memcached.set(`user:${1}`, { id: 1 }, ['user'])
memcached.get(`user:${1}`)
memcached.remove(`user:${1}`)
```