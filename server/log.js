var bunyan = require('bunyan');
var config = require('./config');

var log = bunyan.createLogger({
	name: 'blueshyft-toll-ftp',
});

log.level(config.loglevel);
log.info('Active config: ', config);

module.exports = log;
