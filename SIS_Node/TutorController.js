
var Tutor = require("./Tutor");

module.exports = function(app) {
	app.get('/tutors/:id*',function(request,response){
		var tutor = new Tutor(request,request.params.id);
		
		tutor.load(request,response);
		
	});
	app.delete('/tutors/:id*',function(request,response){
		var tutor = new Tutor(request,request.params.id);
		tutor.delete(request,response);
	});
	app.get('/tutors',function(request,response){		
		var tutors = new Tutor(request).loadAll(request,response);
	});
	app.post('/login',function(request,response){		                   
		username=request.body.user_name;
		password=request.body.password;
		var tutors = new Tutor().login(username,password,request,response);
	});
	app.post('/tutors',function(request,response){
		var tutor = new Tutor(
			request,
			request.params.id,
			request.body.f_name,
			request.body.l_name,
			request.body.user_name,
			request.body.password,
			request.body.is_admin
		);
		tutor.create(request,response);
	});
	app.post('/tutors/:id*',function(request,response){
		var tutor = new Tutor(
			request,
			request.params.id,
			request.body.f_name,
			request.body.l_name,
			request.body.user_name,
			request.body.password,
			request.body.is_admin
		);
		tutor.update(request,response);
	});
}