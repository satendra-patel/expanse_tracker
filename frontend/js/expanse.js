const myForm = document.querySelector('#my-form');
// const userList = document.querySelector('#users');

myForm.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();
  var expansename=event.target.expansename.value;
  var expansecategory=event.target.expansecategory.value;
  var expanseamount=event.target.expanseamount.value;
  
    let obj={
        expansename,
        expansecategory,
        expanseamount
    };
    
    axios.post("http://localhost:3000/add-expanse",obj)
    .then((response)=>{ 
      console.log(response)
      showNewUserOnScreen(response.data.newUserDetail) 
    })
    .catch((err)=>{
      document.body.innerHTML=document.body.innerHTML+"<h4>Something went wrong</h4>"
      console.log(err);
    })
    
    
    
    // localStorage.setItem(obj.email,JSON.stringify(obj));



    // showNewUserOnScreen(obj);
}
window.addEventListener("DOMContentLoaded", () =>{

  axios.get("http://localhost:3000/get-expanse")
  .then((response)=>{
    console.log(response);
    for(var i=0;i<response.data.allexpanse.length;i++){
      showNewUserOnScreen(response.data.allexpanse[i]);
    }
  })
  .catch((err)=>{
    console.log(err);
  })

})


function showNewUserOnScreen(user){

  document.getElementById('expansename').value='';
  document.getElementById('expansecategory').value='';
  document.getElementById('expanseamount').value='';

  if(localStorage.getItem(user.expansename) !== null){
    removeUserFromScreen(expansename);
  }


  const parentNode=document.getElementById('listOfUsers');
  const childHTML = `<li id=${expanse.id} class="list-group-item "> ${expanse.expansename} - ${expanse.expansecategory} - ${expanse.expanseamount}
                                        <button onclick=deleteUser('${expanse.id}')> Delete User </button>
                                        // <button onclick=editUserDetails('${user.id}','${user.expanse_name}','${user.expanse_category}','${user.amount}')>Edit User </button>
                                     </li>`
  parentNode.innerHTML=parentNode.innerHTML+childHTML;
}

// function editUserDetails(uid, expanse_name,expanse_category,amount){
//   document.getElementById('email').value = expanse_category;
//   document.getElementById('name').value = expanse_name;
//   document.getElementById('phonenumber').value=amount;
//   deleteUser(uid)
// }

function deleteUser(uid){
  axios.delete(`http://localhost:3000/delete-expanse/${uid}`)
  .then((response)=>{  
    console.log(response);  
    removeUserFromScreen(uid)
  })
  .catch((err)=>{
      console.log(err);
  })
  
}

function removeUserFromScreen(uid){
  const parentNode = document.getElementById('listOfUsers');
  const childNodeToBeDeleted = document.getElementById(uid);
  if(childNodeToBeDeleted){
    parentNode.removeChild(childNodeToBeDeleted);
  }
  
}