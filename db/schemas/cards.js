var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

module.exports = new Schema({
	tuc: {
		type: String,
		require: true,
		unique: true
	},
	record: [{
		type: Schema.Types.ObjectId,
		ref: 'Record'
	}]
});