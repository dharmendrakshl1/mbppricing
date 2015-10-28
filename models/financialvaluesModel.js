module.exports = function(db, cb){
	db.define('financialvalues',{
		id: Number,
		financial_id: Number,
		bu_id: String,
		quarter_id: Number,
		actual: Number,
		adjusted: Number,
		total_adjusted: Number,
		updated_by: String,
		updated_date: Date
	});
	return cb();
}