

function getAllUsers () {
    // the URL for the request
    const url = `${API_HOST}/api/user`;
    const users = fetch(url)
        .then(res => {
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res.json();
            } else {
                alert("Could not get users");
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

function getUserById (id) {
    // the URL for the request
    const url = `${API_HOST}/api/user/${id}`;
    const user = fetch(url)
        .then(res => {
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res.json();
            } else {
                alert("Could not get users");
            }
        }).then(data => {
            // the resolved promise with the JSON body
            return data;
        })
        .catch(error => {
            console.log("error")
            console.log(error);
        });
    return user
};

function getUserByUsername (username) {
    // the URL for the request
    const url = `${API_HOST}/api/userbyusername/${username}`;
    const user = fetch(url)
        .then(res => {
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res.json();
            } else {
                alert("Could not get users");
            }
        }).then(data => {
            // the resolved promise with the JSON body
            return data;
        })
        .catch(error => {
            console.log("error")
            console.log(error);
        });
    return user
};

// A function to send a POST request with a new user
function addUser (username, password) {
    // the URL for the request
    const url = `${API_HOST}/api/user`;

    const body = {
        username: username,
        password: password};

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

// A function to send a POST request with a new user
function modifyUserInfo (id,icon, eamil, phonenum, favortype) {
    // the URL for the request
    const url = `${API_HOST}/api/user/${id}`;
    const body = {
        icon:icon,
        email: eamil,
        phonenum: phonenum,
        favortype: favortype
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

// A function to block user by id
function banUser (id, status) {
    // the URL for the request
    const url = `${API_HOST}/api/userstat/${id}`;
    const body = {
        block: status
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