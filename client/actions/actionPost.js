// const API_HOST = 'http://localhost:5000'
const API_HOST = ''

function getAllPosts () {
    // the URL for the request
    const url = `${API_HOST}/api/post`;
    const users = fetch(url)
        .then(res => {
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res.json();
            } else {
                alert("Could not get posts");
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
    return users
};

function getPostById (id) {
    // the URL for the request
    const url = `${API_HOST}/api/post/${id}`;
    const post = fetch(url)
        .then(res => {
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res.json();
            } else {
                alert("Could not get posts");
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
    return post
};

// A function to send a POST request with a new post
function addPost (poster, book, content, title, img) {
    // the URL for the request
    const url = `${API_HOST}/api/post`;

    const body = {
        poster: poster,
        book: book,
        content: content,
        title: title,
        img: img
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


// A function to update the comment section in Post
function modifyPostComments (id, comment) {
    // the URL for the request
    const url = `${API_HOST}/api/updatepost/${id}`;
    const body = {
        newcomment: comment
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


// A function to delete a POST by post id
function deletePost (id){
    // the URL for the request
    const url = `${API_HOST}/api/post`;
    const body = {
        id: id
    };

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "DELETE",
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