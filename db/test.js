require('./connect');

var Moment = require('./moment');

Moment.findByIdAndUpdate('5962c5818a6e12da404f6167', {zan: [1, 2, 3, 4]}, (err, doc) => {
	console.log(doc);
})