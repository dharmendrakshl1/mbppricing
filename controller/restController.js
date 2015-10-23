var pg = require('pg');
// connecting to postgres
var conString = "pg://mbp_admin:mbpadm1n@alvdapp032:5432/mbpdev";
var client = new pg.Client(conString);
client.connect();


exports.getMarketArea = function(req,res){
	var groupId = req.params.groupId;
	var queryString = req.query;
	console.log("printing queryString---> "+queryString);
	console.log("printing groupId--> "+groupId+ "selectQuery is called");
	//var query= client.query("select distinct fac_ma_idu,fac_ma_nm from mbp_denorm_table where fac_group_idu = ($1)", [groupId]);
	var query = client.query("select distinct ma_name, ma_id from corpdb_vw where group_id= ($1)",[groupId]);
	query.on("row", function (row, result) {
		result.addRow(row);
	});
	query.on("end", function (result) {

		console.log(JSON.stringify(result.rows, null, "    "));
		res.send(JSON.stringify(result.rows, null, "    "));
		/*redisClient.set('frameworks',JSON.stringify(result.rows[0], null,"   "),function (err, res) {
					if(err){
						console.log("some error in hmset---> "+err);
					}else{
						console.log("inserted into hmset");
					}
				}); */
	});
}

exports.getFacilities = function (req,res){
	console.log("in getFacilities");
	var marketId= req.params.marketAreaId;
	console.log("printing market id--> "+marketId);
	var query = client.query("select  distinct facility_type_id, facility_type from corpdb_vw where ma_id= ($1)" , [marketId]);
	query.on("row", function (row, result) {
		result.addRow(row);
	});
	query.on("end", function (result) {

		console.log(JSON.stringify(result.rows, null, "    "));
		res.send(JSON.stringify(result.rows, null, "    "));
		/*redisClient.set('frameworks',JSON.stringify(result.rows[0], null,"   "),function (err, res) {
					if(err){
						console.log("some error in hmset---> "+err);
					}else{
						console.log("inserted into hmset");
					}
				}); */
	});
}

exports.getBusinessUnit = function(req,res){
	console.log("in getBusinessUnit");
	var facId = req.params.facilityId;
	var marketId = req.params.marketAreaId;
	console.log("printing facId--> "+facId);
	console.log("printing marketId----> "+marketId);
	if(facId == 5){
		console.log("Facility Type = All");
		var query = client.query("select distinct bu_id,bu_name from corpdb_vw where ma_id= ($1)",[marketId]);
		query.on("row", function(row, result){
			result.addRow(row);
		});
		query.on("end", function(result){
			res.send(JSON.stringify(result.rows,null, "    "));
		});
	}
	else{
		console.log("Facility Type = Selected one");
		var query = client.query("select distinct bu_id,bu_name from corpdb_vw where ma_id= ($1) and facility_type_id=  ($2)",[marketId,facId]);
		query.on("row", function (row, result) {
			result.addRow(row);
		});
		query.on("end", function (result) {

			console.log(JSON.stringify(result.rows, null, "    "));
			res.send(JSON.stringify(result.rows, null, "    "));
			
			/*redisClient.set('frameworks',JSON.stringify(result.rows[0], null,"   "),function (err, res) {
						if(err){
							console.log("some error in hmset---> "+err);
						}else{
							console.log("inserted into hmset");
						}
					}); */
		});
	}
}

exports.getLOB = function(req,res){
	console.log("in getLOB");
 	var facId = req.params.facilityId;
	var marketId = req.params.marketAreaId;
	var businessunitId = req.params.businessunitId;
	

	console.log("pritning---> "+facId+"=--> "+marketId+"---> "+businessunitId);
	if(facId == 5){
		console.log("LOB Facility Type = All");
		var query = client.query("select distinct lob4_id, lobms from corpdb_vw where ma_id= ($1) and bu_id = ($2) " ,[marketId,businessunitId]);
		query.on("row", function(row, result){
			result.addRow(row);
		});
		query.on("end", function(result){
			res.send(JSON.stringify(result.rows,null, "    "));
		});
	}
	else{
		var query = client.query("select distinct lob4_id, lobms from corpdb_vw where ma_id= ($1) and facility_type_id= ($2) and bu_id = ($3) " ,[marketId,facId,businessunitId]);
		query.on("row", function (row, result) {
			result.addRow(row);
		});
		query.on("end", function (result) {

			console.log(JSON.stringify(result.rows, null, "    "));
			res.send(JSON.stringify(result.rows, null, "    "));
			/*redisClient.set('frameworks',JSON.stringify(result.rows[0], null,"   "),function (err, res) {
						if(err){
							console.log("some error in hmset---> "+err);
						}else{
							console.log("inserted into hmset");
						}
					}); */
		});
	}
}




exports.getQuarter1 = function(req, res){
	var quarter_range = JSON.stringify({
		"appliedQuarterRange" : "",
		"availableQuarterRange" : "4Q14-3Q15"
	},null, "    ");

	res.send(quarter_range);
}
//-------- editting from here
exports.getQuarter = function(req,res){
	var PropertiesReader = require("properties-reader");
	var properties = new PropertiesReader("./propertylibrary/mbpPricingQuery.properties");

	console.log("in getQuarter");
	var businessunitId = req.params.businessunitId;
	var lobMaterialStreamId = req.params.lobMaterialStreamId;
	var max_quarter_id;
	var property_query;
	var quarterRange = {};

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
					var quarterValue = result.rows[0].quarter;
					quarterRange.appliedQuarterRange = "";
					quarterRange.availableQuarterRange = quarterValue;

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
					res.send(quarterRange);
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
								
						//var q_quarter_id_query = client.query("select id, quarter from quarters "+
							//"where id in ($1, $2) order by id desc;",[max_quarter_id, (max_quarter_id - 1)]);
						property_query = properties.get("quarterrange.quarter.notinbuquarter.quarterid");
						var q_quarter_id_query = client.query(property_query,[max_quarter_id, (max_quarter_id - 1)]);
								q_quarter_id_query.on("row", function(row, result) {
									result.addRow(row);
								});
								q_quarter_id_query.on("end", function(result) {
									console.log(JSON.stringify(result.rows, null, "    "));
									quarterRange.appliedQuarterRange = result.rows[1].quarter;
									quarterRange.availableQuarterRange = result.rows[0].quarter;
									res.send(quarterRange);

									/*res.send(JSON.stringify({
										"appliedQuarterRange" : result.rows[1].quarter,
										"availableQuarterRange" : result.rows[0].quarter
									}, null, "    "));*/
								});
							
					}
					else{

						// res.send(json applied vl hav quarter, available as null)
						// wen there is record in the bu quarter table and no record in the Quarteres_table

						console.log("It is Defined");
						console.log("Result = "+quarter_id);

						//var q_quarter_id_query = client.query("select id, quarter from quarters "+
						//	"where id = $1 order by id desc;",[max_quarter_id]);

						property_query = properties.get("quarterrange.quarter.presentinbuquarter.quarterid");
						var q_quarter_id_query = client.query(property_query,[max_quarter_id]);
								q_quarter_id_query.on("row", function(row, result) {
									result.addRow(row);
								});
								q_quarter_id_query.on("end", function(result) {
									console.log(JSON.stringify(result.rows, null, "    "));
									quarterRange.appliedQuarterRange = result.rows[0].quarter;
									quarterRange.availableQuarterRange = result.rows[0].quarter;
									res.send(quarterRange);

									/*res.send(JSON.stringify({
										"appliedQuarterRange" : result.rows[1].quarter,
										"availableQuarterRange" : result.rows[0].quarter
									},null, "    "));*/
								});
					}
					//res.send(JSON.stringify(result.rows[0],null, "   "));
				});
			}
		});
	});
}


exports.goBuQuarterInsert= function(req, res){
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
}