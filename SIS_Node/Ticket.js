var connection = require("./swlaDb.js");

function Ticket(description){
	this.description = description;
}

Ticket.prototype.setDescription = function(description){
	this.description = description
}
Ticket.prototype.getDescription = function(){
	return this.description;
}
Ticket.prototype.load = function(id){
	connection.query('SELECT * from BlockedIP', function(err, rows, fields) {
	  if (!err)
		console.log('The solution is: ', rows);
	  else
		console.log(err);
	});
	return id;
}
Ticket.prototype.loadAll = function(){
	var results = [];
	connection.query('SELECT * from BlockedIP', function(err, rows, fields) {
	  if (err)
		rows.forEach(function(row){
			results.push(row);
		});
		console.log(err);
	});
	return results;
}
module.exports = Ticket;