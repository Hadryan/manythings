
// import * as turf from '@turf/turf'

import * as hooks from './hooks'

import { init as routingInit } from './heremaps-routing.lib'
import { init as waypointInit } from './heremaps-waypoint.lib'

export { query as routingQuery } from './heremaps-routing.lib'
export { query as waypointQuery } from './heremaps-waypoint.lib'

// Applies default values to `heremaps` config object
const buildConfig = ({ getConfig, setConfig }) => {
    const config = {
        ...getConfig('heremaps', {}),
        appId: getConfig('heremaps.appId'),
        appCode: getConfig('heremaps.appCode'),
    }

    setConfig('heremaps', config)
    return config
}

export default ({ registerHook, registerAction }) => {
    registerHook(hooks)

    const defaults = {
        name: hooks.SERVICE_NAME,
        trace: __filename,
    }

    registerAction({
        ...defaults,
        hook: '$INIT_SERVICE',
        handler: async ({}, ctx) => {
            const config = buildConfig(ctx)
            await routingInit(config, ctx)
            await waypointInit(config, ctx)
        },
    })

    // registerAction({
    //     ...defaults,
    //     hook: '$EXPRESS_ROUTE',
    //     handler: async ({ registerRoute }, ctx) => {
    //         registerRoute.get('/heremaps/routing', async (req, res) => {
    //             const res1 = await routing.query('calculateroute', {
    //                 waypoint0: '55.557686,13.024424',
    //                 waypoint1: '55.611288,12.994127',
    //                 mode: 'fastest;car;traffic:enabled',
    //                 language: 'sv-se',
    //             })

    //             res.send(res1.data)
    //         })

    //         registerRoute.get('/heremaps/waypoint', async (req, res) => {
    //             const res1 = await waypoint.query('findsequence', {
    //                 start: '52.52282,13.37011',
    //                 destination1: '52.50341,13.44429',
    //                 destination2: '52.51293,13.24021',
    //                 end: '52.53066,13.38511',
    //                 mode: 'fastest;car',
    //                 // departure: new Date(), 
    //             })

    //             res.send(res1.data)
    //         })

    //         registerRoute.get('/heremaps/bbox', async (req, res) => {
    //             const point = turf.multiPoint([[55.557686,13.024424],[55.611288,12.994127]])
    //             const buffered = turf.buffer(point, 1, { units: 'kilometers' })
    //             const bbox = turf.bbox(buffered)
    //             // const bboxPolygon = turf.bboxPolygon(bbox)

    //             // const multiline = turf.multiLineString([[[55.557686,13.024424],[55.571389,12.985817]]]);
    //             // var line = turf.lineString([[55.557686,13.024424],[55.571389,12.985817]]);
    //             // const buffered = turf.buffer(line, 5, { units: 'kilometers' })
    //             // var bbox = turf.bbox(buffered);
    //             // res.send(bbox)

    //             res.send(bbox)
    //         })
    //     },
    // })
}