const mongoose = require('mongoose');

const Requests = mongoose.model('requests', new mongoose.Schema({
    receiver: {
        type: mongoose.Schema.Types.ObjectId, ref: "users"
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId, ref: "users"
    },
    post: {
        type: mongoose.Schema.Types.ObjectId, ref: "posts"
    },
    bookForExchange:{
        type: mongoose.Schema.Types.ObjectId, ref: "books"
    }
}))

module.exports = { Requests };