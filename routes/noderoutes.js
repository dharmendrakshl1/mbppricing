var corpDBController = require('../controllers/corpDBController.js');

module.exports = function(app){
	//testing route
	app.get('/api', function(req, res) {
		res.send("Hello123");
	});

	//routes for getting data from postgress
	/*app.get('/marketArea/group/:groupId',corpDBController.getMarketArea);
	app.get('/facilities/marketArea/:marketAreaId',corpDBController.getFacilities);
	app.get('/businessUnit/marketArea/:marketAreaId/facilities/:facilityId',corpDBController.getBusinessUnit);
	app.get('/lob/marketArea/:marketAreaId/facilities/:facilityId/businessUnit/:businessunitId',corpDBController.getLOB);*/

	app.get('/api/corpDB/group/:groupId/marketArea',corpDBController.getMarketArea);
	app.get('/api/corpDB/marketArea/:marketAreaId/facilities',corpDBController.getFacilities);
	app.get('/api/corpDB/marketArea/:marketAreaId/facilities/:facilityId/businessUnit',corpDBController.getBusinessUnit);
	app.get('/api/corpDB/marketArea/:marketAreaId/facilities/:facilityId/businessUnit/:businessunitId/lobMaterialStream',corpDBController.getLOB);
	app.get('/api/corpDB/businessUnit/:businessunitId/lobMaterialStream/:lobMaterialStreamId/quarter',corpDBController.getQuarterRange);
	
	//app.get('/api/corpDB/businessUnit/:businessunitId/lobMaterialStream/:lobMaterialStreamId/goBuQuarterInsert',corpDBController.goBuQuarterInsert);
}
