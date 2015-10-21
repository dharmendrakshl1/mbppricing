var express = require('express');
var router = express.Router();
var restController = require('../controller/restController.js');

//testing route
router.get('/v1/getMessage', function(req, res) {
	res.send("Hello");
});

//routes for getting data from postgress
//router.get('/marketArea/group/:groupId',restController.getMarketArea);
//router.get('/facilities/marketArea/:marketAreaId',restController.getFacilities);
//router.get('/businessUnit/marketArea/:marketAreaId/facilities/:facilityId',restController.getBusinessUnit);
//router.get('/lob/marketArea/:marketAreaId/facilities/:facilityId/businessUnit/:businessunitId',restController.getLOB);

router.get('/group/:groupId/marketArea',restController.getMarketArea);
router.get('/marketArea/:marketAreaId/facilities',restController.getFacilities);
router.get('/marketArea/:marketAreaId/facilities/:facilityId/businessUnit',restController.getBusinessUnit);
router.get('/marketArea/:marketAreaId/facilities/:facilityId/businessUnit/:businessunitId/lobMaterialStream',restController.getLOB);
router.get('/businessUnit/:businessunitId/lobMaterialStream/:lobMaterialStreamId/quarter',restController.getQuarter);
router.get('/businessUnit/:businessunitId/lobMaterialStream/:lobMaterialStreamId/goBuQuarterInsert',restController.goBuQuarterInsert);

router.get('/businessUnit/:businessunitId/lobMaterialStream/:lobMaterialStreamId/quarter1',restController.getQuarter1);


module.exports = router;
