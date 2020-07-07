const parseArray = process.env.APP_IDS ? process.env.APP_IDS.split(',') : []
const liveQueryArray = process.env.LIVE_QUERIES ? process.env.LIVE_QUERIES.split('|') : []
const deleteOrphanArray = process.env.DELETE_ORPHANS ? process.env.DELETE_ORPHANS.split('|') : []

const apps = []

// Add the Parse Dashboard
apps.push({
    name: 'dashboard',
    script: 'dashboard.js',
    cwd: '/var/www/parse',
    exec_mode: 'cluster',
    env: {
        IMAGE_VERSION: process.env.IMAGE_VERSION,
        APP_IDS: process.env.APP_IDS,
        SERVER_URL: process.env.SERVER_URL,
        MASTER_KEY: process.env.MASTER_KEY
    }
})

// Initial port number
let port = 9000

// Add the Parse Apps
parseArray.forEach(appId => {
    // Calculate the port each app
    port += 1

    // Live Query configuration
    const liveQueryClasses = liveQueryArray.reduce((res, value) => {
        const prefix = `${appId}:`
        if(value.startsWith(prefix)) res = value.replace(prefix, '')
        return res
    }, '')

    // Delete Orphan configuration
    const deleteOrphanClasses = deleteOrphanArray.reduce((res, value) => {
        const prefix = `${appId}:`
        if(value.startsWith(prefix)) res = value.replace(prefix, '')
        return res
    }, '')

    apps.push({
        name: appId,
        script: 'parse.js',
        cwd: '/var/www/parse',
        exec_mode: 'cluster',
        env: {
            APP_ID: appId,
            NODE_PORT: port,
            SERVER_URL: process.env.SERVER_URL,
            MASTER_KEY: process.env.MASTER_KEY,
            DB_HOST: process.env.DB_HOST,
            DB_USERNAME: process.env.DB_USERNAME,
            DB_PASSWORD: process.env.DB_PASSWORD,
            LIVE_QUERIES: liveQueryClasses,
            DELETE_ORPHANS: deleteOrphanClasses
        }
    })
})

module.exports = { apps: apps }