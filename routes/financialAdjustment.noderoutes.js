var financialController = require('../controllers/financialAdjustmentController.js');

module.exports = function(app){
	//testing route
	app.get('/api', function(req, res) {
		res.send("Hello123 From Adjacement Node Routes");
	});
	
	app.get('/api/financialAdjustmentService/businessUnit/:businessUnitId/lobMaterialStream/:lobMaterialStreamId',financialController.getFinancialValues);
	app.put('/api/financialAdjustmentService/save/businessUnit/:businessUnitId/lobMaterialStream/:lobMaterialStreamId',financialController.saveFinancialValues);
	//app.put('/api/financialAdjustmentService/save',financialController.saveFinancialValues);
}
