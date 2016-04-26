var connection = require("./swlaDb.js");
var uuid = require('node-uuid');
var Issue = require("./Issue");
var BlockedIP = require("./BlockedIP");

function Ticket(request,id,phone_number,ip,created_at,tutor_id,ticketStatus,comment){
	if(request==null){
		this.href = "";
	}else{
		this.href  = request.get('host').concat("/tickets/").concat(id);		
	}
    this.id  = id;
    this.phone_number  = phone_number;
    this.ip  = ip;
    this.created_at  = created_at;
    this.tutor_id  = tutor_id;
    this.ticketStatus  = ticketStatus;
    this.comment  = comment;
    this.issuesHref  = this.href.concat("/issues");
	this.tutor = null;
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
			var queryIssue = connection.query('Delete from Issue where ?',valuesIssue, function(err) {		
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
	var query = connection.query('SELECT Ticket.id,phone_number,ip,created_at,tutor_id,status,comment,f_name,l_name,user_name,is_admin from Ticket Left Outer Join Tutor On Ticket.tutor_id = Tutor.id where Ticket.id = ?',ticket.id, function(err, rows) {
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
			rows[0].status,
			rows[0].comment
		)
		if(ticket.tutor_id != null){		
			var tutor = {
				href:request.get('host').concat("/tutors/").concat(rows[0].ticket_id),
				id:rows[0].ticket_id,
				f_name:rows[0].f_name,
				l_name:rows[0].l_name,
				user_name:rows[0].user_name,
				is_admin:rows[0].is_admin		
			};
			ticket.tutor = tutor;
		}
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
			ticket.issues = issues;
	  }
	  callback();
	});
}

var checkIp = function(ticket,request,response,next){
	var query = connection.query('Select count(0) as ticketCount from Ticket where DATE_SUB(NOW(), INTERVAL 1 HOUR) < created_at', function(err,rows) {
		if (err){
			response.status(500).send("Fatal Error");
			console.log(err);
		}else{
			if(rows[0].ticketCount >20){
				console.log("blocked IP: "+ticket.ip);
				new BlockedIP().create(ticket,request,response,blockedResp);
			}else{
				next(ticket,request,response);
			}
		}
	});
}
var blockedResp = function(request,response){
	response.status(403).send("IP is blocked due to spam");
}

Ticket.prototype.create = function(request,response){	
	checkIp(this,request,response,insertTicket);
}
var insertTicket = function(ticket,request,response){
	ticket.id = uuid.v1();
	var values = {
		id:ticket.id
	};
	if(ticket.phone_number!=null){
		values['phone_number'] = ticket.phone_number;
	}
	if(ticket.phone_number!=null){
		values['ip'] = ticket.ip;
	}
	if(ticket.tutor_id!=null){
		values['tutor_id'] = ticket.tutor_id;
	}
	if(ticket.ticketStatus==null){
		values['status'] = 'OPEN';
	}else{
		values['status'] = ticket.ticketStatus;
	}
	if(ticket.comment!=null){
		values['comment'] = ticket.comment;
	}
	var query = connection.query('Insert Into Ticket Set created_at = now(), ?',values, function(err) {
		if (err){
			response.status(500).send("Fatal Error");
			console.log(err);
		}else{
			response.status(201);
			response.location(request.get('host')+request.originalUrl+"/"+ticket.id);
			loadData(ticket,request,response);	
		}
	});
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
	if(this.comment!=null){
		updateFields.push("comment = ? ");
		params.push(this.comment);
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
	var query = connection.query('SELECT Ticket.id,phone_number,ip,created_at,tutor_id,status,comment,f_name,l_name,user_name,is_admin from Ticket Left Outer Join Tutor On Ticket.tutor_id = Tutor.id', function(err, rows) {
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
						rows[i].status,
						rows[i].comment					
					)					
					if(ticket.tutor_id!=null){			
						var tutor = {
							href:request.get('host').concat("/tutors/").concat(rows[i].tutor_id),
							id:rows[i].tutor_id,
							f_name:rows[i].f_name,
							l_name:rows[i].l_name,
							user_name:rows[i].user_name,
							is_admin:rows[i].is_admin		
						};
						ticket.tutor = tutor;
					}
					loadIssues(ticket,function(){
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