require('../../db/connect');
var Moment = require('../../db/moment');

var fs = require('fs');
var express = require('express');
var router = express.Router();

var { initNames, initHeadImgs } = require('./init');

var webRoot = 'http://localhost:8000/';

router.use('*', (req, res, next) => {
	var cookie = req.headers.cookie;
	var code;
	if (/wechat-moments-session-id=[a-z0-9]{16}/.test(cookie)) {
		code = /wechat-moments-session-id=([a-z0-9]{16})/.exec(cookie)[1];
		req.code = code;
	} else {
		code = Math.random().toString(36).substr(2, 8) + Math.random().toString(36).substr(2, 8);
		res.setHeader('set-cookie', 'wechat-moments-session-id=' + code);
		req.code = code;
	}
	console.log(req.code);
	next();
});

router.get('/get', (req, res) => {
	Moment.find({}, null, {sort: {'_id': -1}}, (err, docs) => {
		let contents = docs;
		Moment.findOne({code: req.code}, null, {sort: {'_id': -1}}, (err, docs) => {
			let name, headImg;
			if (docs && docs.name) {
				name = docs.name;
				if (docs.headImg) {
					headImg = docs.headImg;
				} else {
					headImg = initHeadImgs[Math.floor(Math.random() * initHeadImgs.length)];
					let moment = new Moment({
						publishTime: Date.now(),
						code: req.code,
						name: name,
						headImg: headImg
					});
					moment.save((err, doc) => {
						if (err) {
							console.log('error', err);
						} else {
							console.log('success', doc);
						}
					});
				}
			} else {
				name = initNames[Math.floor(Math.random() * initNames.length)];
				headImg = initHeadImgs[Math.floor(Math.random() * initHeadImgs.length)];
				let moment = new Moment({
					publishTime: Date.now(),
					code: req.code,
					name: name,
					headImg: headImg
				});
				moment.save((err, doc) => {
					if (err) {
						console.log('error', err);
					} else {
						console.log('success', doc);
					}
				});
			}

			let responseJson = {
				name: name,
				headImg: headImg,
				contents: contents,
				code: req.code
			};
			res.send(JSON.stringify(responseJson));
		});		
	});
});
// let name, headImg;
		// if (docs && docs.name) {
		// 	name = docs.name;
		// 	if (docs.headImg) {
		// 		headImg = docs.headImg;
		// 	} else {
		// 		headImg = initHeadImgs[Math.floor(Math.random() * initHeadImgs.length)];
		// 	}			
		// } else {
		// 	name = initNames[Math.floor(Math.random() * initNames.length)];
		// 	headImg = initHeadImgs[Math.floor(Math.random() * initHeadImgs.length)];
		// }
// router.post('/text', (req, res) => {
// 	Moment.findOne(
// 		{code: req.code}, 
// 		null, 
// 		{sort: {'_id': -1}}, 
// 		(err, docs) => {
		
// 			let moment = new Moment({
// 				publishTime: Date.now(),
// 				text: req.body.text,
// 				imgs: req.body.imgs,
// 				code: req.body.code,
// 				user_name: req.body.user_name,
// 				user_avatar: req.body.user_avatar,
// 				gender: req.body.gender
// 			});
// 			moment.save(
// 				(err, doc) => {
// 					if (err) {
// 						console.log('error', err);
// 					} else {
// 						console.log('success', doc);
// 						res.send(doc.text);
// 					}
// 			});		
// 	});
// });
router.post('/text', (req, res) => {		
	let moment = new Moment({
		publishTime: Date.now(),
		text: req.body.text,
		imgs: req.body.imgs,
		code: req.body.code,
		user_name: req.body.user_name,
		user_avatar: req.body.user_avatar,
		gender: req.body.gender
	});
	moment.save(
		(err, doc) => {
			if (err) {
				console.log('error', err);
			} else {
				console.log('success', doc);
				res.send(doc.text);
			}
	});		
});

router.post('/post-img', (req, res) => {
	var body = [];
	req.on('data', (chunk) => body.push(chunk));
	req.on('end', () => {
		body = Buffer.concat(body).toString();
		body = body.replace(/^data:image\/\w+;base64,/, '');
		let randomFilename = Date.now() + Math.random().toString(36).substr(2, 8) + '.png';
		let bodyBuffer = new Buffer(body, 'base64');
		fs.writeFile(
			`./public/upload-img/${randomFilename}`, 
			bodyBuffer, 
			(e) => {
				if (e) {
					res.status(500).send('Something broke!');
				} else {
					res.send(`${webRoot}upload-img/${randomFilename}`);
				}
		});
	});
});

router.post('/zan', (req, res) => {
	// console.log(req.body);
	Moment.findOne({_id: req.body._id}, (err, doc) => {
		if (err) throw err;
		let zan = doc.zan;
		if (req.body.opera === 'insert') {
			zan.push({
				code: req.body.code,
				name: req.body.sessionName
			});
		} else {
			zan = zan.filter((item) => {
				return item.code !== req.body.code;
			});
		}
		Moment.findByIdAndUpdate(req.body._id, {zan: zan}, (err, doc) => {
			res.send('zan ok');
		})
	});	
});

module.exports = router;
