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


exports.loginUser=async(req,res,next)=>{
    try{
        const useremail=req.body.useremail;
        const userpassword=req.body.userpassword;
        console.log(useremail);
        console.log(userpassword);
       const user=await User.findAll({where :{ useremail}})
       {
        if(user.length>0){
            if(user[0].userpassword==userpassword){
                res.status(200).json({success:true,message:"user logged in"});
            }
            else{
                res.status(400).json({success:false,message:"password is wrogn"});
            }
        }
        else{
            res.status(404).json({success:false,message:"user not found"});
        }
       }
    }
    catch(err){
        console.log(err);
    }
}

