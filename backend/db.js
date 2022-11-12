const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD ||  'R4908738475',
    port: 5432,
    database: process.env.DB_NAME || 'donut',
})

module.exports = pool