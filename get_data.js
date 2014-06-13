#!/usr/bin/env node
/* jshint undef: true, strict:false, trailing:false, unused:false */
/* global require, exports, console, process, module */

var TWENTY_FOUR_HOURS_USEC = 24*60*60*1000,
	FIVE_DAYS_USEC =  5*TWENTY_FOUR_HOURS_USEC;

var _ = require('underscore'),
	jQ = require('jQuery'),
	fs = require('fs'),
	request = require('request'),
	u = require('./utils');

var argv = require('optimist')
    .usage('Usage: $0  -tokens [tokenfile]')
    .demand(['tokens'])
    .argv;	

var toMovesDate = function(date) {
    var yy = date.getFullYear(), mm = date.getMonth() + 1, dd = date.getDate();
    var s = ''+yy;
    s = s + (mm < 10 ? '0'+mm : mm);
    s = s + (dd < 10 ? '0'+dd : dd);
    return s;
};
var fromMovesDate = function(m_date) {
    var year = m_date.slice(0,4), m = m_date.slice(4,6), d = m_date.slice(6,8);
    var hour = m_date.slice(9,11), min = m_date.slice(11,13), sec = m_date.slice(13,15);
    var newdate = [year, m, d].join('/');
    var newtime = [hour,min, sec].join(':');
    var toret =  new Date(newtime + ' ' + newdate);
    return toret;
};
var daysBetween = function(date1, date2) {
    var diff = Math.abs(date2.valueOf() - date1.valueOf());
    return diff/(1000*60*60*24);
};

var readTokens = function(fname) { 
	console.error('reading tokens from file ', fname);
	var tokens = JSON.parse(fs.readFileSync(fname));
	console.error('access ', tokens.access_token, ' refresh:', tokens.refresh_token);
	return tokens;
}
var writeTokens = function(fname, tokenobj) { 
	// TODO TODO
};

var MovesAPI = function(access, refresh) {
	this.access = access;
	this.refresh = refresh;
};
MovesAPI.prototype = {
	API : 'https://api.moves-app.com/api/1.1',
	// API: 'http://localhost:8000',
	get : function(url, qs) { 
		console.error('making request ', this.API+url, ' token : ', this.access);
		var d = new jQ.Deferred();
		request({ url:this.API+url, method:'GET', qs: _({ access_token: this.access }).extend(qs||{}) },
			function(err, http, body) {
				if (err) { 
					console.error('error at ', url , ' ', err);
					return d.reject(err);
				} 
				d.resolve(body);
			});
		return d.promise();
	},
	getProfile : function() { 
		return this.get('/user/profile');
	},
	getStoryline: function(from) { 
		var today = new Date(), this_ = this;
		var ndays = (today.valueOf() - from.valueOf())/FIVE_DAYS_USEC;
		console.error('ndays ', Math.ceil(ndays));
		var D = u.deferred();
		var ds = u.range(ndays).map(function(day_i) {
			var dst = from.valueOf() + day_i * FIVE_DAYS_USEC;
			var dend = Math.min(today.valueOf(), from.valueOf() + (day_i+1) * FIVE_DAYS_USEC);
			var d = u.deferred();
			console.error( ' from ', new Date(dst), toMovesDate(new Date(dst)), ' until ', new Date(dend), toMovesDate(new Date(dend)));
			this_.get('/user/storyline/daily', {
				from: toMovesDate(new Date(dst)),
				to: toMovesDate(new Date(dend)),
				trackPoints:true
			}).then(function(body) { 
				var result = JSON.parse(body);
				console.error('got entries ', result.length);
				d.resolve(result);
			}).fail(d.reject);
			return d.promise();
		});
		u.when(ds).then(function(results) {
			console.error('CONT -- ', results.length);
			D.resolve(results.reduce(function(a,b) { return a.concat(b); }, []));
		}).fail(D.reject);
		return D.promise();
	}
};

var tokens = readTokens(argv.tokens);
var mvapi = new MovesAPI(tokens.access_token, tokens.refresh_token);
var output;

mvapi.getProfile().then(function(body) { 
	console.error('got profile ', body);
	var profile = JSON.parse(body);
	output = profile;
	console.error('from >> ', fromMovesDate(profile.profile.firstDate));
	mvapi.getStoryline(fromMovesDate(profile.profile.firstDate)).then(function(storyline) {
		output.storyline = storyline;
		console.log(JSON.stringify(output));
	}).fail(function(err) {
		console.error('error getStoryline() ', err);
	});
}).fail(function(err) { 
	console.error('error getting profile');
});