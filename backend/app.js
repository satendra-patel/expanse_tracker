const express  = require('express');
const app = express();
const body_parser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/user');
const Expense = require('./models/expense');

User.hasMany(Expense);
Expense.belongsTo(User);

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');

const data_base = require('./util/database');

const cors = require('cors');

app.use(body_parser.json());
app.use(cors());

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);

// data_base.sync({force: true})
data_base.sync()
    .then(() => {
        app.listen('4000');
    })
    .catch(err => console.log(err));
