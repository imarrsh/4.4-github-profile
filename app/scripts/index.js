var $ = require('jquery');
var _ = require('underscore');
var Handlebars = require('handlebars');
var apiKey = require('./githubapikey');
var octicons = require('octicons');

// set header for api request
if(apiKey !== undefined){
	$.ajaxSetup({
		headers: {
			'Authorization' : 'token ' + apiKey.token
		}
	});
}

// display
function displayAvatar(avatar){
  var $avatars = $('.avatar');
  $avatars.attr({
          'src' : avatar.img,
          'alt' : avatar.name,
          'title' : avatar.name
          });
}

function displayProfileInfo(data){
  
}

// recive data and do stuff, call other functions
function init(data){
  // grab avatar
  var avatarData = {
                     img: data.avatar_url,
                     name: data.name
                   };

  displayAvatar(avatarData);
  // console.log(avatarURL);
  displayProfileInfo(data);
}

// ajax request for profile data
$.ajax('https://api.github.com/users/imarrsh').then(function(data){
  // call init function
  init(data);
});
