const Pool = require('pg').Pool
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "R4908738475",
    port: 5432,
    database: 'donat_4',
})

module.exports = pool