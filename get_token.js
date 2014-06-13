#!/usr/bin/env node
var argv = require('optimist')
    .usage('Usage: $0 -cid [client_id] -csecret [client_secret]')
    .demand(['cid', 'csecret'])
    .argv;

var express = require('express');
var app = express();
var request = require('request');

var authget = 'https://api.moves-app.com/oauth/v1/authorize?client_id='+argv.cid+'&scope=activity%20location&response_type=code',
	port = argv.port || 8001;

console.error('please make sure your app redir settings sets the url to http://localhost:'+port+'/moves');
console.error(authget);

var get_access_token = function(authcode, cid, csecret) { 
	var url = 'https://api.moves-app.com/oauth/v1/access_token?grant_type=authorization_code&code='+authcode+'&client_id='+cid+'&client_secret='+csecret;
	request.post(url, function(err, http, body) {
		if (err) { 
			console.error('error parsing ', body, err);
			return;
		}
		var tokens = JSON.parse(body);
		console.error('access token: ', tokens.access_token);
		console.error('refresh token: ', tokens.refresh_token);
		console.error('expires in ', tokens.expires_in);
		console.log(JSON.stringify(tokens));
		process.exit(0);
	});
};

app.get('/moves',  function(req, res){
	var authcode = req && req.query.code;
	console.error('got auth code: ', authcode);
	res.send('got auth code:<p><pre>' + authcode + '</pre>');
	get_access_token(authcode, argv.cid, argv.csecret);
});

app.listen(argv.port || 8001);