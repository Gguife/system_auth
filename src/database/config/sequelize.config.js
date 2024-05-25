require('ts-node/register');
const configs = require('../../interfaces/configs.ts');

module.exports = {
  username: configs.DB_USER,
  password: configs.DB_PASSWORD,
  database: configs.DB_NAME,
  host: configs.DB_HOST,
  dialect: 'mysql',
  port: configs.DB_PORT
};