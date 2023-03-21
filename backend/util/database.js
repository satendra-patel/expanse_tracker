const Sequelize = require('sequelize');
require('dotenv').config();

const data_base = new Sequelize('expanse-tracker', 'root', process.env.Password, {
    dialect: 'mysql',
    host: 'localhost'
  });
  
module.exports = data_base;