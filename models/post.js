const mongoose = require('mongoose');

// const { User } = require("./user");
// const { Book } = require("./book");

const Post = mongoose.model('posts', new mongoose.Schema({
    poster: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    book: {
        type: mongoose.Schema.Types.ObjectId, ref: 'books'
    },
    title: {
        type: String
    },
    img: {
        type: String
    },
    content: {
        type: String
    },
    comments: {
        type: Array
        // array of comments obj
    },
    active:{
        type: Boolean
    }
}))

module.exports = { Post };