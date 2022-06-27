const mongoose = require('mongoose');

const WeeklyRec = mongoose.model('weeklyrecs', new mongoose.Schema({
    bookname: {
        type: String
    },
    pic: {
        type: String
    },
    description: {
        type: String
    },
    isweekly: {
        type: Boolean
    }
}))

module.exports = { WeeklyRec };