var fs = require('fs');
var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var cloudinary = require('cloudinary');

var log = require('./log');
var config = require('./config');

cloudinary.config({
  cloud_name: config.cloudinary_cloud,
  api_key: config.cloudinary_key,
  api_secret: config.cloudinary_secret,
});

var upload = multer({ dest: 'uploads/' })

/* istanbul ignore if */
if (require.main === module) {
	var app = express();

	//app.use(bodyParser.json());

	app.post('/upload', upload.single('file'), function(req, res) {
		console.log(".................",req.file)
		cloudinary.uploader.upload(req.file.path, function(result) {
			console.log(result)
			fs.unlink(req.file.path,(err)=>{
				res.status(200).json({success: true});
			})
		});
	})

	app.listen(3000, function () {
		console.log('Listening on port 3000!');
	});
}
