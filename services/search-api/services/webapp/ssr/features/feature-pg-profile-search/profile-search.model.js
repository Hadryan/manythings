import Sequelize from 'sequelize'
export const name = 'ProfileSearch'

const fields = {
    payload: {
        type: Sequelize.JSONB,
        defaultValue: {},
    },
}

const options = {
    tableName: 'profile_search',
    freezeTableName: true,
    underscored: true,
    // hooks: {
    //     beforeValidate: async (item) => {
    //         if (item.payload) {
    //             item.payload = await encrypt(item.payload)
    //         }
    //     },
    //     beforeCreate: async (item) => {
    //         if (item.payload) {
    //             item.payload = await encrypt(item.payload)
    //         }
    //     },
    //     beforeUpdate: async (item) => {
    //         if (item.payload) {
    //             item.payload = await encrypt(item.payload)
    //         }
    //     },
    //     beforeBulkUpdate: async (change) => {
    //         if (change.attributes.payload) {
    //             change.attributes.payload = await encrypt(change.attributes.payload)
    //         }
    //     },
    // },
}

export const init = async (conn, { createHook }) => {
    const Model = conn.define(name, fields, options)
    return Model.sync()
}
