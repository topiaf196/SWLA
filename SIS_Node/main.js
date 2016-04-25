var express = require("express");
var cors = require('cors')
var app = express();
app.use(require('body-parser').json());
app.use(cors({credentials: true, origin: true}));
var ticketController = require("./TicketController")(app);
var tutorController = require("./TutorController")(app);

app.get('/',function(request,response){
	var json = {
			tickets: request.get('host') + "/tickets",
			tutors: request.get('host') + "/tutors",
			tutor_login: request.get('host') + "/tutors/login"
			};
	response.send(json);
});
var listener = app.listen(process.env.PORT || 8082, function(){
    console.log('Listening on port ' + listener.address().port);
});