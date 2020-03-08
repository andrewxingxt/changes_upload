require('../../db/connect');
var Moment = require('../../db/moment');

var axios = require('axios')
var fs = require('fs');
var express = require('express');
var router = express.Router();

var { initNames, initHeadImgs } = require('./init');

var webRoot = 'http://39.105.91.188:8000/';

router.post('/get', (req, res) => {
	Moment.find(
		{}, 
		null, 
		{
			sort: {'_id': -1}
			// skip : req.body.skip_num,
			// limit : 10
			
		}, 
		(err, docs) => {
			let content = [];
		docs.forEach(element => {
			let Json = {
				_id : element._id,
				publishTime : element.publishTime,
				text: element.text,
				openid: element.code,
				name: element.user_name,
				headImg: element.user_avatar,
				__v: element.__v,
				zan: element.zan,
				imgUrls: element.imgs,
			};
			content.push(Json);
		});
		let Json = {
			contents:content
		}
		res.send(JSON.stringify(Json));
	});
});
router.post('/text', (req, res) => {
	let textRec = req.body.text;
	let imgs =req.body.imgs;
	let user_name =req.body.user_name;
	let user_avatar = req.body.user_avatar;
	let gender = req.body.gender;
	let openid = req.body.openid;
	let js_code = req.body.code;
	let appid = "wxf0be5003a725ab4c";
	let secert = "84513565cd99b3895c3dd2c9b31d32f1";
	let grant_type = "authorization_code";

	
	if(textRec.trim()==""){
		res.json({status:0,msg:"发布失败"});
		return;
	}
	if(openid == null||openid == ""  )
	{
		axios.get(
			"https://api.weixin.qq.com/sns/jscode2session?appid="+appid
			+"&secret="+secert
			+"&js_code="+js_code
			+"&grant_type="+grant_type
		).then(function (response) {
			openid 
			 = response.data.errmsg;

			 let moment = new Moment({
				publishTime: Date.now(),
				text: textRec,
				imgs: imgs,
				code: openid,
				user_name: user_name,
				user_avatar: user_avatar, 
				gender: gender
			});
			moment.save(
				(err, doc) => {
					if (err) {
						console.log('error', err);
					} else { 
						res.json({status:1,msg:"发布成功",openid:openid});
					}
			});	
		})
		.catch(function (error) {
			console.log(error)
		})
	}else{
		let moment = new Moment({
			publishTime: Date.now(),
			text: textRec,
			imgs: imgs,
			code: openid,
			user_name: user_name,
			user_avatar: user_avatar,
			gender: gender
		});
		moment.save(
			(err, doc) => {
				if (err) {
					console.log('error', err);
				} else { 
					res.json({status:1,msg:"发布成功",openid:openid});
				}
		});	
	}
});
	
router.post('/post-img', (req, res) => {
	var body = [];
	req.on('data', (chunk) => body.push(chunk));
	req.on('end', () => {
		body = Buffer.concat(body).toString();
		console.log(body+"接收图片内容");
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
