const log = console.log
const path = require('path')
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');

// starting the express server
const app = express();

const { Admin } = require("./models/admin");
const { User } = require("./models/user");
const { Book } = require("./models/book");
const { Post } = require("./models/post");
const { Requests } = require("./models/request");
const { Report } = require("./models/report");
const { WeeklyRec } = require("./models/weekly");
const { Image } = require("./models/image");

// Setting up a static directory for the files in /pub
// using Express middleware.
app.use(express.static(path.join(__dirname, '/client')))

// get html file
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/client/clienthtml/index.html'));
})
app.get('/adminlanding.html', (req, res) => {
	res.sendFile(path.join(__dirname, '/client/clienthtml/adminlanding.html'));
})
app.get('/userlanding.html' , (req, res) => {
	res.sendFile(path.join(__dirname, '/client/clienthtml/userlanding.html'));
})


//setup connection
const uri = 'mongodb+srv://zzq20010617:Zhuziqi0617@cluster0.l4ux3.mongodb.net/CSC309?retryWrites=true&w=majority'

try{
    mongoose.connect(uri, {useNewUrlParser:true, useUnifiedTopology:true}).then(console.log('connected to db'))
} catch (e){console.log("not connected")}

const conn = mongoose.connection;
// Init gfs
let gfs;
conn.once('open', () => {
    // Init stream
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "images"
    })
})

// db error handler
function isMongoError(error) {
    // checks for first error returned by promise rejection
    // if Mongo database suddenly disconnects
    return typeof error === 'object' &&
        error !== null && error.name === "MongoNetworkError"
}

// Create storage engine
const storage = new GridFsStorage({
    url: uri,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            // Create image with its own name when administrators want to maintain data in the server
            const fileInfo = {
                filename: file.originalname,
                bucketName: 'images' // should match with gfs.collection name above
            }
            resolve(fileInfo)
        });
    }
});
const upload = multer({ storage });

// body-parser: middleware for parsing HTTP JSON body into a usable object
app.use(bodyParser.json()) // parsing JSON body
app.use(bodyParser.urlencoded({ extended: true })); // parsing URL-encoded form data (from form POST requests)

app.use(cors());
app.use(express.json());


app.get('/api/admin', (req, res) => {
    try {
        Admin.find().then((result) => {
            res.json(result)
        }).catch((error) => {
            res.status(500).send(error)
        })
    } catch(error) {
        log(error)
        res.status(500).send("Internal Server Error")
    }
})

// api for adding a administrator
app.post('/api/admin', async(req,res) => {
    const newAdmin = new Admin({
        username: req.body.username,
        password: req.body.password,
    })
    try {
        const result = await newAdmin.save()
        res.send(result)
    } catch(error) {
        log(error) // log server error to the console, not to the client.
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
    }
})

// api for deleting an administrator
// {
// 	"username": <admin username>
// }
app.delete('/api/admin', (req, res) => {
    try {
        // console.log(req.body.title)
        Admin.findOneAndDelete({username:req.body.username},  (error, doc) => {
            if (error) {
                console.log("Something wrong when deleting admin!");
            }
            // console.log(doc);
            res.status(200).send("admin deleted successfully!");
        })
    } catch(error) {
        log(error) // log server error to the console, not to the client.
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
    }
})

// api relates to weekly recommend book
app.get('/api/weekly', (req, res) => {
    try {
        WeeklyRec.find().then((result) => {
            res.json(result)
        }).catch((error) => {
            res.status(500).send(error)
        })
    } catch(error) {
        log(error)
        res.status(500).send("Internal Server Error")
    }
})

// add a recommendation book
// {
// 	"bookname": <name of the book>
// 	"pic": <name of the picture>
// 	"description": <description of the book>
// }
app.post('/api/weekly', async(req,res) => {
    const newWeekly = new WeeklyRec({
        bookname: req.body.bookname,
        pic: req.body.pic,
        description: req.body.description,
        isweekly: true
    })
    try {
        const result = await newWeekly.save()
        res.send(result)
    } catch(error) {
        log(error) // log server error to the console, not to the client.
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
    }
})

// modify status of a weekly book
// {
// 	"is weekly": <boolean to set weekly book>
// }
app.patch('/api/weekly/:bookname', (req, res) => {
    try {
        WeeklyRec.findOne({bookname:req.params.bookname}).then((book) => {
            book.isweekly = req.body.status
            book.save().then((patched_book) => {
                res.send(patched_book)
            }).catch((error) => {
                res.status(500).send(error)
            })
        })
    } catch(error) {
        log(error) // log server error to the console, not to the client.
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
    }
})

// api to upload a file
app.post('/api/image/upload', upload.single('file'), (req, res) => {
    if (req.file === undefined) {
        return res.status(400).json({ msg: 'No file uploaded!' });
    }
    res.json({ fileName: req.file.filename, filePath: `/images/${req.file.filename}`,  });
});

// Read file and display image through /image/:filename
app.get('/api/image/:filename', async (req, res) => {
    try {
        const result =  await Image.find({filename: req.params.filename});
        if (result.length === 0) {
            return res.status(404).send("File does not exist!");
        }
        const readStream = gfs.openDownloadStreamByName(req.params.filename);
        readStream.pipe(res);
    } catch(error) {
        log(error) // log server error to the console, not to the client.
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
    }
});



// {
//     "_id": "623f352aed8568be0c1aead5",
//     "username": "user1",
//     "password": "user1",
//     "icon": "",
//     "email": "",
//     "phonenum": "",
//     "post": [],
//     "request": [],
//     "block": false,
//     "favortype": [],
//     "books": [],
//     "__v": 0
// }

// get all users
app.get('/api/user', (req, res) => {
    try {
        User.find().then((result) => {
            res.status(200).json(result)
        }).catch((error) => {
            res.status(500).send(error)
        })
    } catch(error) {
        log(error)
        res.status(500).send("Internal Server Error")
    }
})

// get single user by id
app.get('/api/user/:id', (req, res) => {
    try {
        User.findOne({_id:req.params.id}).then((user) => {
            res.send(user)
        })
    } catch(error) {
        log(error)
        res.status(500).send("Internal Server Error")
    }
})

// get single user by username
app.get('/api/userbyusername/:username', (req, res) => {
    try {
        User.findOne({username:req.params.username}).then((user) => {
            res.send(user)
        })
    } catch(error) {
        log(error)
        res.status(500).send("Internal Server Error")
    }
})

// create a new user
// {
// 	"username": <new username>
// 	"password": <new password>
// }
app.post('/api/user', async(req,res) => {
    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        icon: "anonicon.png",
        email: "",
        phonenum: "",
        post:[],
        request:[],
        block:false,
        favortype:[],
        books:[]
    })
    try {
        const result = await newUser.save()
        res.send(result)
    } catch(error) {
        log(error) // log server error to the console, not to the client.
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
    }
})

// delete a user by username
// {
// 	"username": <username>
// }
app.delete('/api/user', (req, res) => {
    try {
        // console.log(req.body.title)
        User.findOneAndDelete({username:req.body.username},  (error, doc) => {
            if (error) {
                console.log("Something wrong when deleting user!");
            }
            // console.log(doc);
            res.status(200).send("user deleted successfully!");
        })
    } catch(error) {
        log(error) // log server error to the console, not to the client.
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
    }
})

// add a post to users's post list
// {
// 	"postId": <id of the post to add>
// }
app.post('/api/useraddpost/:id', (req, res) => {
    try {
        User.findOne({_id:req.params.id}).then((user) => {
            user.post += req.body.postId
            user.save().then((result) => {
                res.send(result)
            }).catch((error) => {
                res.status(500).send(error)
            })
        })
    } catch(error) {
        log(error) // log server error to the console, not to the client.
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
    }
})



// add a book to users's book list
// {
// 	"bookId": <id of the book to add>
// }
app.post('/api/useraddbook/:id', (req, res) => {
    try {
        User.findOne({_id:req.params.id}).then((user) => {
            user.books.push(req.body.bookId)
            user.save().then((result) => {
                res.send(result)
            }).catch((error) => {
                res.status(500).send(error)
            })
        })
    } catch(error) {
        log(error) // log server error to the console, not to the client.
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
    }
})

// delete book by userid
app.post('/api/userremovebook/:id', (req, res) => {
    try {
        User.findOne({_id:req.params.id}).then((user) => {
            user.books = user.books.filter(book => book !== req.body.bookId)
            user.save().then((result) => {
                res.send(result)
            }).catch((error) => {
                res.status(500).send(error)
            })
        })
    } catch(error) {
        log(error) // log server error to the console, not to the client.
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
    }
})


//modify information of a user(call by user)
// {
// 	"icon": <icon img>
// 	"email": <users's email>
//  "phonenum": <users's phonenum>
//  "favortype": <users's type of favor>
// }
app.patch('/api/user/:id', (req, res) => {
    try {
        User.findOne({_id:req.params.id}).then((user) => {
            user.icon = req.body.icon
            user.email = req.body.email
            user.phonenum = req.body.phonenum
            user.favortype = req.body.favortype
            user.save().then((patched_user) => {
                res.send(patched_user)
            }).catch((error) => {
                res.status(500).send(error)
            })
        })
    } catch(error) {
        log(error) // log server error to the console, not to the client.
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
    }
})

// modify user's stats
// {
// 	"block": <boolean to decide whether a user is been banned>
// }
app.patch('/api/userstat/:id', (req, res) => {
    try {
        User.findOne({_id:req.params.id}).then((user) => {
            user.block = req.body.block
            user.save().then((patched_user) => {
                res.send(patched_user)
            }).catch((error) => {
                res.status(500).send(error)
            })
        })
    } catch(error) {
        log(error) // log server error to the console, not to the client.
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
    }
})


// api for get all posts
app.get('/api/post', (req, res) => {
    try {
        Post.find().then((result) => {
            res.json(result)
        }).catch((error) => {
            res.status(500).send(error)
        })
    } catch(error) {
        log(error)
        res.status(500).send("Internal Server Error")
    }
})

// get single post with post id
app.get('/api/post/:id', (req, res) => {
    try {
        Post.findOne({_id:req.params.id}).then((post) => {
            res.send(post)
        })
    } catch(error) {
        log(error)
        res.status(500).send("Internal Server Error")
    }
})

// reqbody for post
// {
// 	"title": <title of post>
// 	"poster": <poster's id>
// 	"book": <book id>
// 	"content": <content of post>
// 	"img": <post img>
// }
app.post('/api/post', async(req,res) => {
    const newPost = new Post({
        title: req.body.title,
        poster: req.body.poster,
        book: req.body.book,
        content: req.body.content,
        img: req.body.img,
        comments: []
    })
    try {
        const result = await newPost.save()
        res.send(result)
    } catch(error) {
        log(error) // log server error to the console, not to the client.
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
    }
})

// delete a post by id
// {
// 	"id": <id of the post to be delete>
// }
app.delete('/api/post', (req, res) => {
    try {
        Post.findOneAndDelete({_id:req.body.id},  (error, doc) => {
            if (error) {
                console.log("Something wrong when deleting post!");
            }
            // console.log(doc);
            res.status(200).send("post deleted successfully!");
        })
    } catch(error) {
        log(error) // log server error to the console, not to the client.
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
    }
})

//modify information of a post(call by user)
// {
// 	active : false;
// }
app.patch('/api/updatepost/:id', (req, res) => {
    try {
        Post.findOne({_id:req.params.id}).then((post) => {
            post.comments.push(req.body.newcomment);
            post.save().then((patched_post) => {
                res.send(patched_post)
                // res.status(200).send("post updated successfully!");
            }).catch((error) => {
                res.status(500).send(error)
            })
        })
    } catch(error) {
        log(error) // log server error to the console, not to the client.
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
    }
})

// {
//     "bookname": "Harry Potter",
//     "author": "J.K. Rowling",
//     "pic": "",
//     "tags": [
//         "Adventrue",
//         "Fantasy",
//         "Narrative"
//     ],
//     "_id": "623f9cbdc61748caedf30d04",
//     "__v": 0
// }

// api for getting all books
app.get('/api/book', (req, res) => {
    try {
        Book.find().then((result) => {
            res.json(result)
        }).catch((error) => {
            res.status(500).send(error)
        })
    } catch(error) {
        log(error)
        res.status(500).send("Internal Server Error")
    }
})

// api to get a single book by its id
app.get('/api/book/:id', (req, res) => {
    try {
        Book.findOne({_id:req.params.id}).then((book) => {
            res.send(book)
        })
    } catch(error) {
        log(error)
        res.status(500).send("Internal Server Error")
    }
})

// {
// 	"bookname": <name of the book>
// 	"author": <name of author>
// 	"picture": <book id>
// 	"discription": <discription of book>
// 	"picture": <picture of the book>
// }
app.post('/api/addbook', async(req,res) => {
    const newBook = new Book({
        bookname: req.body.bookname,
        author: req.body.author,
        tags: req.body.tags
    })
    try {
        const result = await newBook.save()
        res.send(result)
    } catch(error) {
        log(error) // log server error to the console, not to the client.
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
    }
})

// delete a book by its id
// {
// 	 id: <id of the book to be deleted>
// }
app.delete('/api/book', (req, res) => {
    try {
        Book.findOneAndDelete({_id:req.body.id},  (error, doc) => {
            if (error) {
                console.log("Something wrong when deleting admin!");
            }
            // console.log(doc);
            res.status(200).send("admin deleted successfully!");
        })
    } catch(error) {
        log(error) // log server error to the console, not to the client.
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
    }
})

// api for requests
app.get('/api/request', (req, res) => {
    try {
        Requests.find().then((result) => {
            res.status(200).json(result)
        }).catch((error) => {
            res.status(500).send(error)
        })
    } catch(error) {
        log(error)
        res.status(500).send("Internal Server Error")
    }
})

// api find requests related to a user id
app.get('/api/request/:id', (req, res) => {
    try {
        Requests.find({$or:[{sender:req.params.id},{reciever:req.params.id}]}).then((result) => {
            res.send(result)
        })
    } catch(error) {
        log(error)
        res.status(500).send("Internal Server Error")
    }
})

// reciever: {
//     type: mongoose.Schema.Types.ObjectId, ref: "users"
// },
// sender: {
//     type: mongoose.Schema.Types.ObjectId, ref: "users"
// },
// post: {
//     type: mongoose.Schema.Types.ObjectId, ref: "posts"
// },
// bookForExchange:{
//     type: mongoose.Schema.Types.ObjectId, ref: "books"
// }

// {
// 	"reciever": <user id who recieve the request>
// 	"sender": <user id who send the request>
// 	"post": <post id of this request>
// 	"book": <book id to exchange>
// }
app.post('/api/request', async(req,res) => {
    const newRequest = new Requests({
        receiver: req.body.receiver,
        sender: req.body.sender,
        post: req.body.post,
        bookForExchange: req.body.bookForExchange
    })
    try {
        const result = await newRequest.save()
        res.send(result)
    } catch(error) {
        log(error) // log server error to the console, not to the client.
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
    }
})

app.delete('/api/request', (req, res) => {
    try {
        Requests.findOneAndDelete({_id:req.body.id},  (error, doc) => {
            if (error) {
                console.log("Something wrong when deleting request!");
            }
            // console.log(doc);
            res.status(200).send("request deleted successfully!");
        })
    } catch(error) {
        log(error) // log server error to the console, not to the client.
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
    }
})

// api for reports
app.get('/api/report', (req, res) => {
    try {
        Report.find().then((result) => {
            res.status(200).json(result)
        }).catch((error) => {
            res.status(500).send(error)
        })
    } catch(error) {
        log(error)
        res.status(500).send("Internal Server Error")
    }
})

// get report by its id
app.get('/api/report/:id', (req, res) => {
    try {
        Report.find({_id:req.params.id}).then((result) => {
            res.send(result)
        })
    } catch(error) {
        log(error)
        res.status(500).send("Internal Server Error")
    }
})

app.post('/api/report', async(req,res) => {
    const newRequest = new Report({
        reporter: req.body.reporter,
        post: req.body.post,
        content: req.body.content
    })
    try {
        const result = await newRequest.save()
        res.send(result)
    } catch(error) {
        log(error) // log server error to the console, not to the client.
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
    }
})

app.delete('/api/reportbypost', (req, res) => {
    try {
        Report.deleteMany({post:req.body.postid},  (error, doc) => {
            if (error) {
                console.log("Something wrong when deleting reports");
            }
            // console.log(doc);
            res.status(200).send("post deleted successfully!");
        })
    } catch(error) {
        log(error) // log server error to the console, not to the client.
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
    }
})

app.delete('/api/report', (req, res) => {
    try {
        Report.findOneAndDelete({_id:req.body.id},  (error, doc) => {
            if (error) {
                console.log("Something wrong when deleting report");
            }
            // console.log(doc);
            res.status(200).send("report deleted successfully!");
        })
    } catch(error) {
        log(error) // log server error to the console, not to the client.
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
    }
})

const port = process.env.PORT || 5000
app.listen(port, () => {
    log(`Listening on port ${port}...`)
})