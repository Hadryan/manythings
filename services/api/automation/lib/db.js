
const winston = require('winston')
const Sequelize = require('sequelize')
const pause = require('@marcopeg/utils/lib/pause')

class Db {
    constructor (settings = {}) {
        const database = settings.database || 'mysocial'
        const username = settings.username || 'mysocial'
        const password = settings.password || 'mysocial'
        this.conn = new Sequelize(database, username, password, {
            dialect: 'postgres',
            host: settings.host || 'localhost',
            port: settings.port || '5432',
            logging: settings.logger || false,
            operatorsAliases: {},
        })

        this.isConnected = false
    }

    async start (maxAttempts = 1, attemptDelay = 1) {
        let attempts = 0
        let lastErrorMSG = ''
        do {
            try {
                winston.verbose(`[db] Connection attempt ${attempts + 1}/${maxAttempts}`)
                await this.conn.authenticate()
                this.isConnected = true
                return true
            } catch (e) {
                attempts += 1
                lastErrorMSG = e.message
                winston.error(`[db] failed: ${e.message}`)
                await pause(attemptDelay * 1000)
            }
        } while (attempts < maxAttempts)

        throw new Error(lastErrorMSG)
    }

    async stop () {
        await this.conn.close()
    }

    async truncateAll () {
        winston.verbose('[db] truncateAll()')
        const q = `
        DO
        $func$
        BEGIN
           -- RAISE NOTICE '%', 
           EXECUTE
           (SELECT 'TRUNCATE TABLE ' || string_agg(oid::regclass::text, ', ') || ' CASCADE'
            FROM   pg_class
            WHERE  relkind = 'r'  -- only tables
            AND    relnamespace = 'public'::regnamespace
            AND relname NOT LIKE 'fetchq_%' 
            AND relname NOT LIKE 'spatial_ref_sys'
            AND relname NOT LIKE 'rel_settings'
            AND relname NOT LIKE 'rel_profiles_categories'
           );
        END
        $func$;
        `
        await this.conn.query(q)

        // truncate all queues
        const queues = [
            'workflow',
        ]
        await Promise.all(queues.map(async (q) => {
            await this.conn.query(`select * from fetchq_queue_drop('${q}')`)
            await this.conn.query(`select * from fetchq_queue_create('${q}')`)
            await this.conn.query(`select * from fetchq_queue_enable_notify('${q}')`)
        }))
    }

    query (q) {
        return this.conn.query(q)
    }
}

const createDbConnection = () => new Db()

module.exports = {
    createDbConnection,
}
