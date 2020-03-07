var mongoose = require('mongoose');

// 定义Schema
MomentSchema = new mongoose.Schema({
	publishTime: {
		type: Number,
		required: true
	},
	text: {
		type: String,
		required: false
	},
	gender:     //性别1是男 0是女
	{
		type: Number,
		required: false
	},
	imgs: {
		type: Array,
		required: false
	},
	code: {
		type: String,
		required: true
	},
	user_name: {
		type: String,
		required: true
	},
	user_avatar: {
		type: String,
		required: false
	},
	zan: {
		type: Array,
		required: false
	}
});

// 定义Model
var MomentModel = mongoose.model('Moment', MomentSchema);

// 暴露接口
module.exports = MomentModel;