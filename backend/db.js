const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: "localhost",
    password: process.env.DB_PASSWORD,
    port: 5432,
    database: process.env.DB_NAME,
})

module.exports = pool