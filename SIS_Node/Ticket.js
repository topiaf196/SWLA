var connection = require("./swlaDb.js");
var uuid = require('node-uuid');
var Issue = require("./Issue");

function Ticket(request,id,phone_number,ip,created_at,tutor_id,ticketStatus){
	if(request==null){
		this.href = "";
	}else{
		this.href  = request.get('host').concat(request.originalUrl);
		if(request.params.id==null){
			this.href  = this.href.concat("/").concat(id);
		}
	}
    this.id  = id;
    this.phone_number  = phone_number;
    this.ip  = ip;
    this.created_at  = created_at;
    this.tutor_id  = tutor_id;
    this.ticketStatus  = ticketStatus;
	this.issues = [];
}

Ticket.prototype.load = function(request,response){
	loadData(this,request,response);
}
Ticket.prototype.delete = function(request,response){
	var values = {
		id:this.id
	};
	var query = connection.query('Delete from Ticket where ?',values, function(err) {		
		if (err){
			response.status(500).send("Fatal Error");
			console.log(err);
		}else{
			var valuesIssue = {
				ticket_id:this.id
			};
			var queryIssue = connection.query('Delete from Issue where ?',values, function(err) {		
			  if (err){
				response.status(500).send("Fatal Error");
				console.log(err);
			  }else{
				  response.send("Deleted Succesfully");
			  }
			});	
		}
	});
}

function loadData(ticket,request,response){
	var values = {
		id:ticket.id
	};
	var query = connection.query('SELECT * from Ticket where ?',values, function(err, rows) {
	  if (!err){
		  if(rows.length==0){
			response.status(404).send("Not Found");
		  }
		var ticket = new Ticket(
			request,
			rows[0].id,
			rows[0].phone_number,
			rows[0].ip,
			rows[0].created_at,
			rows[0].tutor_id,
			rows[0].status				
		)
		loadIssues(ticket,function(){
			response.send(ticket);
		});
	  }else{
			response.status(500).send("Fatal Error");
			console.log(err);
	  }
	});
}
var loadIssues =function(ticket,callback){
	var values = {
		ticket_id:ticket.id
	};
	var query = connection.query('SELECT * from Issue where ?',values, function(err, rows) {
	  if (err){
		response.status(500).send("Fatal Error");
		console.log(err);
	  }else{
			var issues = [];
			for(var i =0;i<rows.length;i++){
				var issue = new Issue(
					rows[i].ticket_id,
					rows[i].issue_Nbr,
					rows[i].category,
					rows[i].description
				);
				issues.push(issue);
			}
			console.log("adding issues");
			ticket.issues = issues;
	  }
	  callback();
	});
}

Ticket.prototype.createIssue = function(ticket,request,response){
	
}

Ticket.prototype.create = function(request,response){
		this.id = uuid.v1();
	var values = {
		id:this.id
	};
	if(this.phone_number!=null){
		values['phone_number'] = this.phone_number;
	}
	if(this.phone_number!=null){
		values['ip'] = this.ip;
	}
	if(this.tutor_id!=null){
		values['tutor_id'] = this.tutor_id;
	}
	if(this.ticketStatus==null){
		values['status'] = 'OPEN';
	}else{
		values['status'] = this.ticketStatus;
	}
	var query = connection.query('Insert Into Ticket Set created_at = now(), ?',values, function(err) {
		if (err){
			response.status(500).send("Fatal Error");
			console.log(err);
		}
	});
	response.status(201);
	response.location(request.get('host')+request.originalUrl+"/"+this.id);
	loadData(this,request,response);
}

Ticket.prototype.update = function(request,response){
	var params = [];
	var queryString = 'update Ticket Set ';
	var updateFields =[];
	if(this.phone_number!=null){
		updateFields.push("phone_number = ? ");
		params.push(this.phone_number);
	}
	if(this.ip!=null){
		updateFields.push("ip = ? ");
		params.push(this.ip);
	}
	if(this.created_at!=null){
		updateFields.push("created_at = ? ");
		params.push(this.created_at);
	}
	if(this.tutor_id!=null){
		updateFields.push("tutor_id = ? ");
		params.push(this.tutor_id);
	}
	if(this.ticketStatus!=null){
		updateFields.push("status = ? ");
		params.push(this.ticketStatus);
	}
	if(updateFields.length == 0){
		return;
	}
	
	for(var i =0;i<updateFields.length-1;i++){
		queryString = queryString.concat(updateFields[i]).concat(',');
	}	
	queryString = queryString.concat(updateFields[updateFields.length-1]);
	queryString = queryString.concat("Where id = ? ");
	params.push(this.id);
	console.log(params);
	var query = connection.query(queryString,params,function(err) {
		if (err){
			response.status(500).send("Fatal Error");
			console.log(err);
		}
		else{		
			response.send("Update Successful");
		}
	});
}

Ticket.prototype.loadAll = function(request,response){
	var query = connection.query('Select * from Ticket', function(err, rows) {
		if (err){
			console.log(err);
		}else{
			var tickets = [];			
			var buildTicket = function(i){
				if(i<rows.length){
					var ticket = new Ticket(
						request,
						rows[i].id,
						rows[i].phone_number,
						rows[i].ip,
						rows[i].created_at,
						rows[i].tutor_id,
						rows[i].status				
					)
					console.log("loading issues");
					
					loadIssues(ticket,function(){
						console.log("responding");
						tickets.push(ticket);
						buildTicket(i+1)
					});
				}else{					
					response.send(tickets);
				}
			}
			buildTicket(0);
		}
	});
}



module.exports = Ticket;