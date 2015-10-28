var corpDBService = require('../libs/corpDBService.js');

exports.getMarketArea = function(req, res){
	console.log("Entered CorpDBController->getMarketArea");

	var groupId = req.params.groupId;
	var queryString = req.query;

	console.log("CorpDBController printing queryString---> "+queryString);
	console.log("CorpDBController printing groupId--> "+groupId+ " selectQuery is called");

	corpDBService.getMarketArea(groupId, function(marketArea){
		res.send(marketArea);
	});
	
}

exports.getFacilities = function(req, res){
	console.log("Entered CorpDBController->getFacilities");
	
	var marketId = req.params.marketAreaId;
	console.log("printing market id--> "+marketId);

	corpDBService.getFacilities(marketId, function(facilities){
		res.send(facilities);
	});
}

exports.getBusinessUnit = function(req, res){
	console.log("Entered CorpDBController->getBusinessUnit");
	var facId = req.params.facilityId;
	var marketId = req.params.marketAreaId;
	
	console.log("printing facId--> "+facId);
	console.log("printing marketId----> "+marketId);

	corpDBService.getBusinessUnit(facId, marketId, function(businessUnit){
		res.send(businessUnit);
	});
}

exports.getLOB = function(req,res){
	console.log("Entered CorpDBController->getLOB");
 	var facId = req.params.facilityId;
	var marketId = req.params.marketAreaId;
	var businessunitId = req.params.businessunitId;

	console.log("pritning---> "+facId+"=--> "+marketId+"---> "+businessunitId);

	corpDBService.getLOB(marketId, facId, businessunitId, function(lobs){
		res.send(lobs);
	});
}

exports.getQuarterRange = function(req,res){
	console.log("Entered CorpDBController->getQuarter");
	var businessunitId = req.params.businessunitId;
	var lobMaterialStreamId = req.params.lobMaterialStreamId;
	console.log("Printing------>"+businessunitId+"------->"+lobMaterialStreamId);

	corpDBService.getQuarterRange(businessunitId, lobMaterialStreamId, function(quarterRange){
		res.send(quarterRange);
	});
}