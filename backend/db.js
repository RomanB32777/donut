const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD ||  'password',
    port: 5432,
    database: process.env.DB_NAME || 'db',
})

module.exports = pool