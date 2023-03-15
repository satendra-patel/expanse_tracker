
async function login(event){
    console.log(event)
    try{
        event.preventDefault();
        console.log('run');
        const logindetails={
            useremail:event.target.useremail.value,
            userpassword:event.target.userpassword.value
        }
        axios.post("",logindetails)
        .then(res=>{
            alert(res.data.message);
        })
        .catch(err=>{
            console.log(err);
        });
    }
    catch(err){
        console.log(err);
    }
}