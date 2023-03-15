const User = require('../models/user');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }));

exports.postuser= async (req,res,next)=>{
    try{
        const username = req.body.username;
        const useremail = req.body.useremail;
        const userpassword = req.body.userpassword;
        const data= await User.create({username:username, useremail:useremail, userpassword:userpassword})
        res.status(201).json({newUserDetail:data})
    }
    catch(err){
        res.status(500).json({
            error:err
        })
    }
    
    
}

exports.checkUser=async(req,res,next)=>{
    try{
        const uId=req.params.useremail;
        console.log(uId);
        if(User.findByPk(uId)) {
            console.log('user already exist');
            
            res.status(200).json({error:userexist});
        }
       


    }
    catch(err){
        console.log(err);
    }
}

