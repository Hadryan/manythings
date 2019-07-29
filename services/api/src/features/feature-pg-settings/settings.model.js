
import Sequelize from 'sequelize'
import defaultSettings from './default-settings'

export const name = 'Settings'

const fields = {
    scope: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        primaryKey: true,
    },
    feature: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        primaryKey: true,
    },
    key: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    payload: {
        type: Sequelize.JSONB,
    },
    desc: {
        type: Sequelize.TEXT,
    },
}

const options = {
    tableName: 'settings',
    freezeTableName: true,
    underscored: true,
    createdAt: false,
    updatedAt: false,
}

const addDefault = (conn, Model) => async ({ key, scope, feature, payload, desc }) => {
    try {
        await Model.create({ key, scope, feature, payload, desc })
    } catch (err) {} // eslint-disable-line
}

const upsertSetting = (conn, Model) => ({ key, scope, feature, payload, desc }) =>
    Model.upsert({ key, scope, feature, payload, desc })

const buildTree = (conn, Model) => async () => {
    const tree = {}
    let rows = null

    try {
        rows = await Model.findAll({ raw: true })
    } catch (err) {
        return tree
    }

    for (const row of rows) {
        for (const scope of row.scope) {
            if (!tree[scope]) {
                tree[scope] = {}
            }
            for (const feature of row.feature) {
                if (!tree[scope][feature]) {
                    tree[scope][feature] = {}
                }
                tree[scope][feature][row.key] = row.payload
            }
        }
    }

    return tree
}

export const init = (conn) => {
    const Model = conn.define(name, fields, options)

    Model.addDefault = addDefault(conn, Model)
    Model.upsertSetting = upsertSetting(conn, Model)
    Model.buildTree = buildTree(conn, Model)

    return Model.sync()
}

export const start = async (conn, instance) => {
    await Promise.all(defaultSettings.map(setting => instance.addDefault(setting)))
}