var restController = require('./restController.js');

module.exports = function(app){
	//testing route
	app.get('/api', function(req, res) {
		res.send("Hello123");
	});

	//routes for getting data from postgress
	/*app.get('/marketArea/group/:groupId',restController.getMarketArea);
	app.get('/facilities/marketArea/:marketAreaId',restController.getFacilities);
	app.get('/businessUnit/marketArea/:marketAreaId/facilities/:facilityId',restController.getBusinessUnit);
	app.get('/lob/marketArea/:marketAreaId/facilities/:facilityId/businessUnit/:businessunitId',restController.getLOB);*/

	app.get('/api/group/:groupId/marketArea',restController.getMarketArea);
	app.get('/api/marketArea/:marketAreaId/facilities',restController.getFacilities);
	app.get('/api/marketArea/:marketAreaId/facilities/:facilityId/businessUnit',restController.getBusinessUnit);
	app.get('/api/marketArea/:marketAreaId/facilities/:facilityId/businessUnit/:businessunitId/lobMaterialStream',restController.getLOB);
	app.get('/api/businessUnit/:businessunitId/lobMaterialStream/:lobMaterialStreamId/quarter',restController.getQuarter);
	app.get('/api/businessUnit/:businessunitId/lobMaterialStream/:lobMaterialStreamId/goBuQuarterInsert',restController.goBuQuarterInsert);
}
