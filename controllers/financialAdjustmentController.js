var financialService = require('../libs/financialAdjustmentService.js');

//below is the callback functions is for handling the error/exception
var errorDBCallBack = function(err, result){
	throw new Error('Error in connection with DB');
}

exports.getFinancialValues =  function(req, res){
	console.log("Entered FinancialAdjustmentController->getFinancialValues");

	var businessUnitId = req.params.businessUnitId;
	var lobMaterialStreamId = req.params.lobMaterialStreamId;
	console.log("Printing------> BU ID = "+businessUnitId+"-------> LOB ID = "+lobMaterialStreamId);

	financialService.getFinancialValues(businessUnitId, lobMaterialStreamId, function(financialValues){
		//console.log("Returned value = "+financialValues);
		res.send(financialValues);
	});
}

exports.saveFinancialValues = function(req, res){
	console.log("Entered FinancialAdjustmentController->saveFinancialValues");

	var businessUnitId = req.params.businessUnitId;
	var lobMaterialStreamId = req.params.lobMaterialStreamId;
	console.log("Printing------> BU ID = "+businessUnitId+"-------> LOB ID = "+lobMaterialStreamId);

	var financialJSONData = req.body;
	console.log("JSON Data = "+financialJSONData);
	//res.send(jsonData);
	financialService.saveFinancialValues(businessUnitId, lobMaterialStreamId, financialJSONData, function(saveFinancialValues){
		res.send("updated Successfully");
	});
}