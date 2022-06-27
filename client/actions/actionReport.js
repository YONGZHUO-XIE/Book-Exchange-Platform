
function getAllReports () {
    // the URL for the request
    const url = `${API_HOST}/api/report`;
    const reports = fetch(url)
        .then(res => {
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res.json();
            } else {
                alert("Could not get reports");
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
    return reports
};

// A function to send a POST request with a new report
function addReport (reporter, post, content) {
    // the URL for the request
    const url = `${API_HOST}/api/report`;

    const body = {
        reporter: reporter,
        content: content,
        post: post
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

// A function to delete a report by id
function deleteReport (id){
    // the URL for the request
    const url = `${API_HOST}/api/report`;
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

// A function to delete a report by id
function deleteReportById (postid){
    // the URL for the request
    const url = `${API_HOST}/api/reportbypost`;
    const body = {
        postid: postid
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
            console.log('Delete reports Successfully')
        }
    })
    .catch(error => {
        console.log(error);
    });
}