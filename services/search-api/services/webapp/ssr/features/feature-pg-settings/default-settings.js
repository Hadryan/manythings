module.exports = [
    {
        desc: 'in-memory cache lifetime for settings',
        scope: [ 'server', 'client' ],
        feature: ['settings'],
        key: 'interval',
        payload: 10000, // 10s
    },
]
