# feature-pg-settings

Provides app settings that can be used in both client and server.
In-memory cache values are updated based on the setting `server.settings.interval`

## Usage

```js
import * as settings from 'src/features/feature-pg-settings/settings.lib.js'
settings.getValue('server.settings.interval')
```