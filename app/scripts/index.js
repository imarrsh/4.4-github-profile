var $ = require('jquery');
var _ = require('underscore');
var Handlebars = require('handlebars');
var moment = require('moment');
var apiKey = require('./githubapikey').token;
var octicons = require('octicons');

// var rootURL = 'https://api.github.com/';

// set header for api request
if(apiKey !== undefined){
	$.ajaxSetup({
		headers: {
			'Authorization' : 'token ' + apiKey
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
	// update the created_at prop with formatted value
	data.created_at = 'Joined on ' + moment(data.created_at).format('MMMM Do YYYY');

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
			repoHTML,
			// set template for repo filer list
			$repoFilterMenu = $('#repo-lang-options'),
			repoFilterSrc = $("#repo-filter-list-item").html(),
			repoFilterTemplate = Handlebars.compile(repoFilterSrc),
			repoFilterListHTML;

  $.ajax(reposURL).then(function(repos){

		var repoLangs = [],
				uniqueLangs;
		// loop through all repos, print each one to a template
    repos.forEach(function(repo){
      repoHTML = $(repoTemplate(repo));
      $('#user-repos').append(repoHTML);

			// push each repo langauge to an
			// array so we can do work on them
			var lang = repo.language;
			if(lang !== null){
				repoLangs.push(lang);
			}

    });

		uniqueLangs = _.flatten(_.union(repoLangs));
		uniqueLangs.forEach(function(uniqueLang){
			repoFilterListHTML = $(repoFilterTemplate(uniqueLang));
			$repoFilterMenu.append(repoFilterListHTML.text(uniqueLang));
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



// jQuery event handlers

$('.drop-list').prev().on('click', function(e){
	e.preventDefault();

	// was attempting to make a more generic drop-down handler
	// to no avail

});


$('.repo-filter-buttons button').on('click', function(e){
	e.preventDefault();
	var $this = $(this);
	var $menu = $this.next();
	console.log($menu);

	$menu.toggleClass('hidden');

	$('body').on('click', function(e){
		var $target = $(e.target);
		// console.log($target);
		if($target.parents('.js-menu-parent').length === 0) {
			$menu.addClass('hidden');
			//detach event handler
			$(this).unbind(e);
		}
	});

});

$('#repo-search-term').on('keyup', function(e){
  // console.log('key pressed:', e.key);
  var term = $(this).val();
  console.log(term);

  var $repoLinks = $(".js-repo-info");
	$repoLinks.each(function(i, repoLink){

		if($(this).context.innerText.toLowerCase().indexOf(term) === -1) {
			$(this).hide();
		} else {
			$(this).show();
		}
		// var href = $(this).find('a');


		// console.log(i, repoLink, href);
		// if(repoLink.children('a:contains(' + term + ')')) {
		// 	$repoLink.hide();
		// }
	});
});
