const mongoose = require('mongoose');

const Image = mongoose.model('images.files', new mongoose.Schema({
    length : {
        type : Number
    },
    chunkSize : {
        type : Number
    },
    uploadDate : {
        type : Date
    },
    filename : {
        type : String
    },
    contentType :{
        type: String
    }
}))

module.exports = { Image };