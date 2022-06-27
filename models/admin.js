const mongoose = require('mongoose');

const Admin = mongoose.model('admins', new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    }
}))

module.exports = { Admin};