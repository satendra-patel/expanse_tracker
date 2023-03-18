const trackerFrom = document.getElementById('tracker-form');
const amount = document.getElementById('amount');
const description = document.getElementById('description');
const category = document.getElementById('category');
const expenseItems = document.getElementById('expense-items');


trackerFrom.addEventListener('submit', async(e) => {
    e.preventDefault();
    console.log('frontend: ',amount.value, description.value, category.value);

    try {   
        await axios.post('http://localhost:4000/expense/add-expense', {
            amount: amount.value,
            description: description.value,
            category: category.value
        },
        {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });
    
        const expenses = await fetchExpensesFromBackend();

        showExpensesOnFrontend(expenses);

    } catch (error) {
        console.log(error);
    }
});

window.addEventListener('DOMContentLoaded', async () => {
    checkForPremium();

    const expenses = await fetchExpensesFromBackend();

    showExpensesOnFrontend(expenses);
});

expenseItems.addEventListener('click', async (e) => {
    // console.log('event target: ', e.target.parentElement.id);
    const id = e.target.parentElement.id;
    try {
        await axios.delete(`http://localhost:4000/expense/delete-expense/${id}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });

        expenseItems.removeChild(document.getElementById(`${id}`));
        
    } catch (error) {
        console.log(error);
    }

});

function showExpensesOnFrontend(expenses) {
    console.log('expenses: ', expenses);

    expenseItems.innerHTML = '';

    for(let i = 0; i < expenses.length; i ++){
        // console.log(expenses[i]);
        const expense = expenses[i];
        expenseItems.innerHTML += `
            <li id="${expense.id}">
                ${expense.amount}-${expense.description}-${expense.category}
                <button>Delete</button>
            </li>
        `;
    }    
};

async function fetchExpensesFromBackend() {
    try {
        const response = await axios.get('http://localhost:4000/expense/get-expense', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });

        const expenses = response.data;
        return expenses;

    } catch (error) {
        console.log(error);
    }
}

document.getElementById('rzp-button1').onclick = async function (e) {
    // console.log('token: ', token);
    
    try {
        let token = localStorage.getItem('token');

        let response = await axios.post('http://localhost:4000/user/purchase-premium', {}, {
            headers: {
                'Authorization': token
            }
        });

        console.log('order response: ',response );
        var options = {
            "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
            "name": "Test Company",
            "order_id": response.data.order.id, // For one time payment
            "prefill": {
                "name": "Test User",
                "email": "test.user@example.com",
                "contact": "7003442036"
                },
            "theme": {
                "color": "#3399cc"
                },
            // This handler function will handle the success payment
            "handler": function (response) {
                console.log(response);
                axios.post('http://localhost:4000/user/purchase-premium/update-transaction-status',
                    {
                        order_id: options.order_id,
                        payment_id: response.razorpay_payment_id,
                    }, 
                    {   
                        headers: {"Authorization" : token} 
                    })
                    .then(() => {
                        alert('You are a Premium User Now');
                        applyDarkTheme();
                    }).catch(() => {
                        alert('Something went wrong. Try Again!!!');
                    })
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();
        e.preventDefault();

        rzp.on('payment.failed', function (response){
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
        });
        
    } catch (error) {
        console.log(error);
    }
};

function applyDarkTheme() {
    const body = document.body;
    body.classList.add('dark-mode');
}

async function checkForPremium() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:4000/user/check-membership', {}, {
            headers: {
                'Authorization': token
            }
        });

        if (response.status === 200) {
            applyDarkTheme();
        } else {
            throw new Error(response);
        }

    } catch (error) {
        console.log(error);
    }
}