#!/usr/bin/env node
var argv = require('optimist')
    .usage('Usage: $0 -cid [client_id] -csecret [client_secret]')
    .demand(['cid', 'csecret'])
    .argv;

var express = require('express');
var app = express();
var request = require('request');

var authget = 'https://api.moves-app.com/oauth/v1/authorize?client_id='+argv.cid+'&scope=activity&response_type=code',
	port = argv.port || 8001;

console.log('please make sure your app redir settings sets the url to http://localhost:'+port+'/moves');
console.log(authget);

var get_access_token = function(authcode, cid, csecret) { 
	var url = 'https://api.moves-app.com/oauth/v1/access_token?grant_type=authorization_code&code='+authcode+'&client_id='+cid+'&client_secret='+csecret;
	request.post(url, function(err, http, body) {
		if (err) { 
			console.log('error parsing ', body, err);
			return;
		}
		var tokens = JSON.parse(body);
		console.log('access token: ', tokens.access_token);
		console.log('refresh token: ', tokens.refresh_token);
		console.log('expires in ', tokens.expires_in);
	});
};

app.get('/moves',  function(req, res){
	var authcode = req && req.query.code;
	console.log('got auth code: ', authcode);
	res.send('got auth code:<p><pre>' + authcode + '</pre>');
	get_access_token(authcode, argv.cid, argv.csecret);
});

app.listen(argv.port || 8001);