const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

const expenseController=require('../controllers/expense');

const authenticator = require('../middleware/auth');

router.post('/sign-up', userController.addUser);

router.post('/login', userController.logUser);

router.post('/purchase-premium',authenticator.authenticate,userController.makePremium);

router.post('/purchase-premium/update-transaction-status', authenticator.authenticate, userController.updateTransactionStatus);

 router.post('/check-membership', authenticator.authenticate, userController.checkMembership);

router.get('/get-expansion/:id', authenticator.authenticate, userController.getExpansion);

router.get('/logout',authenticator.authenticate,userController.logOutUser);

router.get('/download', authenticator.authenticate, expenseController.downloadExpense);

router.get('/get-downloads', authenticator.authenticate, userController.getDownloads);

module.exports = router;