var orm = require('orm');

var confDB = require('../config/database.js');

function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle){
        	return true;
        }
    }
    return false;
}

/*exports.getFinancialValues = function(businessUnitID, lobMaterialStreamId, getFinancialValuesCallBack){
	console.log("Entering FinancialValueService->getFinancialValues");

	var financialsValues = {};
	var financialmasterid = [];

	orm.connect(confDB.url, function(err, db){
		if(err){
			console.log("Error in Connection "+err);
		}
		else{
			db.load('../models/financialsModel', function(err){
				if(err){
					console.log("Error in loading financials Model");
					throw err;
				}
				console.log("Model got loaded with lob ID = "+lobMaterialStreamId);
				var Financials = db.models.financials;
				Financials.find({lobms_master_id: 1}, function(err, financials){
					if(err){
						console.log("Error in reading Financial values "+err);
						throw err;
					}
					console.log("Financials = "+JSON.stringify(financials,null, "  "));
					getFinancialValuesCallBack(JSON.stringify(financials,null, "  "));
				});
			});
		}
	});
}*/

exports.getFinancialValues = function(businessUnitID, lobMaterialStreamId, getFinancialValuesCallBack){
	console.log("Entering FinancialValueService->getFinancialValues");

	var financialsValues = {};

	var db = orm.connect(confDB.url);
	db.on('connect', function(err, result){
		if(!err){
			console.log("Connected successfully");

			//below query is to define financialsValues JSON structure for financialmaster heading & 
			//sub-heading name for "financial setting adjustement page"
			db.driver.execQuery("select f.financialmasterid, fm.name as fmname, f.name as fname, "
				+"f.isadjustable, f.isactualeditable, pu.name as puname from financialmaster fm "
				+"join financials f on fm.id = f.financialmasterid left outer join perunitmaster pu "
				+"on f.per_unit = pu.id "
				+"where f.lobms_id=?",[lobMaterialStreamId], function(err, data){
				if(!err){
					console.log("Data Length "+data.length);
					for(var i=0; i<data.length; i++){
						var fmname = data[i].fmname;

						financialsValues[fmname] = {};
					}
					for(var i=0; i<data.length; i++){
						var fmname = data[i].fmname;
						var fname = data[i].fname;

						financialsValues[fmname][fname] = {};
					}
					for(var i=0; i<data.length; i++){
						var fmname = data[i].fmname;
						var fname = data[i].fname;
						var puname = data[i].puname;

						financialsValues[fmname][fname]["actual"] = "";
						financialsValues[fmname][fname]["adjusted"] = "";
						financialsValues[fmname][fname]["total_adjusted"] = "";
						financialsValues[fmname][fname]["updated_by"] = "";
						financialsValues[fmname][fname]["updated_date"] = "";
						if(!(puname == null)){
							//console.log("puname = "+puname);
							financialsValues[fmname][fname]["per_unit"] = "/"+puname;
						}
						else{
							financialsValues[fmname][fname]["per_unit"] = "";
						}
						financialsValues[fmname][fname]["isactualeditable"] = data[i].isactualeditable;
						financialsValues[fmname][fname]["isadjustable"] = data[i].isadjustable;
					}
					//console.log("Added in JSON values in financialsValues = "+JSON.stringify(financialsValues,null,"  "));
				}
				else{
					console.log("Error in reading FinancialsMaster values "+err);
				}
			});

			//below query is to get financial values(like adjustment, total adjustment)
			//for sub-heading and push to financialsValues JSON
			//for financial setting adjustement page
			db.driver.execQuery("select fm.name as fmname, f.financialmasterid, f.name as fname, "
				+"fv.bu_id, fv.quarter_id, fv.actual, fv.adjusted, fv.total_adjusted, fv.updated_by, "
				+"fv.updated_date from financialmaster fm join financials f on fm.id = f.financialmasterid "
				+"join financialvalues fv on fv.financial_id = f.id where f.lobms_id = ? and "
				+"fv.bu_id = ?",[lobMaterialStreamId, businessUnitID], function(err, data){
				if(!err){
					for(var i=0; i<data.length; i++){
						var fmname = data[i].fmname;
						var fname = data[i].fname;

						//financialsValues[fmname] = {};
						//financialsValues[fmname][fname] = {};

						financialsValues[fmname][fname]["actual"] = data[i].actual;
						financialsValues[fmname][fname]["adjusted"] = data[i].adjusted;
						financialsValues[fmname][fname]["total_adjusted"] = data[i].total_adjusted;
						financialsValues[fmname][fname]["updated_by"] = data[i].updated_by;
						financialsValues[fmname][fname]["updated_date"] = data[i].updated_date;
					}
					
					getFinancialValuesCallBack(financialsValues);
				}
				else{
					console.log("Error in reading Fainancial Values "+err);
				}
			});
		}
		else{
			console.log("Error in connection "+err);
		}
	});
}
