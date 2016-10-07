var $ = require('jquery');
var _ = require('underscore');
var Handlebars = require('handlebars');
var apiKey = require('./githubapikey');
var octicons = require('octicons');

// var rootURL = 'https://api.github.com/';

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
  console.log(data);
  var profileSource = $('#user-info-template').html(),
      profileTemplate = Handlebars.compile(profileSource),
      profileHTML = $(profileTemplate(data)),
		  orgsURL = data.organizations_url;

  $('#user-profile').append(profileHTML);

	$.ajax(orgsURL).then(function(orgs){
		orgs.forEach(function(org){
			
		});
	});
}

function displayRepos(data){
  // console.log(repoData);
  var reposURL = data.repos_url,
      repoSource = $('#user-repo-template').html(),
      repoTemplate = Handlebars.compile(repoSource),
      repoHTML;

  $.ajax(reposURL).then(function(repos){
    // loop through all repos, print each one to a template
    repos.forEach(function(repo){
      repoHTML = $(repoTemplate(repo));
      $('#user-repos').append(repoHTML);
    });

  });

}

// recive data and do stuff, call other functions
function init(data){

  // grab avatar and name to store in object
  var avatarData = { img: data.avatar_url,
                     name: data.name };
  displayAvatar(avatarData);

  displayProfileInfo(data);

  displayRepos(data);
}

// ajax request for profile data
$.ajax('https://api.github.com/users/imarrsh')
  .then(function(data){
    // call init function
    init(data);
  });
