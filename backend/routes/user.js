const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

router.post('/sign-up', userController.addUser);

router.post('/login', userController.logUser);

module.exports = router;
