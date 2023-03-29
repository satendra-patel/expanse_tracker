const Sequelize = require('sequelize');
require('dotenv').config();

const data_base = new Sequelize(process.env.DB, process.env.DB_connection_port, process.env.Password, {
    dialect: 'mysql',
    host: process.env.Host
  });
  
module.exports = data_base;