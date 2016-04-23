var connection = require("./swlaDb.js");
var uuid = require('node-uuid');

function Ticket(id,phone_number,ip,created_at,tutor_id,ticketStatus){
    this.id  = id;
    this.phone_number  = phone_number;
    this.ip  = ip;
    this.created_at  = created_at;
    this.tutor_id  = tutor_id;
    this.ticketStatus  = ticketStatus;
}

Ticket.prototype.load = function(){
	connection.query('SELECT * from Ticket', function(err, rows, fields) {
	  if (!err)
		return rows;
	  else
		console.log(err);
	});
}

Ticket.prototype.create = function(){
	var values = {
		id:uuid.v1(),
	}
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
	var query = connection.query('Insert Into Ticket Set ?',values, function(err) {
		if (!err)
			return;
		else
			console.log(err);
	});
	console.log(query.sql);
}

Ticket.prototype.update = function(){
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
		if (!err)
			return;
		else
			console.log(err);
	});
	console.log(query.sql);
}

Ticket.prototype.loadAll = function(){
	connection.query('SELECT * from Ticket', function(err, rows, fields) {
	  if (err){
		console.log(err);
	  }else{
		console.log(rows);
		  return rows;
	  }
	});
}
module.exports = Ticket;