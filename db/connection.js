// make a connection to your database here
// and export it so that you can use it to interact with your database

const { Pool } = require('pg');
const path = require('path');
const ENV = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: path.resolve(__dirname, `../.env.${ENV}`) });

if (!process.env.PGDATABASE) {
  throw new error('PGDATABASE not set');
}

module.exports = new Pool();
