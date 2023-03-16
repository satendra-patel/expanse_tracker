const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Expanse = sequelize.define('expanse', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
    
  },
  expansename: {
    type: Sequelize.STRING,
    allowNull: false
  },
  expansecategory: {
    type: Sequelize.STRING,
    allowNull: false
  },
  expanseamount: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Expanse;