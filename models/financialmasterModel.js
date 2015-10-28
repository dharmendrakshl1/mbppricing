module.exports = function(db, cb){
	db.define('financialmaster',{
		id: Number,
		name: String
	});
	return cb();
}