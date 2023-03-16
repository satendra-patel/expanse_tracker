const Expanse = require('../models/expanse');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }));

exports.postExpanse= async (req,res,next)=>{
    try{
        const expansename = req.body.expansename;
        const expansecategory = req.body.expansecategory;
        const expanseamount = req.body.expanseamount;
        console.log(expanseamount);
            const data= await Expanse.create({expansename:expansename, expansecategory:expansecategory, expanseamount:expanseamount})
               res.status(201).json({newUserDetail:data})
    }
    catch(err){
        res.status(500).json({
            error:err
        })
    }   
}

exports.getExpanse= async (req,res,next)=>{
    try{
        const expanses=await Expanse.findAll();
        res.status(200).json({allExpanses:expanses})
    }
    catch(error){
        console.log("Get expanse is failing",JSON.stringify(error));
        res.status(500).json({
            error:error
        })
    }    
}

exports.deleteExpanse= async(req,res,next)=>{
    try{
        const uId=req.params.id;
        console.log(uId);
        await Expanse.destroy({where:{id:uId}});   
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }   
}