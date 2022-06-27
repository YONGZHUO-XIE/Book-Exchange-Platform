// get all requests
function getAllRequests () {
    // the URL for the request
    const url = `${API_HOST}/api/request`;
    const requests = fetch(url)
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
    return requests
};

// initiate a new request
function addRequest (receiverId, senderId, postId, bookId) {
    // the URL for the request
    const url = `${API_HOST}/api/request`;
    console.log(bookId);

    const body = {
        receiver: receiverId,
        sender: senderId,
        post: postId,
        bookForExchange: bookId
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
    const req = fetch(request)
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
    return req;
};

// A function to delete a request by id
function deleteRequest (id){
    // the URL for the request
    const url = `${API_HOST}/api/request`;
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
    .then(json => {
        console.log(json)
    })
    .catch(error => {
        console.log(error);
    });
}