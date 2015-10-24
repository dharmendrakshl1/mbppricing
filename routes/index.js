var express = require('express');
var router = express.Router();
var corpDBController = require('../controllers/corpDBController.js');

//testing route
router.get('/v1/getMessage', function(req, res) {
	res.send("Hello");
});

//routes for getting data from postgress
//router.get('/marketArea/group/:groupId',corpDBController.getMarketArea);
//router.get('/facilities/marketArea/:marketAreaId',corpDBController.getFacilities);
//router.get('/businessUnit/marketArea/:marketAreaId/facilities/:facilityId',corpDBController.getBusinessUnit);
//router.get('/lob/marketArea/:marketAreaId/facilities/:facilityId/businessUnit/:businessunitId',corpDBController.getLOB);

router.get('/group/:groupId/marketArea',corpDBController.getMarketArea);
router.get('/marketArea/:marketAreaId/facilities',corpDBController.getFacilities);
router.get('/marketArea/:marketAreaId/facilities/:facilityId/businessUnit',corpDBController.getBusinessUnit);
router.get('/marketArea/:marketAreaId/facilities/:facilityId/businessUnit/:businessunitId/lobMaterialStream',corpDBController.getLOB);
router.get('/businessUnit/:businessunitId/lobMaterialStream/:lobMaterialStreamId/quarter',corpDBController.getQuarter);
router.get('/businessUnit/:businessunitId/lobMaterialStream/:lobMaterialStreamId/goBuQuarterInsert',corpDBController.goBuQuarterInsert);

router.get('/businessUnit/:businessunitId/lobMaterialStream/:lobMaterialStreamId/quarter1',corpDBController.getQuarter1);


module.exports = router;
