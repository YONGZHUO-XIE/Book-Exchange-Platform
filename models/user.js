const mongoose = require('mongoose')

const User = mongoose.model('users', new mongoose.Schema({
	username: {
		type: String
	},
	password: {
		type: String
	},
	icon: {
		type: String
	},
	email: {
		type: String
	},
	phonenum: {
		type: String
	},
	post: {
		type: Array
	},
	request: {
		type: Array
	},
	block: {
		type: Boolean
	},
	favortype: {
		type: Array
	},
	books: {
		type: Array
	}
}))

module.exports = { User };