'user strict'

const log = console.log;

function openForm() {
  document.getElementById("logForm").style.display = "block";
  document.getElementById("regForm").style.display = "none";
}
  
function closeForm() {
  document.getElementById("logForm").style.display = "none";
  document.getElementById("regForm").style.display = "none";
}

function openMenu() {
  document.getElementById("menu").style.display = "block";
}
  
function closeMenu() {
  document.getElementById("menu").style.display = "none";
}

let register=document.getElementById('register');
register.addEventListener('click',()=>{
  console.log("register");
  document.getElementById("logForm").style.display = "none";
  document.getElementById("regForm").style.display = "block";
})

async function loadWeekly() {
  const weeklybooks = await getAllweekly()
  for (let i = 0; i < weeklybooks.length; i++){
    book = weeklybooks[i]
    if (book.isweekly === true){
      document.getElementById("weeklyTitle").innerText=`Recommended book for this week: ${book.bookname}`
      let img = document.createElement("IMG")
      img.src = API_HOST+"/api/image/"+book.pic
      img.className = "RecBookpic"
      img.alt = "Recommend book"
      document.getElementById("RecBookcontainer").children[0].replaceWith(img)
      document.getElementById("bookinfo").innerText=book.description
    }
  }
}

let users_data =  [];

function logIn(){
  getAllUsers().then(data => {users_data = data;});
  setTimeout(function(){validateUser();}, 500);
}

function registerIn(){
  getAllUsers().then(data => {users_data = data;});
  setTimeout(function(){validateRegister();}, 500);
}

function validateRegister(){
  let username = document.getElementById("registerusername").value;
  let password = document.getElementById("registerpassword").value;
  let confpassword = document.getElementById("registerconfpassword").value;
  for (let i = 0; i < users_data.length; i++){
    if (username == users_data[i].username){
      alert("Username has been occupy");
      break;
    }
  }
  if (password != confpassword){
    alert("Password does not match");
  }
  else{
    addUser(username, password);
    // setTimeout(function(){addUser(username, password);}, 500);
    console.log("Login successfully");
    setTimeout(() => {
      window.location.assign("userlanding.html?id" + '=' +username);
    }, 300);
  }
}

function validateUser(){
  let username = document.getElementById("loginUsername").value;
  let password = document.getElementById("loginPassword").value;
  let flag = false;
  log("I am here?")
  for (let i = 0; i < users_data.length; i++){
    if (username == users_data[i].username && password == users_data[i].password){
        console.log("Login successfully");
        window.location.assign("userlanding.html?id" + '=' +username);
        flag = true; 
    }else if(username == "admin" && password == "admin"){
        window.location.assign("adminlanding.html");
        flag = true;
    }
  }
  if(!flag){
    alert("Incorrect username or password");
  }
}