
var Issue = require("./Issue");

module.exports = function(app) {
	app.get('/issues/:id*',function(request,response){
		var issue = new Issue().load(request.params.id);
		if(issue==null){
			response.status(404).send("Not Found");
		}else{
			response.send(issue.load(request.params.id));
		}
	});
	app.get('/issues',function(request,response){
		var issue = new Issue();
		response.send(issue.loadAll());
	});
	app.post('/issues',function(request,response){
		//create new issue
	});
	app.post('/issues/:id*',function(request,response){
		//update existing issue
	});
}