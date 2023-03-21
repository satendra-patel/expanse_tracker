const Expense = require('../models/expense');
const User=require('../models/user');
const {Op}=require('sequelize');
const Sequelize=require('sequelize');

exports.addExpense = async(req, res, next) => {
    const {amount, description, category} = req.body;
    
    console.log(amount, description, category);

    try {
        
        await req.user.createExpense({
            amount: amount,
            description: description,
            category: category
        });
        res.status(200).json({success: true, message: 'expense successfully added'});
        
    } catch (error) {
        res.status(500).json({success: false, message: error});
    }
};

exports.getExpense = (req, res, next) => {
    req.user.getExpenses()
    // Expense.findAll()
        .then(expenses => {
            res.status(200).json(expenses);
        })
        .catch(err => {
            res.status(500).json({success: false, message: err});
        });
};

exports.deleteExpense = async (req, res, next) => {
    const id = req.params.id;
    // console.log('id to delete: ', id);
    // Expense.findByPk(id, {where: {userId: req.user.id}})
    req.user.getExpenses({where: {id: id}})
        .then(async (expenses) => {
            const expense = expenses[0];
            if(!expense) {
                return res.status(404).json({success: false, message: 'expense does not belong to the user'});
            }
            await expense.destroy();
            res.status(200).json({success: true, message: 'expense successfully deleted'});
        })
        .catch(err => {
            await .rollback();
            res.status(500).json(err);
        });
};
exports.getLeaderboardData=(req,res,next)=>{
    if(req.user.isPremiumUser===true){
        User.findAll({
            where:{
                id:{
                    [Op.not]:req.user.id
                }
            }
        })
        .then(async (user)=>{
            let leaderboardData=[];
            try{
                for(let i=0;i<URLSearchParams.length;i++){
                    let userData={user:users[i]};
                    let expenses=await users[i].getExpenses();
                    console.log(expenses)
                    userData['expenses']=expenses;
                    leaderboardData.push(userData);
                }
            }catch(err){
                console.log(err);
                throw new Error(err);
            }
            res.status(200).json(leaderboardData);
        } )
        .catch(err=>{
            res.status(500).json({success:false,error:err})
        })
    }else{
        res.status(403).json({success:false,message:'User is not a premium menber'})
    }
};