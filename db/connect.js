var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost:27017/api');
db.connection.on('error', error => {
 console.log('fail', error);
});

db.connection.on('open', () => {
 console.log('mongodb has been connected successfully!');
});