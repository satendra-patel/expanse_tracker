async function signup(event){
    try{
        event.preventDefault();
        const userdetails={
            username:event.target.username.value,
            useremail:event.target.useremail.value,
            userpassword:event.target.userpassword.value
        }
        const response=await axios.post("",userdetails)

    }
    catch(err){
        console.log(err);
    }
}