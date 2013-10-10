var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

module.exports = new Schema({
	date: {
		type: Date,
		default: Date.now
	},
	balance: Number,
	spending: Number
});