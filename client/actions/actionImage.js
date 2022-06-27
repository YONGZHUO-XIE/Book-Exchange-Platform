let selectedImage;
let selectedImageName;

function fileSelectedHandler (event) {
    selectedImage = event.target.files[0],
    selectedImageName = event.target.files[0].name
    console.log(selectedImage);
}

function fileSubmitHandler (event) {
    const url = `${API_HOST}/api/image/upload`;
    console.log("start fetch");
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedImage);
    console.log(formData);
    const request = new Request(url, {
        method: "post",
        body: formData,
    });
    fetch(request)
        .then(function (res) {
            // Handle response we get from the API.
            // Usually check the error codes to see what happened.
            if (res.status === 200) {
                // If image was added successfully, tell the user.
                console.log("upload sucess")
            }
        })
        .catch (err => {
        console.log(err)
        if (err.response.status === 500) {
            console.log("There was a problem with a server")
        } else {
            console.log(err.response.data.msg)
        }
    });
}