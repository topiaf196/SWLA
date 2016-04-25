var connection = require("./swlaDb.js");
var Ticket = require("./Ticket");

function BlockedIP(ip,blocked_at){
	this.ip = ip;
	this.blocked_at = blocked_at;
}
BlockedIP.prototype.checkIP = function(ticket,request,response){
	var values = {
		ip:ticket.ip
	};
	var query = connection.query('SELECT count(*) as blockedCount from BlockedIP where ?',values, function(err, rows) {
	  if (err){
			response.status(500).send("Fatal Error");
			console.log(err);
	  }else{
		  if(rows[0].blockedCount==0){
			ticket.create(request,response);
		  }else{
			console.log("IP is in block table: "+ticket.ip);
			response.status(403).send("IP is blocked due to spam");
		  }
	  }
	});
}

BlockedIP.prototype.create = function(ticket,request,response,blockedNext){
	var values = {
		ip:ticket.ip
	};
	var query = connection.query('Insert Into BlockedIP Set blocked_at = now(), ?',values, function(err) {
		if (err){
			response.status(500).send("Fatal Error");
			console.log(err);
		}else{
			blockedNext(request,response);
		}
	});
}

module.exports = BlockedIP;