const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const router = express.Router();
const User = require('../models/user');


const bodyParser = require('body-parser');
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }));



router.post('/add-user', adminController.postuser)


module.exports = router;