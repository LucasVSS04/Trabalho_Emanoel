const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ecofre',
  password: 'root',
  port: 5432
});

module.exports = pool;
