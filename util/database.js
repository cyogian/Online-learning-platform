const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'node-connect',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'Rajran@21210703',
  {
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    host: process.env.DB_HOST || '28abee9713bec847d90ea7d53be01fe5'
  }
);

module.exports = sequelize;
