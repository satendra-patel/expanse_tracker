const myForm = document.getElementById('sendmail');
const email = document.getElementById('email');


myForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const res = await axios.post('http://localhost:4000/password/forgotpassword', 
        {
            email: email.value
        }
        );
        console.log('LOGIN RESPONSE: ', res);
        if(res.status === 200) {
            clearError();
            confirm('Mail send  successfully!');  
            window.location.href = 'login.html';
        }
        
    } catch (error) {
        console.log(error);
        if(error.response.status === 401) {
            alert('could not send Mail');
        }
    }
});