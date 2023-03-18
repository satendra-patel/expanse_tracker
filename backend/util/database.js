const Sequelize = require('sequelize');

const data_base = new Sequelize('expanse-tracker', 'root', 'Satendra@12345', {
    dialect: 'mysql',
    host: 'localhost'
  });
  
module.exports = data_base;