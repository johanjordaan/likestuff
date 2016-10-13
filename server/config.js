require('dotenv').config({ silent: true });
var env = process.env.NODE_ENV || 'dev';

// TODO : Refactor this file to have overrides rathern then pure copies DRY

var prodConfig = {
	logLevel: process.env.LOG_LEVEL,
	cloudinary_cloud: process.env.CLOUDINARY_CLOUD,
	cloudinary_key: process.env.CLOUDINARY_KEY,
	cloudinary_secret: process.env.CLOUDINARY_SECRET,
};

var testConfig = {
	logLevel: 'info',
	cloudinary_cloud: process.env.CLOUDINARY_CLOUD,
	cloudinary_key: process.env.CLOUDINARY_KEY,
	cloudinary_secret: process.env.CLOUDINARY_SECRET,
};

var devConfig = {
	logLevel: process.env.LOG_LEVEL,
	cloudinary_cloud: process.env.CLOUDINARY_CLOUD,
	cloudinary_key: process.env.CLOUDINARY_KEY,
	cloudinary_secret: process.env.CLOUDINARY_SECRET,
};

var config = devConfig;
/* istanbul ignore else */
if (env === 'test') {
	config = testConfig;
} else if (env === 'prod') {
	config = prodConfig;
}

module.exports = config;
