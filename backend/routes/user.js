const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

const authenticator = require('../middleware/auth');

router.post('/sign-up', userController.addUser);

router.post('/login', userController.logUser);

router.post('/purchase-premium/update-transaction-status', authenticator.authenticate, userController.updateTransactionStatus);

router.post('/purchase-premium', authenticator.authenticate, userController.makePremium);

router.post('/check-membership', authenticator.authenticate, userController.checkMembership);

router.get('/get-expansion/:id',authenticator.authenticate,userController.getExpansion);

router.post('/password/forgotpassword',userController.forgotpassword);

module.exports = router;
