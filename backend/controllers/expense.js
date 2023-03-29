const Expense = require('../models/expense');
const Download = require('../models/download');
const User = require('../models/user');
const { Op } = require('sequelize');
const AWS= require('aws-sdk');

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
    const page = +req.query.page;
    let totalItems;
    let lastPage;

    const ITEMS_PER_PAGE = +req.header('rows');
    console.log('items per page------> ', ITEMS_PER_PAGE)
    
    req.user.getExpenses({
        offset: (page - 1)*(ITEMS_PER_PAGE), 
        limit: ITEMS_PER_PAGE
      })
    // Expense.findAll()
        .then(async (limitedExpenses) => {
            // res.status(200).json(limitedExpenses);
            console.log('limited expenses----->', limitedExpenses);
            totalItems = await Expense.count({where: {userId: req.user.id}});

            lastPage = Math.ceil(totalItems / ITEMS_PER_PAGE);
            if(lastPage === 0) {
                lastPage = 1;
            }

            res.status(200).json({
                expenses: limitedExpenses,
                totalExpenses: totalItems,
                currentPage: page,
                hasNextPage: (page*ITEMS_PER_PAGE) < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: lastPage
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({success: false, message: err});
        });
};

exports.deleteExpense = (req, res, next) => {
    const id = req.params.id;
    console.log('id to delete: ', id);
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
            res.status(500).json(err);
        });
};

exports.getLeaderboradData = (req, res, next) => {
    
    if(req.user.isPremiumUser === true) {
        
        User.findAll({
            where: {
                id: {
                  [Op.not]: req.user.id
                }
              }
        })
            .then(async (users) => {
                let leaderboardData = [];
                try {
                    for(let i = 0; i < users.length; i ++) {
                        let userData = {user: users[i]};
                        let expenses = await users[i].getExpenses();
                     
                        userData['expenses'] = expenses;
                        leaderboardData.push(userData);
                    }
                } catch (error) {
                    throw new Error(error);
                }
                
                res.status(200).json(leaderboardData);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({success: false, error: err});
            })
    } else {
        res.status(403).json({success: false, message: 'user does not premium membership'});
    }
};

exports.downloadExpense = async (req, res) => {
    if(req.user.isPremiumUser) {
        try {
            const expenses = await req.user.getExpenses();
            console.log(expenses);
                                                                         
            const fileUrl = await uploadToS3(`${req.user.id}_${new Date()}_expenses.csv`, JSON.stringify(expenses));

            
            await req.user.createDownload({fileUrl: fileUrl, date: new Date()});

            res.status(201).json({fileUrl: fileUrl, success: true});
            
        } catch (error) {
            console.log(error);
            res.status(500).json({error, status: false});
        }

    }else {
        res.status(401).json({success: false, message: 'user does not have Premium Membership'});
    }
}

function uploadToS3(fileName, data) {
    const s3 = new AWS.S3({
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    });

    const params = {
        Bucket: 'expense-tracker-archie', 
        Key: fileName, 
        Body: data,
        ACL: 'public-read'
    };

    return new Promise((resolve, reject) => {

        s3.upload(params, (s3Err, response) => {
            if (s3Err){
                reject(s3Err);
            } else {
                
                resolve(response.Location);
            }
        });
    })
}