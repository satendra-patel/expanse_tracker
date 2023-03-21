const { Sequelize } = require('sequelize');
const Sequilize=require('sequelize');

const data_base=require('../util/database');

const Download=data_base.define('download',{
    id:{
        type:Sequilize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    fileUrl:{
        type:Sequelize.STRING,
        allowNull:false
    },
    date:{
        type:Sequelize.DATE,
        allowNull:false
    }
});
module.exports =Download;