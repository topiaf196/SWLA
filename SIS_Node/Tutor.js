var connection = require("./swlaDb.js");
var uuid = require('node-uuid');
var Ticket = require("./Ticket");
var Issue = require("./Issue");

function Tutor(request,id,f_name,l_name,user_name,password,is_admin){
	if(request==null){
		this.href = "";
	}else{
		this.href  = request.get('host').concat("/tutors/").concat(id);
	}
    this.id  = id;
    this.f_name  = f_name;
    this.l_name  = l_name;
    this.user_name  = user_name;
    this.password  = password;
    this.is_admin  = is_admin;
	this.tickets = [];
}
Tutor.prototype.login = function(username,password,request,response){
	var values = {
		user_name:username
	};
	var query = connection.query('SELECT * from Tutor where ?',values, function(err, rows) {
		if (err){
			response.status(500).send("Fatal Error");
			console.log(err);
		}else{					   
			var isPasswordMatch = password == rows[0].password;
			if (err) {
			response.status(500).send("Fatal Error");
			console.log(err);
			}else{
			  if(isPasswordMatch){
				var tutor = new Tutor(
					request,
					rows[0].id,
					rows[0].f_name,
					rows[0].l_name,
					rows[0].user_name,
					null,
					rows[0].is_admin		
				)
				loadTickets(tutor,request,function(){
					response.send(tutor);
				});
			  }else{
				response.status(401).send("Invalid credentials");
			  }
			}
		}	
	});
}

Tutor.prototype.load = function(request,response){
	loadData(this,request,response);
}
Tutor.prototype.delete = function(request,response){
	var values = {
		id:this.id
	};
	var query = connection.query('Delete from Tutor where ?',values, function(err) {		
		if (err){
			response.status(500).send("Fatal Error");
			console.log(err);
		}else{
			var valuesTicket = {
				tutor_id:this.id
			};
			var queryIssue = connection.query('Update Ticket Set tutor_id = null where ?',valuesTicket, function(err) {		
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

function loadData(tutor,request,response){
	var values = {
		id:tutor.id
	};
	var query = connection.query('SELECT * from Tutor where ?',values, function(err, rows) {
	  if (!err){
		  if(rows.length==0){
			response.status(404).send("Not Found");
		  }else{
			var tutor = new Tutor(
				request,
				rows[0].id,
				rows[0].f_name,
				rows[0].l_name,
				rows[0].user_name,
				null,
				rows[0].is_admin				
			)
			loadTickets(tutor,request,function(){
				response.send(tutor);
			});
		  }
	  }else{
			response.status(500).send("Fatal Error");
			console.log(err);
	  }
	});
}
var loadTickets =function(tutor,request,callback){
	var values = {
		tutor_id:tutor.id
	};
	var query = connection.query('SELECT * from Ticket where ?',values, function(err, rows) {
	  if (err){
		response.status(500).send("Fatal Error");
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
					);
					
					loadIssues(ticket,function(){
						ticket.href = request.get('host').concat("/tickets/").concat(ticket.id);
						tickets.push(ticket);
						buildTicket(i+1)
					});
				}else{
					tutor.tickets = tickets;
					callback();
				}
			}
			buildTicket(0);
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
Tutor.prototype.create = function(request,response){
	var tutor = this;
	if(this.user_name == null){
		response.status(403).send("User Name is required");
		return;
	}
	var values = {
		user_name:this.user_name
	};
	var queryCheck = connection.query('SELECT count(*) as userNameCount from Tutor where ?',values, function(err, rows) {
		if (err){
			response.status(500).send("Fatal Error");
			console.log(err);
		}else if (rows[0].userNameCount != 0){
			response.status(403).send("User Name already exists");
			return;
		}else{
			tutor.id = uuid.v1();
			var values = {
				id:tutor.id
			};
			if(tutor.f_name!=null){
				values['f_name'] = tutor.f_name;
			}
			if(tutor.l_name!=null){
				values['l_name'] = tutor.l_name;
			}
			if(tutor.is_admin!=null){
				values['is_admin'] = tutor.is_admin;
			}
			if(tutor.user_name!=null){
				values['user_name'] = tutor.user_name;
			}
			if(tutor.password!=null){
				values['password'] = tutor.password;
			}
			var query = connection.query('Insert Into Tutor Set ?',values, function(err) {
				if (err){
					response.status(500).send("Fatal Error");
					console.log(err);
				}else{
					response.status(201);
					response.location(request.get('host')+request.originalUrl+"/"+tutor.id);
					loadData(tutor,request,response);	
				}
			});
		}
	});
	console.log(queryCheck.sql);
}

Tutor.prototype.update = function(request,response){
	var params = [];
	var queryString = 'update Tutor Set ';
	var updateFields =[];
	if(this.f_name!=null){
		updateFields.push("f_name = ? ");
		params.push(this.f_name);
	}
	if(this.l_name!=null){
		updateFields.push("l_name = ? ");
		params.push(this.l_name);
	}
	if(this.is_admin!=null){
		updateFields.push("is_admin = ? ");
		params.push(this.is_admin);
	}
	if(this.password!=null){
		updateFields.push("password = ? ");
		params.push(this.password);
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

Tutor.prototype.loadAll = function(request,response){
	var query = connection.query('Select * from Tutor', function(err, rows) {
		if (err){
			console.log(err);
		}else{
			var tutors = [];			
			var buildTutor = function(i){
				if(i<rows.length){
					var tutor = new Tutor(
						request,
						rows[i].id,
						rows[i].f_name,
						rows[i].l_name,
						rows[i].user_name,
						null,
						rows[i].is_admin	
					)
					console.log("loading issues");
					
					loadTickets(tutor,request,function(){
						console.log("responding");
						tutors.push(tutor);
						buildTutor(i+1)
					});
				}else{					
					response.send(tutors);
				}
			}
			buildTutor(0);
		}
	});
}

module.exports = Tutor;