const myfun=()=>{
    console.log('r');
}
async function signup(event){
    console.log(event)
    try{
        event.preventDefault();
        console.log('run');
        const userdetails={
            username:event.target.username.value,
            useremail:event.target.useremail.value,
            userpassword:event.target.userpassword.value
        }
        const response=await axios.post("http://localhost:3000/add-user",userdetails)
        console.log(response);
    }
    catch(err){
        console.log(err);
    }
}