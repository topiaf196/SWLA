var connection = require("./swlaDb.js");
var Ticket = require("./Ticket");

function Issue(ticket_id,issue_Nbr,category,description){
	this.ticket_id = ticket_id;
	this.issue_Nbr = issue_Nbr;
	this.category = category;
	this.description = description;
}

Issue.prototype.create = function(ticket,request,response){
	var values = {
		ticket_id:this.ticket_id,
		category:this.category,
	};
	if(this.description!=null){
		values['description'] = this.description;
	}
	var query = connection.query('Insert Into Issue Set ?',values, function(err) {
		if (err){
			response.status(500).send("Fatal Error");
			console.log(err);
		}
	});
	response.status(201);
	ticket.load(request,response);
}

module.exports = Issue;