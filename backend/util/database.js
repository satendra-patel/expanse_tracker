const Sequelize = require('sequelize');

const sequelize = new Sequelize('expanse-tracker', 'root', 'Satendra@12345', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;