import pkg from 'pg';

const { Pool } = pkg;

const db = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  password: process.env.DB_PASSWORD || 'test123',
  port: 5432,
  database: process.env.DB_NAME || 'donut_last',
});

export default db;
