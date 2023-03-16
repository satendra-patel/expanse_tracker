const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const expanseController=require('../controllers/expanse');
const router = express.Router();
const User = require('../models/user');


const bodyParser = require('body-parser');
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }));



router.post('/add-user', adminController.postuser);
router.post('/login-user',adminController.loginUser);
router.post('/add-expanse',expanseController.postExpanse);
router.get('/get-expanse',expanseController.getExpanse);
router.delete('/delete-expanse',expanseController.deleteExpanse);



module.exports = router;