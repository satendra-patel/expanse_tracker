const Sequelize = require('sequelize');
require('dotenv').config();

const data_base = new Sequelize(process.env.DB, 'root', process.env.Password, {
    dialect: 'mysql',
    host: 'localhost'
  });
  
module.exports = data_base;