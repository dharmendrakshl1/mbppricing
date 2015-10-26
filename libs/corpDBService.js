var pg = require('pg');
var PropertiesReader = require("properties-reader");
var properties = new PropertiesReader("./propertylibs/mbpPricingQuery.properties");

// connecting to postgres
var confDB = require('../config/database.js');
var client = new pg.Client(confDB.url);
client.connect();


exports.getMarketArea = function(groupId, callBackMarketArea){
	console.log("Entering CorpDBService->getMarketArea");
	//var query= client.query("select distinct fac_ma_idu,fac_ma_nm from mbp_denorm_table where fac_group_idu = ($1)", [groupId]);
	var query = client.query("select distinct ma_name, ma_id from corpdb_vw where group_id= ($1)",[groupId]);
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {

		console.log(JSON.stringify(result.rows, null, "    "));
		console.log("Exiting CorpDBService->getMarketArea");
		//return JSON.stringify(result.rows, null, "    ");
		callBackMarketArea(JSON.stringify(result.rows, null, "    "));
	});
}

exports.getFacilities = function(marketId, callBackFacilities){
	console.log("Entering CorpDBService->getFacilities");
	var query = client.query("select  distinct facility_type_id, facility_type from corpdb_vw where ma_id= ($1)" , [marketId]);
	query.on("row", function (row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {

		console.log(JSON.stringify(result.rows, null, "    "));
		console.log("Exiting CorpDBService->getFacilities");
		//return JSON.stringify(result.rows, null, "    ");
		callBackFacilities(JSON.stringify(result.rows, null, "    "));
	});
}

exports.getBusinessUnit = function(facId, marketId, callBackBusinessUnit){
	console.log("Entering CorpDBService->getBusinessUnit");
	if(facId == 5){
		console.log("Facility Type = All");
		var query = client.query("select distinct bu_id,bu_name from corpdb_vw where ma_id= ($1)",[marketId]);
		query.on("row", function(row, result){
			result.addRow(row);
		});
		query.on("end", function(result){
			console.log("Exiting CorpDBService->getBusinessUnit");
			//return JSON.stringify(result.rows,null, "    ");
			callBackBusinessUnit(JSON.stringify(result.rows, null, "    "));
		});
	}
	else{
		console.log("Facility Type = Selected one");
		var query = client.query("select distinct bu_id,bu_name from corpdb_vw where ma_id= ($1) and facility_type_id=  ($2)",[marketId,facId]);
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on("end", function(result) {
			console.log(JSON.stringify(result.rows, null, "    "));
			console.log("Exiting CorpDBService->getBusinessUnit");
			//return JSON.stringify(result.rows, null, "    ");
			callBackBusinessUnit(JSON.stringify(result.rows, null, "    "));
		});
	}
}

exports.getLOB = function(marketId, facId, businessunitId, callBackLOB){
	console.log("Entering CorpDBService->getLOB");
	if(facId == 5){
		console.log("LOB Facility Type = All");
		var query = client.query("select distinct lob4_id, lobms from corpdb_vw where ma_id= ($1) and bu_id = ($2) " ,[marketId,businessunitId]);
		query.on("row", function(row, result){
			result.addRow(row);
		});
		query.on("end", function(result){
			console.log(JSON.stringify(result.rows, null, "    "));
			console.log("Exiting CorpDBService->getLOB");
			//return JSON.stringify(result.rows,null, "    ");
			callBackLOB(JSON.stringify(result.rows,null, "    "));
		});
	}
	else{
		console.log("LOB Facility Type = Selected one");
		var query = client.query("select distinct lob4_id, lobms from corpdb_vw where ma_id= ($1) and facility_type_id= ($2) and bu_id = ($3) " ,[marketId,facId,businessunitId]);
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on("end", function(result) {
			console.log(JSON.stringify(result.rows, null, "    "));
			console.log("Exiting CorpDBService->getLOB");
			//return JSON.stringify(result.rows, null, "    ");
			callBackLOB(JSON.stringify(result.rows,null, "    "));
		});
	}
}

exports.getQuarterRange = function(businessunitId, lobMaterialStreamId, callBackQuarterRange){
	console.log("Entering CorpDBService->getQuarterRange");
	var max_quarter_id;
	var property_query;
	var quarter = {};

	property_query = properties.get("quarterrange.quarter.max.quarterid");
	console.log("Max Query  = "+property_query);
	var max_quarter_id_query = client.query(property_query);
	max_quarter_id_query.on("row", function(row, result){
		result.addRow(row);
	});
	max_quarter_id_query.on("end", function(result){
		max_quarter_id = result.rows[0].max;
		console.log("Max ID  = "+max_quarter_id);

		//This Condition is for First Time in Production and Returning the format like below
		//Either {appliedQuarterRange:"", availaibleQuarterRange:"value"}
		//OR {appliedQuarterRange:"value", availaibleQuarterRange:""}
		property_query = properties.get("quarterrange.quarter.checkbuidlobidpresentin.buquarter");
		var bu_check_buid_lobmsid = client.query(property_query,[businessunitId, lobMaterialStreamId]);
		bu_check_buid_lobmsid.on("row", function(row, result){
			result.addRow(row);
		});
		bu_check_buid_lobmsid.on("end", function(result){
			var buid_lobmsid_value = result.rows[0];
			if(buid_lobmsid_value === undefined){
				console.log("LOB & BUID is undefined");

				property_query = properties.get("quarterrange.quarter.buquarter.firstinprod.quarterid");
				var bu_quarter_id_query = client.query(property_query,[max_quarter_id]);

				bu_quarter_id_query.on("row", function(row, result){
					result.addRow(row);
				});
				bu_quarter_id_query.on("end", function(result){
					console.log(JSON.stringify(result.rows, null, "    "));

					var quarterValue = result.rows[0].quarter;
					quarter.appliedQuarter = "";
					quarter.availableQuarter = quarterValue;

					/*var bu_quarter_id = result.rows[0].quarter_id;

					console.log("Quarter Value - = "+quarterValue);
					console.log("BU Quarter ID - = "+bu_quarter_id);
					
					if(bu_quarter_id == null){
						quarterRange.appliedQuarterRange = "";
						quarterRange.availaibleQuarterRange = quarterValue;
					}
					else{
						quarterRange.appliedQuarterRange = quarterValue;
						quarterRange.availaibleQuarterRange = quarterValue;
					}*/

					console.log("Exiting CorpDBService->getQuarterRange");
					//return quarterRange;
					callBackQuarterRange(quarter);
				});
			}

			//Below case is for 2nd time and onwards in production and Returning the format like below
			//{appliedQuarterRange:"value", availaibleQuarterRange:"value"}
			else{
				property_query = properties.get("quarterrange.quarter.checkquarteridpresentinbuquarter.quarterid");
				var bu_quarter_id_query = client.query(property_query,[max_quarter_id,businessunitId,lobMaterialStreamId]);

				bu_quarter_id_query.on("row", function(row, result){
					result.addRow(row);
				});
				bu_quarter_id_query.on("end", function(result){

					var quarter_id = result.rows[0];
					if(quarter_id === undefined){
						console.log("It is undefined");
						console.log("Result = "+quarter_id);

						//res.send(json with applied as null and available vl have quarter)
						// wen no record in BU Quarter table
						
						property_query = properties.get("quarterrange.quarter.notinbuquarter.quarterid");
						var q_quarter_id_query = client.query(property_query,[max_quarter_id, (max_quarter_id - 1)]);
						q_quarter_id_query.on("row", function(row, result) {
							result.addRow(row);
						});
						q_quarter_id_query.on("end", function(result) {
							console.log(JSON.stringify(result.rows, null, "    "));
							quarter.appliedQuarter = result.rows[1].quarter;
							quarter.availableQuarter = result.rows[0].quarter;
							
							console.log("Exiting CorpDBService->getQuarterRange");
							//return quarterRange;
							callBackQuarterRange(quarter);
						});
							
					}
					else{

						// res.send(json applied vl hav quarter, available as null)
						// wen there is record in the bu quarter table and no record in the Quarteres_table

						console.log("It is Defined");
						console.log("Result = "+quarter_id);

						property_query = properties.get("quarterrange.quarter.presentinbuquarter.quarterid");
						var q_quarter_id_query = client.query(property_query,[max_quarter_id]);
						q_quarter_id_query.on("row", function(row, result) {
							result.addRow(row);
						});
						q_quarter_id_query.on("end", function(result) {
							console.log(JSON.stringify(result.rows, null, "    "));
							quarter.appliedQuarter = result.rows[0].quarter;
							quarter.availableQuarter = result.rows[0].quarter;
							
							console.log("Exiting CorpDBService->getQuarterRange");
							//return quarterRange;							
							callBackQuarterRange(quarter);
						});
					}
				});
			}
		});
	});
}


/*exports.goBuQuarterInsert= function(req, res){
	console.log("in goBuQuarterInsert");
	var businessunitId = req.params.businessunitId;
	var lobMaterialStreamId = req.params.lobMaterialStreamId;
	var max_quarter_id;

	var max_quarter_id_query = client.query("select max(id) from quarters");
	max_quarter_id_query.on("row", function(row, result){
		result.addRow(row);
	});
	max_quarter_id_query.on("end", function(result){

		max_quarter_id = result.rows[0].max;
		console.log("Max ID  = "+max_quarter_id);

		var  bu_quarter_id_query = client.query("select quarter_id from businessunitquarter where quarter_id = ($1)", [max_quarter_id]);
		bu_quarter_id_query.on("row", function(row, result){
			result.addRow(row);
		});
		bu_quarter_id_query.on("end", function(result){

			var quarter_id = result.rows[0];
			if(quarter_id === undefined){
				console.log("It is undefined");
				console.log("Result = "+quarter_id);

				var bu_insert_query = client.query("INSERT INTO mbp_admin.BUSINESSUNITQUARTER(BU_id, LOBMS_ID,Quarter_id)"+
				"VALUES($1, $2, $3)", [businessunitId, lobMaterialStreamId, max_quarter_id], function(err, result){
				if(err){
					console.log("Error in insertion of record "+err);
				}
				else{
						
						console.log("Record got inserted successfully");
						
					}
				});
			}

		});
	});
}*/