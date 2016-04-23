
var Ticket = require("./Ticket");

module.exports = function(app) {
	app.get('/tickets/:id*',function(request,response){
		var ticket = new Ticket().load(request.params.id);
		if(ticket==null){
			response.status(404).send("Not Found");
		}else{
			response.send(ticket.load(request.params.id));
		}
	});
	app.get('/tickets',function(request,response){
		var ticket = new Ticket();
		response.send(ticket.loadAll());
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
		ticket.create();
		response.send(ticket);
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