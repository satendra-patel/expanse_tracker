
async function login(event){
   
    try{
        event.preventDefault();
        console.log('hii');
        const logindetails={
            useremail:event.target.useremail.value,
            userpassword:event.target.userpassword.value
        }
        axios.post("http://localhost:3000/login-user",logindetails).then(response=>{
            console.log(response);
        }).catch(err=>{
            console.log(err);
        })
       
       console.log('hii');
       
    }
    catch(err){
        console.log(err);
    }
}