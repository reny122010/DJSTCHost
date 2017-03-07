// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var connection  = require('express-myconnection');

var sys = require('sys'),
exec = require('child_process').exec;

var getPort = function(){
	return 2222;
}

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
   connection(mysql,{
     host: '##',
     user: '##',
     password : '##',
     port : 3306, //port mysql
     database:'##'
   },'request')
);



var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.post('/insertBot', function(req, res) {
	var name = req.body.name;
	var portDJ = getPort();

	console.log("\033[1;33mInsert "+name);
    if((name == undefined )|| (null ==  name.match("^[a-zA-Z0-9]+$") )  ){
    	console.log("\033[31m Erro name is empty or not found in match.");
    	res.status(400).json({ error: true, message: 'Por favor, verifique a entrada!' });
    	req.getConnection(function(err,connection){
		connection.query('SELECT * FROM tarefas',[],function(err,result){
			if(err) return res.status(400).json(err);

			return res.status(200).json(result);

			});
		});
    }else{
    	exec('docker run --restart=always --name '+name+' -it -p '+portDJ+':8087 sinusbot:1.2 xinit /opt/ts3soundboard/ts3bot -RunningAsRootIsEvilAndIKnowThat -- /usr/bin/Xvfb :1 -screen 0 300x200x16 -ac ');
        console.log("\033[0;32mThe botDJ has be started.");
        res.status(200).json({ error: false});
    }
});

router.delete('/removeBot', function(req, res) {
	console.log("\033[1;33mRemove "+name);
	var name = req.body.name;
	if((name == undefined )|| (null ==  name.match("^[a-zA-Z0-9]+$") )  ){
		console.log("\033[31m Erro name is empty or not found in match.");
    	res.status(400).json({ error: true, message: 'Por favor, verifique a entrada!' });
    }else{
    	console.log("\033[0;32mThe botDJ has be deleted.");
    	exec('docker stop NOMEDOCONTAINER ');
		exec('docker rm NOMEDOCONTAINER ');
    	res.status(200).json({ error: false});
    }  
});

router.get('/listBot', function(req, res) {
	console.log("\033[1;33mListed all botDJ..."+name);
    res.status(200).json({ results: {bot: 'teste'}});  
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);