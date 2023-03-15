const express = require('express');
const path = require('path');
var app=express();
var cors=require('cors');
const sequelize = require('./util/database');
const User = require('./models/user');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

const adminRoutes = require('./routes/admin');

app.use(adminRoutes);


sequelize.sync()
.then(result=>{
    console.log(result);
})
.catch(err=>{
    console.log(err);
})


app.listen(3000);