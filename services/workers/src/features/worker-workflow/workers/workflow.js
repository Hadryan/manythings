
/**
 * Generic workflow queue for tasks that need to be executed and
 * directly dropped away.
 */

import moment from 'moment'
import { exec, execRaw } from 'src/services/service-api/api.lib'

const resolvers = {}

export default ({}) => ({
    queue: 'workflow',
    version: 0,
    sleep: 1000 * 60,
    // concurrency: 2,
    // batch: 20,
    // delay: 5,
    handler: async (doc, { ctx }) => {
        // try to run the specific resolver by subject name
        if (resolvers[doc.payload.resolver]) {
            return await resolvers[doc.payload.resolver](doc)
        }
    
        // fallback on a specific query to send out
        if (doc.payload.query) {
            const res = await exec(doc.payload.query, {
                ...(doc.payload.variables || {}),
            })
            return {
                action: 'drop',
                payload: {
                    ...doc.payload,
                    res,
                }
            }
        }
    
        // take in a raw query from the document
        if (doc.payload.rawQuery) {
            const res = await execRaw(doc.payload.rawQuery, {
                ...(doc.payload.variables || {}),
            })
        
            return {
                action: 'drop',
                payload: {
                    ...doc.payload,
                    res,
                }
            }
        }
    
        // unknown task, let's reschedule it for a while
        // (maybe we drop it if it becomes to old?)
        return {
            action: 'reschedule',
            nextIteration: moment().add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss Z')
        }
    },
})
