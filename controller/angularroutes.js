var path = require('path');

module.exports = function(app){
	/*app.get('/angular',function(req, res){
		res.send("Angular ouput");
	});*/
	
	app.get('/angular', function(req, res){
		//res.sendfile('./public/main.html');
		res.sendFile(path.join(__dirname, '../public', 'main.html'));
	});
}