const mongoose = require('mongoose');

const Report = mongoose.model('reports', new mongoose.Schema({
    reporter: {
        type: mongoose.Schema.Types.ObjectId, ref: "users"
    },
    post: {
        type: mongoose.Schema.Types.ObjectId, ref: "posts"
    },
    content:{
        type: String
    }
}))

module.exports = { Report };