
var Tutor = require("./Tutor");

module.exports = function(app) {
	app.get('/tutors/:id*',function(request,response){
		var tutor = new Tutor().load(request.params.id);
		if(tutor==null){
			response.status(404).send("Not Found");
		}else{
			response.send(tutor.load(request.params.id));
		}
	});
	app.get('/tutors',function(request,response){
		var tutor = new Tutor();
		response.send(tutor.loadAll());
	});
	app.post('/tutors',function(request,response){
		//create new tutor
	});
	app.post('/tutors/:id*',function(request,response){
		//update existing tutor
	});
}