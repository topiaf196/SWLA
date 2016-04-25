
var Ticket = require("./Ticket");
var Issue = require("./Issue");
var BlockedIP = require("./BlockedIP");

module.exports = function(app) {
	app.get('/tickets/:id*',function(request,response){
		var ticket = new Ticket(request,request.params.id);
		
		ticket.load(request,response);
		
	});
	app.delete('/tickets/:id*',function(request,response){
		var ticket = new Ticket(request,request.params.id);
		ticket.delete(request,response);
	});
	app.get('/tickets',function(request,response){		
		var tickets = new Ticket(request).loadAll(request,response);
	});
	app.post('/tickets/:id*/issues',function(request,response){
		var ticket = new Ticket(request,request.params.id);
		var issue = new Issue(		
			request.params.id,
			null,
			request.body.category,
			request.body.description
		);
		issue.create(ticket,request,response);
	});
	app.post('/tickets',function(request,response){
		var ticket = new Ticket(
			request,
			request.params.id,
			request.body.phone_number,
			request.body.ip,
			request.body.created_at,
			request.body.tutor_id,
			request.body.ticketStatus,
			request.body.comment
		);
		
		new BlockedIP().checkIP(ticket,request,response);
	});
	app.post('/tickets/:id*',function(request,response){
		var ticket = new Ticket(
			request,
			request.params.id,
			request.body.phone_number,
			request.body.ip,
			request.body.created_at,
			request.body.tutor_id,
			request.body.ticketStatus,
			request.body.comment
		);
		ticket.update(request,response);
	});
}