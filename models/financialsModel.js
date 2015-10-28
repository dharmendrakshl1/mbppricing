module.exports = function(db, cb){
	db.define('financials',{
		id: Number,
		financialmasterid: Number,
		name: String,
		lobms_master_id: Number,
		wf_bucket: String,
		isadjustable: Boolean,
		isactualeditable: Boolean,
		per_unit: Number
	});
	return cb();
}