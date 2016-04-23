
var Ticket = require("./Ticket");

module.exports = function(app) {
	app.get('/tickets/:id*',function(request,response){
		new Ticket(request.params.id).load(response);
	});
	app.delete('/tickets/:id*',function(request,response){
		new Ticket(request.params.id).delete(response);
	});
	app.get('/tickets',function(request,response){
		var tickets = new Ticket().loadAll(response);
	});
	app.post('/tickets',function(request,response){
		var ticket = new Ticket(
			request.params.id,
			request.body.phone_number,
			request.body.ip,
			request.body.created_at,
			request.body.tutor_id,
			request.body.ticketStatus
		);
		ticket.create(request,response);
	});
	app.post('/tickets/:id*',function(request,response){
		var ticket = new Ticket(
			request.params.id,
			request.body.phone_number,
			request.body.ip,
			request.body.created_at,
			request.body.tutor_id,
			request.body.ticketStatus
		);
		ticket.update();
		response.send();
	});
}