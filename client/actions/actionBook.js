
function getBookById (id) {
    // the URL for the request
    const url = `${API_HOST}/api/book/${id}`;
    const book = fetch(url)
        .then(res => {
            if (res.status === 200) { 
                // return a promise that resolves with the JSON body
                return res.json();
            } else {
                alert("Could not get books");
            }
        }).then(data => {
            // the resolved promise with the JSON body
            // console.log(data);
            return data;
        })
        .catch(error => {
            console.log("error")
            console.log(error);
        });
    return book
};

function addBook (bookname, author, tags) {
    // the URL for the request
    const url = `${API_HOST}/api/addbook`;

    const body = {
        bookname: bookname,
        author: author,
        tags: tags
    };

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "post",
        // The data we are going to send in our request
        body: JSON.stringify(body),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });
    // Send the request with fetch()
    const book = fetch(request)
    .then(function (res) {
        // Handle response we get from the API.
        // Usually check the error codes to see what happened.
        if (res.status === 200) {
            return res.json();
        }
    })
    .then(data => {
        return data;
    })
    .catch(error => {
        console.log("error");
        console.log(error);
    });
    return book;
};

// add a new book to user
function addBookToUser(bookid, userid){
    const url = `${API_HOST}/api/useraddbook/${userid}`;

    const body = {
        "bookId": bookid
    };

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "post",
        // The data we are going to send in our request
        body: JSON.stringify(body),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });
    // Send the request with fetch()
    fetch(request)
    .then(function (res) {
        // Handle response we get from the API.
        // Usually check the error codes to see what happened.
        if (res.status === 200) {
            return res.json();
        }
    })
    .then(json => {
        console.log(json)
    })
    .catch(error => {
        console.log(error);
    });
};

// A function to delete a book from user by book id
function deleteBookFromUser (userId, bookId){
    // the URL for the request
    log("I am here? " + bookId)
    log("I am here? " + userId)
    const url = `${API_HOST}/api/userremovebook/${userId}`;
    const body = {
        bookId: bookId
    };

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "POST",
        // The data we are going to send in our request
        body: JSON.stringify(body),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    // Send the request with fetch()
    fetch(request)
    .then(function (res) {
        // Handle response we get from the API.
        // Usually check the error codes to see what happened.
        if (res.status === 200) {
            console.log('Delete Successfully')
        }
    })
    .catch(error => {
        console.log(error);
    });
}

// some function for weekly
function getAllweekly () {
    // the URL for the request
    const url = `${API_HOST}/api/weekly`;
    const books = fetch(url)
        .then(res => {
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res.json();
            } else {
                alert("Could not get weekly books");
            }
        }).then(data => {
            // the resolved promise with the JSON body
            console.log(data);
            return data;
        })
        .catch(error => {
            console.log("error")
            console.log(error);
        });
    return books
};

function newWeekly (bookname, pic, description) {
    // the URL for the request
    const url = `${API_HOST}/api/weekly`;

    const body = {
        bookname: bookname,
        pic: pic,
        description: description
    };

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "post",
        // The data we are going to send in our request
        body: JSON.stringify(body),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });
    // Send the request with fetch()
    const book = fetch(request)
    .then(function (res) {
        // Handle response we get from the API.
        // Usually check the error codes to see what happened.
        if (res.status === 200) {
            return res.json();
        }
    })
    .then(json => {
        console.log(json)
    })
    .catch(error => {
        console.log(error);
    });
    return book;
};

function changeWeekly () {
    // the URL for the request
    const url = `${API_HOST}/api/weekly`;
    const books = fetch(url)
        .then(res => {
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res.json();
            } else {
                alert("Could not get weekly books");
            }
        }).then(data => {
            // the resolved promise with the JSON body
            console.log(data);
            return data;
        })
        .catch(error => {
            console.log("error")
            console.log(error);
        });
    return books
};

function changeWeekStat (bookname, isweekly) {
    // the URL for the request
    const url = `${API_HOST}/api/weekly/${bookname}`;
    const body = {
        status: isweekly
    };
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "PATCH",
        // The data we are going to send in our request
        body: JSON.stringify(body),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });
    // Send the request with fetch()
    fetch(request)
    .then(function (res) {
        // Handle response we get from the API.
        // Usually check the error codes to see what happened.
        if (res.status === 200) {
            return res.json();
        }
    })
    .then(json => {
        console.log(json)
    })
    .catch(error => {
        console.log(error);
    });
};
