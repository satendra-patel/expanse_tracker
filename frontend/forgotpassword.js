const form = document.getElementById('forgot-password-form');
const emailfield = document.getElementById('email');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const email = emailfield.value;
        console.log(email);
        let res = await axios.post('http://localhost:4000/password/forgotpassword', {email: email});

        if(res.status === 200) {
            confirm(`${res.data.message}`);
            window.location.href = 'login.html';
        }

    } catch (error) {
        console.log(error);
    }
})