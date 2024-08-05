const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'node-connect',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'Rajran@21210703',
  {
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost'
  }
);

module.exports = sequelize;
