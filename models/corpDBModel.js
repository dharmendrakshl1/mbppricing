var pg = require('pg');
var configDbURL = require('../config/database.js');
var client = pg.Client(configDbURL.url);

client.connect();

module.corpDB = {
	
}