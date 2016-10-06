var $ = require('jquery');
var _ = require('underscore');
var Handlebars = require('handlebars');
var apiKey = require('./githubapikey');

// set header for api request
if(apiKey !== undefined){
	$.ajaxSetup({
		headers: {
			'Authorization' : 'token ' + apiKey.token
		}
	});
}

// ajax request for profile data
$.ajax('https://api.github.com/users/imarrsh').then(function(data){
  console.log(data);
});
