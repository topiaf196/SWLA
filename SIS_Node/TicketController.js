
var Ticket = require("./Ticket");

module.exports = function(app) {
	app.get('/tickets/:id*',function(request,response){
		var ticket = new Ticket();
		response.send(ticket.load(request.params.id));
	});
	app.get('/tickets',function(request,response){
		var ticket = new Ticket();
		response.send(ticket.loadAll());
	});
	app.post('/tickets',function(request,response){
		var ticket = new Ticket(request.query.description);
		response.send(ticket);
	});
}