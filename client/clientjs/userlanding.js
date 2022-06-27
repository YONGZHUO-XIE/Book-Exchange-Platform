'use strict'
const log = console.log;
log(window.location.search)
const urlParams = new URLSearchParams(window.location.search)
log("id is "+ urlParams.get("id"))
const username = urlParams.get("id");  //this shuld read from the place of url

let userList = [];
let postList = [];
let requestList = [];
let postDesired = [];
let search_flag = false;

let dBool = false;
let bookSelected;

const myPostArea = document.querySelector("#MyPostPage")
const explorePost = document.querySelector('#ExplorePage');
const requestPage = document.querySelector('#RequestPage')
const dropdownBox = document.querySelector('#bookDropdown')
const reqDropdown = document.querySelector('#reqDropdown')
const selectText = document.querySelector('#selectText')
const reqSelectText = document.querySelector('#reqSelectText')


const homeButton = document.querySelector("#a");
const allButton = document.querySelector("#b");
const requestButton = document.querySelector("#c");
const addButton = document.querySelector("#d");


//main listener
let menu;
let menuButtons;
let requestButtons;
let deleteButtons;
let reportButtons;
let postButtons;
let bookInfoButtons;
let commentContents;

//requestPopup listener
let reqPopUps;
let requestBtns;
let reqSelFields;
let reqSelectTexts;
let reqDropdowns;
let cancelrequestBtns;

// request page listener
let acceptRequestBtns;
let declineRequestBtns;

// reportPopup listener
let reportPopUps;
let reportContent;
let reportBtns;
let cancelreportBtns;

// bookInfo listener
let bookinfoPopUps;
let cancelbookinfoBtns;

homeButton.addEventListener('click', loadOwn);
allButton.addEventListener('click', event => {search_flag = false; loadAll();});
requestButton.addEventListener('click', loadRequests);
dropdownBox.addEventListener('click', chooseBook);

loadRecommendations();
changeProfilePicture();

function loadRecommendations(){
    document.getElementById("bannerPic").setAttribute("src", API_HOST+"/api/image/pfBackground.jpg")
    getAllUsers().then(data => {userList = data;});
    getAllPosts().then(data => {postList = data;});
    setTimeout(function(){startDisplayRecmmendations();}, 500);
}

function loadOwn(){
    getAllUsers().then(data => {userList = data;});
    getAllPosts().then(data => {postList = data;});
    setTimeout(function(){startDisplayOwnPost();}, 500);
  }
  
function loadAll(){
    if (search_flag == true){
        getAllUsers().then(data => {userList = data;});
        postList = postDesired;
    }else{
        getAllUsers().then(data => {userList = data;});
        getAllPosts().then(data => {postList = data;});
    }
    setTimeout(function(){startDisplayAllPost();}, 500);
}

function loadRequests() {
    getAllRequests().then(data => {requestList = data;});
    setTimeout(function(){DisplayAllRequest();}, 500);
}

// requestItem, deleteItem, reportItem

async function DisplayAllRequest(e) {
    clearPrevious(requestPage);

    let receiver;
    let receiverPost;
    let receiverPostBookId;
    let receiverBook;

    let own_list = [];
    for (let i = 0; i < requestList.length; i++){
        const currentUser = await getUserByUsername(username);
        if (currentUser._id == requestList[i].receiver || currentUser._id == requestList[i].sender){
            log(currentUser._id)
            log(requestList[i].receiver)
            own_list.push(requestList[i]);
        }
        log(requestList[i].receiver)
    }
    log(requestList)

    log(own_list)

    for (let j = 0; j < own_list.length; j++){
        receiver = await getUserById(own_list[j].receiver);
        let receiverName = receiver.username;
        let sender = await getUserById(own_list[j].sender);
        let senderBook = await getBookById(own_list[j].bookForExchange);
        let senderBookName = senderBook.bookname;
        receiverPost = await getPostById(own_list[j].post);
        receiverPostBookId = receiverPost.book;
        receiverBook = await getBookById(receiverPostBookId);
        let receiverBookName = receiverBook.bookname;
        requestPage.innerHTML += formatNewRequest(receiverName, sender.icon, sender.username, senderBookName, receiverBookName);
        log("InsideForLoop");
    
    }
    // if (temp !== undefined) {
    //     log("OutsideForLoop")
    //     requestPage.removeChild(document.getElementsByClassName("requestLoading")[0])
    // }
    // setTimeout(() => {
    //     clearPrevious(requestPage);
    //     log("insidePageDrawing");
    //     requestPage.innerHTML = temp;
        
    // }, 200);

    // specify actions of buttons on each request
    acceptRequestBtns = document.getElementsByClassName("acceptRequestBtn");
    declineRequestBtns = document.getElementsByClassName("declineRequestBtn")
    log(acceptRequestBtns)
    log(declineRequestBtns)
    log(declineRequestBtns)

    log("HereAndThere!" + declineRequestBtns.length)
    for (let i = 0; i < declineRequestBtns.length; i++) {
        log(i)
        postList = await getAllPosts();
        receiverPost = await getPostById(own_list[i].post);
        receiverPostBookId = receiverPost.book;
        // decline/cancel actions
        declineRequestBtns[i].addEventListener('click', event => {
            // remove this request
            log("Clicked!")
            deleteRequest(own_list[i]._id);
            setTimeout(function(){loadRequests();},300);
        });

        // accept actions
        acceptRequestBtns[i].addEventListener('click', event => {
            // add request.bookForExchange to receiver
            addBookToUser(own_list[i].bookForExchange, own_list[i].receiver);
            // add request.post.book to sender
            addBookToUser(receiverPostBookId, own_list[i].sender);
            // remove request.bookForExchange from sender
            deleteBookFromUser(own_list[i].sender, own_list[i].bookForExchange);
            // remove request.post.book from receiver
            deleteBookFromUser(own_list[i].receiver, receiverPostBookId);
            
            // delete receiver's post
            deletePost(own_list[i].post);
            // delete sender's post
            for (let k = 0; k < postList.length; k++) {
                if (own_list[i].bookForExchange == postList[k].book) {
                    deletePost(postList[k]._id);
                }
            }
            // delete this request
            deleteRequest(own_list[i]._id);

            alert("Book echange is done!");

            setTimeout(function(){loadRequests();},300);

        });
    }

    }

async function startDisplayRecmmendations(){
    log("I am startDisplayRecmmendations")
    let recommend_list = [];
    let book_list = [];
    let postuser = [];
    const currentUser = await getUserByUsername(username);
    for (let i = 0; i < postList.length; i++){
        let post_user = await getUserById(postList[i].poster);
        let book = await getBookById(postList[i].book);
        let flag = false
        let favortype = []
        for(let i = 0; i < currentUser.favortype.length; i++){
            favortype.push(currentUser.favortype[i].toLowerCase())
        }
        for(let i = 0; i < book.tags.length; i++){
            if(favortype.includes(book.tags[i].toLowerCase())){
                flag = true
                book_list.push(book)
                postuser.push(post_user)
            }
        }
        if ((post_user.username != username) && (recommend_list.length < 2) && (flag === true)){
            recommend_list.push(postList[i])
        }
    }
    let recBookIcons = document.querySelectorAll(".recBookIconContainer");
    let recMoreInfos = document.querySelectorAll(".recMoreInfo");
    for (let i = 0; i < recommend_list.length; i++){
        recBookIcons[i].innerHTML = '';
        recBookIcons[i].innerHTML += `<img class="recBookIcon" src="${API_HOST}/api/image/${recommend_list[i].img}"></img>`;
        recMoreInfos[i].innerHTML = '';
        let book = book_list[i];
        let post_user = postuser[i];
        recMoreInfos[i].innerHTML += `Book name: ${book.bookname} <br>
            author: ${book.author} <br>
            poster: ${post_user.username}
        `;
    }
}

async function startDisplayOwnPost(e) {
    clearPrevious(myPostArea);
    let own_list = [];
    for (let i = 0; i < postList.length; i++){
        let post_user = await getUserById(postList[i].poster);
        if (post_user.username == username){
            own_list.push(postList[i]);
            let book = await getBookById(postList[i].book);
            log(book.author);
            myPostArea.innerHTML += formatNewPost(post_user.username, post_user.icon, 
                postList[i].img, postList[i].content, postList[i].comments, postList[i].title, book);
        }
    }
    menuButtons = document.querySelectorAll("#morePostInfoBtn");
    deleteButtons = document.querySelectorAll("#deleteItem");
    bookinfoPopUps = document.querySelectorAll(".bookinfoPopUp");
    bookInfoButtons = document.querySelectorAll("#bookinfoItem");
    cancelbookinfoBtns = document.querySelectorAll("#cancelbookinfoBtn");
    for (let i = 0; i < menuButtons.length; i++){
        menuButtons[i].addEventListener('click', event => {
            menu = document.querySelectorAll(".menu")[i];
            if (menu.style.display == 'block') {
                menu.style.display = 'none'; 
            } else {
                menu.style.display = 'block'; 
            }
        })
        deleteButtons[i].addEventListener('click', event => {
            log(own_list[i]._id);
            deletePost(own_list[i]._id);
            deleteReportById(own_list[i]._id)
            menu = document.querySelectorAll(".menu")[i];
            if (menu.style.display == 'block') {
                menu.style.display = 'none'; 
            } else {
                menu.style.display = 'block'; 
            }
            setTimeout(function(){loadOwn();},300);
        })
        bookInfoButtons[i].addEventListener('click', event => {
            log('you click bookinfo');
            bookinfoPopUps[i].style.display = 'block';
            cancelbookinfoBtns[i].addEventListener('click', event => {
                bookinfoPopUps[i].style.display = 'none'
            })
            menu = document.querySelectorAll(".menu")[i];
            if (menu.style.display == 'block') {
                menu.style.display = 'none'; 
            } else {
                menu.style.display = 'block'; 
            }
        })
    }
    
}

async function startDisplayAllPost(e) {
    clearPrevious(explorePost);
    const currentUser = await getUserByUsername(username);
    log("HelloTestHere!" + currentUser.username)
    for (let i = 0; i < postList.length; i++){
        let post_user = await getUserById(postList[i].poster);
        // let post_book = await getBookById(postList[i].book);
        let book = await getBookById(postList[i].book);
        explorePost.innerHTML += formatNewPost(post_user.username, post_user.icon, 
            postList[i].img, postList[i].content, postList[i].comments, postList[i].title, book);
    }

    let booklist = currentUser.books
    let bookEntryList = [];
    // get the available book list from mangoDB
    for (let i = 0; i < booklist.length; i++) {
        let book = await getBookById(booklist[i])
        bookEntryList.push(book)
    }

    menuButtons = document.querySelectorAll("#morePostInfoBtn");
    requestButtons = document.querySelectorAll("#requestItem");
    deleteButtons = document.querySelectorAll("#deleteItem");
    reportButtons = document.querySelectorAll("#reportItem");
    bookInfoButtons = document.querySelectorAll("#bookinfoItem");
    postButtons = document.querySelectorAll(".postCmt");
    commentContents = document.querySelectorAll("#cmtContent");

    reqPopUps = document.querySelectorAll(".requestFormPopUp");
    reqSelFields = document.querySelectorAll("#reqSelField");
    reqSelectTexts = document.querySelectorAll("#reqSelectText");
    reqDropdowns = document.querySelectorAll("#reqDropdown");
    requestBtns = document.querySelectorAll("#requestBtn");
    cancelrequestBtns = document.querySelectorAll("#cancelrequestBtn");
   
    reportPopUps = document.querySelectorAll(".reportFormPopUp");
    reportContent = document.querySelectorAll("#rptDescription");
    reportBtns = document.querySelectorAll("#reportBtn");
    cancelreportBtns = document.querySelectorAll("#cancelreportBtn");

    bookinfoPopUps = document.querySelectorAll(".bookinfoPopUp");
    cancelbookinfoBtns = document.querySelectorAll("#cancelbookinfoBtn");

    for (let i = 0; i < menuButtons.length; i++){
        menuButtons[i].addEventListener('click', event => {
            menu = document.querySelectorAll(".menu")[i];
            if (menu.style.display == 'block') {
                menu.style.display = 'none'; 
            } else {
                menu.style.display = 'block'; 
            }
        })
        //replace by request function
        let bookClickedId;
        requestButtons[i].addEventListener('click', event => { 
            let dResBool = false;
            reqPopUps[i].style.display = 'block'
            reqSelFields[i].addEventListener('click', event => {

                log("TestHere!")
                clearPrevious(reqDropdowns[i])
                dResBool = !dResBool
                // get the available book list from mangoDB
                for (let j = 0; j < bookEntryList.length; j++) {
                        const listElement = document.createElement('li')
                        listElement.className = 'bookEntry'
                        let bookEntry = bookEntryList[j]
                        const bInfo = `${bookEntry.bookname} -- ${bookEntry.author}`
                        // const bInfo = `${bookEntry._id}`
                        listElement.appendChild(document.createTextNode(bInfo))
                        // set bookid as index for each list element
                        listElement.index = bookEntry._id
                        reqDropdowns[i].appendChild(listElement)
                    }
                if (dResBool) {
                    reqDropdowns[i].style.display = "block"
                }
                else {
                    reqDropdowns[i].style.display = "none"
                }
            });

            reqDropdowns[i].addEventListener('click', event => {

                // do something to log the information of the selected book
                dResBool = false
                if  (event.target.innerText != "") {
                    reqSelectTexts[i].innerHTML = event.target.innerText;
                    bookClickedId = event.target.index
                    log("HereClicked " + bookClickedId)
                }
                
                reqDropdowns[i].style.display = "none"
                }
            );

            requestBtns[i].addEventListener('click', event => {
                log("button" + i + "clicked")
                // initiate a new request
                addRequest(postList[i].poster, currentUser._id, 
                    postList[i]._id, bookClickedId);
                reqPopUps[i].style.display = 'none'
            });
            
            log("this is for requestExchange"); //change this step?
            // requestPost(postList[i]._id, postList[i].book, postList[i].poster, own_id?)
            cancelrequestBtns[i].addEventListener('click', event => {
                reqPopUps[i].style.display = 'none'
            })
            menu = document.querySelectorAll(".menu")[i];
            if (menu.style.display == 'block') {
                menu.style.display = 'none'; 
            } else {
                menu.style.display = 'block'; 
            }
        })
        deleteButtons[i].addEventListener('click', event => {
            log(postList[i]._id);
            deletePost(postList[i]._id);
            deleteReportById(postList[i]._id)
            menu = document.querySelectorAll(".menu")[i];
            if (menu.style.display == 'block') {
                menu.style.display = 'none'; 
            } else {
                menu.style.display = 'block'; 
            }
            setTimeout(function(){loadAll();},300);
        })
        //replace by report function
        reportButtons[i].addEventListener('click', event => { 
            log("this is for reportPost");
            reportPopUps[i].style.display = 'block';
            reportBtns[i].addEventListener('click', event => {
                const rptDescription = document.querySelectorAll("#rptDescription")[i].value;
                log(rptDescription);
                log("poster id: " + postList[i]._id);
                log("user id: " + currentUser._id);
                addReport(currentUser._id, postList[i]._id, rptDescription);
                reportPopUps[i].style.display = 'none';
            })
            cancelreportBtns[i].addEventListener('click', event => {
                reportPopUps[i].style.display = 'none'
            })
            menu = document.querySelectorAll(".menu")[i];
            if (menu.style.display == 'block') {
                menu.style.display = 'none'; 
            } else {
                menu.style.display = 'block'; 
            }
        })
        postButtons[i].addEventListener('click', event => { 
            log('you click post comment!');
            let commentContent = commentContents[i].value;
            let comment = {
                commentator: username,
                content: commentContent
            }
            if(commentContent.length == 0){
                log("comment empty!")
            }
            else{
                log(postList[i]._id)
                modifyPostComments(postList[i]._id, comment); 
                setTimeout(function(){loadAll();}, 500);
            }
        })
        bookInfoButtons[i].addEventListener('click', event => {
            log('you click bookinfo');
            bookinfoPopUps[i].style.display = 'block';
            cancelbookinfoBtns[i].addEventListener('click', event => {
                bookinfoPopUps[i].style.display = 'none'
            })
            menu = document.querySelectorAll(".menu")[i];
            if (menu.style.display == 'block') {
                menu.style.display = 'none'; 
            } else {
                menu.style.display = 'block'; 
            }
        })
    }
}

async function addNewpost(){
    // get all inputs from the PopUp form
    let postTitle = document.getElementById("srcPostTitle").value;
    let descriptioninfo = document.getElementById("srcDescription").value;
    let bookinfo = document.getElementById("selectText").innerHTML
    const currentUser = await getUserByUsername(username);
    // should check bookId cannot be empty
    if (currentUser.username.length == 0 
        || postTitle.length == 0 || descriptioninfo.length == 0 ) {
            alert("info not complete")
    }
    else if(bookinfo === ""){
        alert("haven't chose book")
        closePopUp()
        return
    }else{
        let bookId = bookSelected;
        log(bookId)
        if(document.getElementById("input").files[0] === undefined){
            alert("haven't chose picture")
            closePopUp()
            return
        }
        const newPic = document.getElementById("input").files[0].name
        addPost(currentUser._id, bookId, descriptioninfo, postTitle, newPic) //this is about to change?
        closePopUp()
    }
}

function displayAddBook(){
    log("I am in display add book");
    closeProfile();
    let profileCard = document.getElementById("NewBookPage")
    profileCard.style.display = "block";
}

async function addNewBook(){
    log("I am in add new book");
    let bookName = document.getElementById("srcBookName").value;
    let authorName = document.getElementById("srcBookAuthor").value;
    let bookTag = document.getElementById("srcBookTag").value;
    let separatedTagArray = bookTag.split(',')
    log(bookName, authorName, bookTag)
    const returnbook =  await addBook(bookName, authorName, separatedTagArray)
    const bookid = returnbook._id;
    log("the new book id is " + bookid);
    const currentUser = await getUserByUsername(username);
    const userid = currentUser._id;
    log("the current user id is " + userid);
    addBookToUser(bookid, userid);
    log("Successfully add a new book to the user")
    closeAddBookPopUp()
    loadAll();
}

function clearPrevious(place){
    place.innerHTML = '';
}

async function changeTab(e, pageName) {
    // Declare all variables
    let i, tabCon, tabs;

    // hide all elements with class "tabContent"
    tabCon = document.getElementsByClassName("tabContent")
    for (i = 0; i < tabCon.length; i++) {
        tabCon[i].style.display = "none"
    }

    // deactivate all elements with class "tab"
    tabs = document.getElementsByClassName("tab")
    for (i = 0; i < tabCon.length; i++) {
        tabs[i].className = tabs[i].className.replace(" active", "")
    }

    // show the current tab and highlight the button
    if (pageName == "MyPostPage") {
        log("i am in change");
    }
    else if (pageName == "ExplorePage") {
        log("i am in change");
    }
    else if (pageName == "RequestPage") {
    }
    else {
        const curuser = await getUserByUsername(username);
        if(curuser.block === true){
            alert("you are banned by admin")
            return
        }
    }

    document.getElementById(pageName).style.display = "block"
    // e.currentTarget.className += " active"
}


async function openUserProfile() {
    const curuser = await getUserByUsername(username);
    console.log(curuser)
    document.getElementById("userProfile").style.display = "block"
    document.getElementById("profileCardName").innerText = curuser.username
    document.getElementById("user_email").innerText = curuser.email
    document.getElementById("user_phonenum").innerText = curuser.phonenum
    for (let i = 0; i < curuser.favortype.length; i++) {
        let type = document.createElement("li")
        type.style = "display:inline; margin-left:5px"
        type.innerText = curuser.favortype[i]
        document.getElementById("userfavor").appendChild(type)
    }
}

async function changeProfilePicture(e) {
    // let imgSrc = "../../img/" + username + ".jpg"
    const curuser = await getUserByUsername(username);
    let imgSrc = API_HOST+"/api/image/"+curuser.icon
    document.getElementById("profilePicCircle").setAttribute("src", imgSrc)
    document.getElementById("accountProfileIcon").setAttribute("src", imgSrc)
    document.getElementById("profileCardPic").setAttribute("src", imgSrc)
    document.getElementById("profileCardName").innerText = username
    // Initialize the Explore Page
    loadAll(e);
}

function closePopUp() {
    document.getElementById("NewPostPage").style.display = "none"
    // click the Explore Icon
    setTimeout(() => {
        document.getElementById("b").click()
    }, 200);
}

function closeProfile() {
    let profileCard = document.getElementById("userProfile")
    profileCard.style.display = "none"
}

function closeAddBookPopUp(){
    document.getElementById("NewBookPage").style.display = "none"
}

function changeInfo() {
    let inputbox = document.getElementsByClassName("change")
    for (let i = 0; i < inputbox.length; i++) {
        inputbox[i].style.display = "block"
    }
    document.getElementById("submitBtn").style.display = "block"
    document.getElementsByClassName("addNewBook")[0].style.display = "none"
    document.getElementsByClassName("changeinfo")[0].style.display = "none"
}


async function submitchange() {
    finishedit()
    let curuser = await getUserByUsername(username);
    let newEmail = document.getElementById("newEmail").value
    let newPhonenum = document.getElementById("newPhonenum").value
    let newPic = curuser.icon
    if(document.getElementById("fileinput").files[0]!=undefined){
        newPic = document.getElementById("fileinput").files[0].name
    }
    const favortype = document.getElementById("favortype").value
    let split = favortype.split(',')
    if(newEmail===""){
        newEmail = curuser.email
    }
    if(newPhonenum===""){
        newPhonenum = curuser.phonenum
    }
    if(favortype===""){
        split = curuser.favortype
    }
    modifyUserInfo(curuser._id,newPic, newEmail, newPhonenum,split)
    document.getElementsByClassName("addNewBook")[0].style.display = 'block'
    document.getElementsByClassName("changeinfo")[0].style.display = 'block'
    document.getElementById("user_email").innerText = newEmail
    document.getElementById("user_phonenum").innerText = newPhonenum
    setTimeout(() => {
        openUserProfile()
    }, 150); 
    loadRecommendations()
}

function finishedit() {
    let inputbox = document.getElementsByClassName("change")
    for (let i = 0; i < inputbox.length; i++) {
        inputbox[i].style.display = "none"
    }
    document.getElementById("submitBtn").style.display = "none"
}

async function openDropdown(e) {

    clearPrevious(dropdownBox)
    dBool = !dBool
    const curuser = await getUserByUsername(username);
    let booklist = curuser.books
    // get the available book list from mangoDB
    for (let i = 0; i < booklist.length; i++) {
        let listElement = document.createElement('li')
        listElement.className = 'bookEntry'
        let book = await getBookById(booklist[i])
        const bInfo = `${book.bookname} -- ${book.author}`
        listElement.appendChild(document.createTextNode(bInfo))
        listElement.index = book._id;
        dropdownBox.appendChild(listElement)
    }
    if (dBool) {
        dropdownBox.style.display = "block"
    }
    else {
        dropdownBox.style.display = "none"
    }
}


function chooseBook(e) {
    // do something to log the information of the selected book
    dBool = false
    if  (e.target.innerText != "") {
        selectText.innerHTML = e.target.innerText;
        bookSelected = e.target.index;
    }
    log("TestHere!")
    dropdownBox.style.display = "none"
}


function logout() {
    window.location.assign("/")
}

function searchDisplay(){
    document.getElementById("b").click()
    setTimeout(function(){searchAll();},1000);
}

async function searchAll() {
    let searchContent = document.getElementById("postName").value;
    log("Start the post section?: " + postList);
    log("Search value: " + searchContent);
    postDesired = await contentSearch(searchContent)
    // display all desired post to the Explore Page
    clearPrevious(explorePost);
    log("Finishing clearing for search?")
    log("postDesired " + postDesired);
    search_flag = true;
    loadAll()
}

async function contentSearch(content){ //this should be substitute with the third party API
    const feedback = [];
    const search_content = content.toLowerCase();
    for (let i = 0; i < postList.length; i++){
        const curbook = await getBookById(postList[i].book)
        for (let j = 0; j < curbook.tags.length; j++){
            if (postList[i].title.toLowerCase().includes(search_content) || curbook.tags[j].toLowerCase().includes(search_content)
                || curbook.bookname.toLowerCase().includes(search_content) || curbook.author.toLowerCase().includes(search_content)
                || postList[i].content.toLowerCase().includes(search_content)
            ){
                feedback.push(postList[i]);
                break;
            }
        }
    }
    return feedback;
}

function formatNewRequest(format_receiverName, format_sendericon, format_senderName, format_senderBookName, format_receiverBookName) {
    let requestType;
    let word;
    let acceptBtn;
    let CancelBtn;
    
    if (format_receiverName == username) {
        requestType = `reqTwo`
        format_receiverName = `your`
        word = `wants`
        acceptBtn = `<button class="requestAction acceptRequestBtn" onclick="">Accept</button>`
        CancelBtn = `<button class="requestAction declineRequestBtn" onclick="">Decline</button>`
    }
    else {
        requestType = `reqOne`
        format_senderName = `you`
        word = `want`
        acceptBtn = `<button class="requestAction acceptRequestBtn" style="display: none" onclick="">Accept</button>`
        CancelBtn = `<button class="requestAction declineRequestBtn" onclick="">Cancel</button>`
    }

    let requestMessage = 
    `
    <strong>${format_senderName}</strong> ${word} to use <<strong>${format_senderBookName}</strong>> in exchange for 
    ${format_receiverName} <<strong>${format_receiverBookName}</strong>>

    `

    let htmlCard = 
    `
    <div class="${requestType}">
        <div class="userIconContainer" style="float: left;">
            <img class="accountIconPost" src="${API_HOST}/api/image/${format_sendericon}" style="border-radius: 50%;">
        </div>
        <div class="userAccountName" style="float:left">
            ${requestMessage}
        </div>
        <div class="buttonContainer" style="float: right;">
            <div>
            ${acceptBtn}
            </div>
            <div>
            ${CancelBtn}
            </div>
        </div>
    </div>
    
    `
    return htmlCard;
}


function formatNewPost(format_username, format_accountIcon, format_postPicture, format_description, format_comments, format_title, book){
    let menu_list;
    if (format_username == username){
        log("I am formatting own post");
        menu_list = `
        <ul class="menu">
            <button class="moreBtn" id="requestItem" style="display:none" onclick="">Request</button>
            <button class="moreBtn" id="reportItem" style="display:none" onclick="">Report</button>
            <button class="moreBtn" id="bookinfoItem" onclick="">Bookinfo</button>
            <button class="moreBtn" id="deleteItem" onclick="">Delete</button>
            Hello?
        </ul>
        `
    }
    else{
        log("I am formatting general post");
        menu_list = `
        <ul class="menu">
            <button class="moreBtn" id="requestItem" onclick="">Request</button>
            <button class="moreBtn" id="reportItem" onclick="">Report</button>
            <button class="moreBtn" id="bookinfoItem" onclick="">Bookinfo</button>
            <button class="moreBtn" id="deleteItem" style="display:none" onclick="">Delete</button>
        </ul>
        `
    }
    let commnet_section = '';
    for (let i = 0; i < format_comments.length; i++){
        let commentator = format_comments[i].commentator;
        let comment_content = format_comments[i].content;
        commnet_section += `
         <strong>${commentator}:</strong> ${comment_content}<br>
        `;
    }
    var htmlCard = `<div class="post">

        <div class="requestFormPopUp">
            <button id="cancelrequestBtn" onclick="">X</button>
            <div class="reqChooseBkPrompt">
                <h4>
                choose an existing book
                </h4>
            </div>
            <div class="reqSelector">
                <div id="reqSelField" onclick="">
                <p id="reqSelectText">Select a book</p>
                <img src="../../img/arrow.png">
                </div>
                <!--dropdown list for all available books-->
                <ul id="reqDropdown">
                </ul>
            </div>
            <div id="requestBtn">
                <button type="submit" class="sBtn" onclick="">
                Send Request
                </button>
            </div>
        </div>
        
        <div class="reportFormPopUp">
            <button id="cancelreportBtn" onclick="">X</button>
            <div class="reportPrompt">
                <h4>
                Report Message
                </h4>
            </div>
            <div class="reportDescription">
                <div class="reportDescriptionField">
                    <input type="text" placeholder="Enter Report Description" id="rptDescription"/>
                </div>
            </div>
            <div id="reportBtn">
                <button type="submit" class="sBtn" onclick="">
                Submit report
                </button>
            </div>
        </div>

        <div class="bookinfoPopUp">
            <button id="cancelbookinfoBtn" onclick="">X</button>
            <div class="bookinfo">
                <h5>
                Book author: <br>
                ${book.author}  <br>
                <br>
                Book Title:  <br>
                ${book.bookname}  <br>
                <br>
                Book Tags:  <br>
                ${book.tags}  <br>
                </h4>
            </div>
        </div>

        <div class="postUserContainer">
          <div class="userIconContainer" style="float: left;">
            <img class="accountIconPost" src="${API_HOST}/api/image/${format_accountIcon}" style="border-radius: 50%;">
          </div>
          <div class="userAccountName" style="float:left">
            ${format_username}
          </div>
          <div id="moreOfThePost" style="float: right;">
            <button class="fa fa-ellipsis-h" id="morePostInfoBtn" onclick=""></button>
          </div>
          ${menu_list}
        </div>
        <img class="PostContentPicture" src="${API_HOST}/api/image/${format_postPicture}">
        <div class="postDescription">
          <h4>${format_title}</h4>
          <strong>${format_username}</strong> ${format_description}<br>
          <p> --------------------------------------------------------------------------------------------------------<br>
          ${commnet_section}
        </div>
        <div>
          <button class="fa fa-lightbulb-o addCmtIcon" style="float:left"></button>
          <div class="writeCmtBoxContainer">
            <input id='cmtContent' type="text" placeholder="Add your comment...">
            <button class="postCmt" style="float:right">Post</button>
          </div>
        </div>
      </div>`
    return htmlCard;
}


