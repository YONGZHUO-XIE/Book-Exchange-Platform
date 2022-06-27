const mongoose = require('mongoose');

const Book = mongoose.model('books', new mongoose.Schema({
    bookname: {
        type: String
    },
    author: {
        type: String
    },
    pic: {
        type: String
    },
    tags: {
        type: Array
    }
}))

module.exports = { Book };