const User = require('../models/user');
const PremiumUser = require('../models/premium-user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { regexpToText } = require('nodemon/lib/utils');
const saltRounds = 10;
const Razorpay = require('razorpay');
const SibApiV3Sdk = require('sib-api-v3-sdk');

exports.addUser = (req, res, next) => {
    const {name, email, password} = req.body;

    if(name.length > 0 && email.length > 0 && password.length > 0) {
        bcrypt.hash(password, saltRounds, function(error, hash) {
            // Store hash in your password DB.
            User.create(
                {
                    name: name, 
                    email: email, 
                    password: hash
                })
                .then(() => {
                    res.status(200).send({success: true, message: 'new user created'});
                })
                .catch(err => {
                    console.log(err);
                    if(err.name === 'SequelizeUniqueConstraintError'){
                        return res.status(400).json({success: false, message: err});
                    };
                    res.status(500).json({success: false, message: err});
                });
        });
    } else {
        res.status(400).json({success: false, message: 'bad parameters'});
    }
};

exports.logUser = (req, res, next) => {
    const {email, password} = req.body;

    if(email.length > 0 && password.length > 0) {
        User.findAll({where: {email: email}})
            .then(users => {
                
                const user = users[0];
                if(!user) {
                    return res.status(404).json({success: false, message: 'user does not exist'});
                }

                bcrypt.compare(password, user.password, function(error, result) {
                    if(error) {
                        return res.status(500).json({success: false, message: err});
                    }
                    if(result == true) {
                        const token = jwt.sign({userId: user.id, name: user.name}, 'archie_jwt_secret_key');
                        res.status(200).json({
                            success: true, 
                            message: 'user found',
                            token: token
                        });
                    } else {
                        res.status(401).json({success: false, message: 'password is incorrect'});
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({success: false, message: err});
            });
    } else {
        res.status(400).json({success: false, message: 'bad parameters'});
    }
};

exports.makePremium = async (req, res, next) => {
    try {
        var instance = new Razorpay({ key_id: 'rzp_test_0klPiE3keLiC4L', key_secret: 'pO8u0U1tXwSVsixtVLzdaMeL' });    
        let order = await instance.orders.create({
          amount: 5,
          currency: "INR"
        });

        await req.user.createPremiumUser({orderId: order.id, status: 'PENDING'});
    
        res.status(201).json({
            success: true,
            order, 
            key_id : instance.key_id,
            orderStatus: 'pending',
            message: 'order is created'
        });  

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, error: error});
    }  
};

exports.updateTransactionStatus = async (req, res) => {
    
    try {
        const {order_id, payment_id} = req.body;

        const premiumUser = await PremiumUser.findOne({where: {orderId: order_id}});

        premiumUser.update({paymentId: payment_id, status: 'SUCCESSFUL'})
            .then(() => {
                return req.user.update({isPremiumUser: true});
            })
            .then(() => {
                res.status(202).json({success: true, message: 'transaction successful'});
            })
            .catch(err => {
                throw new Error(err);
            })
        
    } catch (error) {
        console.log(error);
        res.status(403).json({success: false, message: 'something went wrong', err: error});
    }
};

exports.checkMembership = (req, res) => {
    if(req.user.isPremiumUser === true) {
        res.status(200).json({message: 'user has Premium Membership'});
    } else {
        res.status(400).json({message: 'user does not have Premium Membership'});
    }
};

exports.getExpansion = (req,res)=>{
    if(req.user.isPremiumUser){
        const id=req.params.id;
        User.findByPk(id)
        .then(user=>{
            return user.getExpenses();
        })
        .then(expenses=>{
            res.status(200).json({success:true,expenses:expenses});
        })
        .catch(err=>{
            res.status(500).json({success:false,error:err})
        })
    }else{
        res.status(400).json({message:'user is not a premium user'})
    }
};
exports.forgotpassword=async (req,res)=>{
    const email=req.body.email;
    console.log(email);
    if(User.findByPk(email)){
        const defaultClient = SibApiV3Sdk.ApiClient.instance;
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = 'xsmtpsib-239a779b2354654abd654fb6c2f7ed46e6b4c1c20357d14160e11fec72bdd33e-vOSN0gJyThADbqE9';
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        // Set the sender email address
        sendSmtpEmail.sender = {email: 'heerat866@gmail.com', name: 'ExpenseTracker'};

        // Set the recipient email address
        sendSmtpEmail.to = [{email: email, name: User.name}];

        // Set the email subject
        sendSmtpEmail.subject = 'ForgotPassword';

        // Set the email content (HTML and plain text)
        sendSmtpEmail.htmlContent = `<html><body><p><form id="changepassword"><label>Enter a new password</label><input type="text"><botton type="submit">Change Password</button></form> </p></body></html>`;
        sendSmtpEmail.textContent = 'change your password';

        // Send the email using the Sendinblue API client
        const apiInstance = new SibApiV3Sdk.SMTPApi();
        apiInstance.sendTransacEmail(sendSmtpEmail)
        .then(function(data) {
            console.log('API call successful. Response:', data);
        })
        .catch(function(error) {
            console.error('API call failed. Error:', error);
        });
       res.status(200).json({success:true,message:"Mail Sent"})

    }else{
        res.status(500).json({success:false,massage:"Entered Mail is wrong"})
    }
    
};


// // Instantiate the Sendinblue API client
// const defaultClient = SibApiV3Sdk.ApiClient.instance;
// const apiKey = defaultClient.authentications['api-key'];
// apiKey.apiKey = 'YOUR_API_KEY';

// // Create an instance of the Email object

