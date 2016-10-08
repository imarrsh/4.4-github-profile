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

  var profileSource = $('#user-info-template').html(),
      profileTemplate = Handlebars.compile(profileSource),
      profileHTML = $(profileTemplate(data));
			// $orgTarget = $('js-user-orgs');

  $('.user-profile-data').append(profileHTML);
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

function profileNavStats(data){
	$.ajax(data.url + '/starred')
		.then(function(starred){
			$('.nav-repos span').text(data.public_repos);
			$('.nav-stars span').text(starred.length);
			$('.nav-followers span').text(data.followers);
			$('.nav-following span').text(data.following);
		});
}

function displayOrgs(data){
	var orgsURL = data.organizations_url,
			orgsSource = $('#orgs-template').html(),
			orgsTemplate = Handlebars.compile(orgsSource),
			orgHTML;

	$.ajax(orgsURL).then(function(orgs){
		orgs.forEach(function(org){
			console.log(org);
			orgHTML = $(orgsTemplate(org));
			$('#user-orgs').append(orgHTML);
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

	displayOrgs(data);

	profileNavStats(data);
}

// ajax request for profile data
$.ajax('https://api.github.com/users/imarrsh')
  .then(function(data){
    // call init function
    init(data);
  });
