
let users = [];
let Posts = [];
let reports = [];
let weekly_lst = [];
let selectUser;
let selectPost;
let selectReport;
let curWeekly;

function loadInfo(){
    getAllUsers().then(data => {users = data;});
    getAllPosts().then(data => {Posts = data;});
    getAllReports().then(data => {reports = data;});
    getAllweekly().then(data => {weekly_lst = data;});
    setTimeout(function(){loadUsers(); loadPosts(); loadReports();loadWeekly();}, 500);
}

function clearPrevious(place){
    place.innerHTML = '';
}

const bookcontain = document.querySelector("#center")
function loadPosts(){
    clearPrevious(bookcontain);
    for (let i = 0; i < Posts.length; i++) {
        bookcontain.innerHTML += `<button type="button" class="post">post title:  ${Posts[i].title}</button>`
    }
    for (let i = 0; i < Posts.length; i++) {
        const post = bookcontain.children[i];
        post.addEventListener("click", function() {
            displayDetail(Posts[i]);
        });
    }
}

const Usercontain = document.querySelector("#center-user")
function loadUsers(){
    clearPrevious(Usercontain);
    for (let i = 0; i < users.length; i++) {
        const username = users[i].username;
        Usercontain.innerHTML += `<button type="button" class="user">${username}</button>`
    }
    for (let i = 0; i < users.length; i++) {
        const user = Usercontain.children[i];
        console.log(i)
        user.addEventListener("click", function() {
            displayUser(users[i]);
        });
    }
}

const selecttag = document.querySelector("#weeklyselect")
async function loadWeekly(){
    for (let i = 0; i < weekly_lst.length; i++) {
        if(weekly_lst[i].isweekly ===true){
            curWeekly = weekly_lst[i].bookname
        }
        const oldbooks = weekly_lst[i].bookname;
        console.log(oldbooks)
        let node = document.createElement('option');
        node.value = oldbooks;
        node.innerText = oldbooks;
        selecttag.appendChild(node)
    }
}

const reportArea = document.querySelector(".reportList")
async function loadReports(){
    clearPrevious(reportArea);
    for (let i = 0; i < reports.length; i++) {
        let report_post = await getPostById(reports[i].post);
        reportArea.innerHTML += `<button type="button" class="report">
        <p>Report id: ${reports[i]._id}</p>
        <p>Post with problem: ${report_post.title}</p>
        <p>reason: ${reports[i].content}</p>
        </button>`
    }
    for (let i = 0; i < reports.length; i++) {
        const report = reportArea.children[i];
        report.addEventListener("click", function() {
            displayReport(reports[i]);
        });
    }
}

function changeOp(checkbox) {
    var header = document.querySelector('#header');
    if (checkbox.checked){
        document.getElementById("center").style.display = "grid";
        document.getElementById("center-user").style.display = "none";
        header.children[2].innerText = "Edit post information"
    }else{
        document.getElementById("center").style.display = "none";
        document.getElementById("center-user").style.display = "grid";
        header.children[2].innerText = "Edit user accounts"
    }
  }

async function displayDetail(post){
    selectPost = post;
    let post_user = await getUserById(post.poster);
    let book = await getBookById(post.book);
    console.log(book)
    document.getElementById("overlay").style.display = "block";
    document.getElementById("post-detail").style.display = "block";
    const detail =  document.getElementById("post-container");
    const title1 = post.title;
    const postbook = book.bookname;
    const content = post.content;
    const poster = post_user.username;
    const img1 = post.img;
    detail.innerHTML += '<div class="row mt-4">' +
    formatOutput(title1, postbook, content, poster, img1) +
    '</div>';
}

async function displayUser(user){
    selectUser = user;
    let books = [];
    document.getElementById("overlay").style.display = "block"
    document.getElementById("user-detail").style.display = "block";
    const detail =  document.getElementById("user-container");
    const name = user.username;
    const email = user.email;
    const phonenum = user.phonenum;
    const img = user.icon
    const status = user.block
    const id = user._id;
    if (status===true){
        let blockbtn = document.getElementById("blockbtn")
        blockbtn.innerText="lift ban"
        blockbtn.style.backgroundColor="#4CAF50"
        blockbtn.onclick = function(){blockUser(user, false);};
    }else{
        blockbtn.style.backgroundColor="red"
        document.getElementById("blockbtn").innerText="ban user"
    }
    for (let i = 0; i < user.books.length; i++) {
        let book = await getBookById(user.books[i]);
        books.push(book.bookname)
    }
    console.log(books);
    detail.innerHTML += OutputUser(name, email, phonenum, img, books, id, status)
}

async function displayReport(report){
    selectReport = report;
    let report_user = await getUserById(report.reporter);
    let report_post = await getPostById(report.post);
    document.getElementById("overlay").style.display = "block";
    document.getElementById("report-detail").style.display = "block";
    const detail =  document.getElementById("report-container");
    const id = report._id;
    const post = report_post.title;
    const reporter = report_user.username;
    const reason = report.content;
    detail.innerHTML += `<div class="row mt-4">
    <div class="col-md-8">
        <h5 class="card-title">Post with problem: ${post}</h5>
        <p class="card-text">Id: ${id}</p>
        <p class="card-text">Reporter: ${reporter}</p>
        <p class="card-text">reason: ${reason}</p>
        </div>
    </div>`;
}

async function changeWeekly(){
    document.getElementById("overlay").style.display = "block"
    document.getElementById("weekly-detail").style.display = "block";
}

function submitChange(){
    let select = document.getElementById('weeklyselect');
    let value = select.options[select.selectedIndex].value;
    if(curWeekly !== undefined){
        changeWeekStat(curWeekly, false)
    }
    if(value !== "undefined"){
        changeWeekStat(value, true)
        curWeekly = value
    }else if(document.getElementById("newRec").value === ""){
        alert("no new added book")
    }else{
        const newName = document.getElementById("newRec").value
        const newDescription = document.getElementById("newDes").value
        const newPic = document.getElementById("input").files[0].name
        newWeekly(newName, newPic, newDescription)
        curWeekly = newName
        let node = document.createElement('option');
        node.value = newName;
        node.innerText = newName;
        selecttag.appendChild(node)
    }
    console.log("change sucess")
}

function formatOutput(title, booktitle, content, poster, img){
    var htmlCard = `<div class="col-lg-6">
        <div class="card" style="">
            <div class="col-md-4">
            <img src="${API_HOST}/api/image/${img}" class="card-img" alt="...">
            </div>
            <div class="col-md-8">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">Post content: ${content}</p>
                <p class="card-text">Correspod book: ${booktitle}</p>
                <p class="card-text">Poster: ${poster}</p>
            </div>
        </div>
        </div>
    </div>`
    return htmlCard;
}

function OutputUser(username, email, phonenum, icon, books, id, stat){
    bookList = displaylist(books)
    var htmlCard = `
            <div class="col-md-8">
            <div class="card-body">
            <img class="accountIcon" src="${API_HOST}/api/image/${icon}">
            </div>
                <h4 class="card-title">${username}</h4>
                <p class="card-text">Userid: ${id}</p>
                <p class="card-text">Email: ${email}</p>
                <p class="card-text">Phone Number: ${phonenum}</p>
                <p class="card-text">Is banned: ${stat}</p>`
                + `<p>Books he/she owns</p><ul>${bookList}</ul>` +  
                `
            </div>
    </div>`
    return htmlCard;
}

function  displaylist(list){
    var htmlCard = `<li>`
    for(var i = 0; i < list.length; i++){
        htmlCard += `<p>${list[i]}</p>`
    }
    htmlCard += `</li>`
    return htmlCard
}

function closeWindow() {
    document.getElementById("post-detail").style.display = "none";
    document.getElementById("post-container").innerHTML = "";
    document.getElementById("overlay").style.display = "none";
    document.getElementById("user-container").innerHTML = "";
    document.getElementById("user-detail").style.display = "none";
    document.getElementById("report-container").innerHTML = "";
    document.getElementById("report-detail").style.display = "none";
    document.getElementById("weekly-detail").style.display = "none";
  }

function removePost() {
    deletePost(selectPost._id)
    closeWindow()
    setTimeout(() => {
        loadInfo()
    }, 300);
}

function blockUser(user, block) {
    if(block===false){
        banUser(user._id, false)
    }else{
        user = selectUser._id
        banUser(user, true)
    }
    closeWindow()
    setTimeout(() => {
        loadInfo()
    }, 300);
}

function handleReport(){
    deleteReport(selectReport._id)
    closeWindow()
    setTimeout(() => {
        loadInfo()
    }, 300);
}
