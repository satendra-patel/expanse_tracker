const Expense = require('../models/expense');

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

exports.deleteExpense = (req, res, next) => {
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
            res.status(500).json(err);
        });
};