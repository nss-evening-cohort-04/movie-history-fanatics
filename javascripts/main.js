"use strict";
let apiKeys = {};
let FbAPIKeys = {};
let uid = "";
let searchResult = {};

console.log("jqeury connected");

function showMyMovies(){
  FbAPI.oldMovies(FbAPIKeys, uid).then(function(movies){
    console.log("movies from FB", movies);
    $('#movies-to-watch').html('');
    $('#movies-already-viewed').html('');
    movies.forEach(function(movie){
      if(!movie.Watched){
        let newListItem =`<div  class="card card-outline-success text-xs-center" data-completed="${movie.watched}">`;
          newListItem+= `<img class="card-img-top" src=${movie.Poster} alt="Card image cap">`;
          newListItem+= '<div class="card-block">';
          // newListItem+= `<li data-completed="${movie.watched}">`;
          newListItem+=`<h4 class="card-title">${movie.Title}</h4>`;
          newListItem+=`<p class="card-text">${movie.Plot}</p>`;
          // newListItem+='Watched<input class="checkboxStyle" type="checkbox" checked>';
          // newListItem+='<ul class="list-group list-group-flush">';
          // newListItem+= '<li class="list-group-item">actor</li>';
          // newListItem+= '<li class="list-group-item">actor</li>';
          // newListItem+= '<li class="list-group-item">actor</li>';
          // newListItem+= '</ul>';
          // newListItem+= '<div class="card-block">';
          // newListItem+= '<a href="#" class="card-link">Card link</a>';
          // newListItem+= '<a href="#" class="card-link">Another link</a>';
          // newListItem+= '</div>';
          newListItem+='<button type="button" href="#" class="btn btn-primary">Watched</button>';
          // newListItem+='</li>';
        newListItem+='</div>';
        newListItem+='</div>';
    //apend to list
    $('#movies-to-watch').append(newListItem);
  }else{
    let newListItem =`<div  class="card card-outline-success text-xs-center" data-completed="${movie.watched}">`;
      newListItem+= `<img class="card-img-top" src=${movie.Poster} alt="Card image cap">`;
        newListItem+= '<div class="card-block">';
          newListItem+=`<h4 class="card-title">${movie.Title}</h4>`;
          newListItem+=`<p class="card-text">${movie.Plot}</p>`;
          newListItem+='<button type="button" href="#" class="btn btn-success">Rate Movie <i class="fa fa-star-o" aria-hidden="true"></i></button>';
        newListItem+='</div>';
  newListItem+='</div>';
    //apend to list
    $('#movies-already-viewed').append(newListItem);
    }
  });
});
}

// function putMovieInDOM (searchValue){
// 	movieAPI.getMovie(apiKeys,searchValue).then(function(items){
//     console.log("items from movie call in ajaxCalls.js", items);
//     $('#movie-search-results').empty();
//     let newListItem = "<div class='row'>";
//     newListItem += `<div class="col-xs-4"><img src=${items.Poster}/></div>`;
//     newListItem += "<div class='col-xs-8'>";
//     newListItem += `<div class="col-xs-3"><h4>Title: ${items.Title}</h4></div>`;
//     newListItem += `<div class="col-xs-3"><h4>Year Released: ${items.Year}</h4></div>`;
//     newListItem += `<div class="col-xs-3"><h4>Top Actors: ${items.Actors}</h4></div>`;
//     newListItem += `<div class="col-xs-3"><h4>imdb Rating: ${items.imdbRating}</h4></div>`;
//     newListItem += "</div>";
//     newListItem += "</div>";
//     $('#movie-search-results').html(newListItem);
//     $('#movie-name').val("");
//   });
// }

function putMovieInDOM (searchValue){
  movieAPI.getMovie(apiKeys,searchValue).then(function(items){
    console.log("items from movie call in ajaxCalls.js", items);
    $("#movie-search-results").empty();
    let newListItem = `<div><img src=${items.Poster}/></div>`;
      newListItem += `<div><h4>Title: ${items.Title}</h4></div>`;
      newListItem += `<div><h4>imdb Rating: ${items.imdbRating}</h4></div>`;
      newListItem += `<div><h4>Genre: ${items.Genre}</h4></div>`;
      newListItem += `<div><h4>Rating: ${items.Rated}</h4></div>`;
      newListItem += `<div><h4>Year Released: ${items.Released}</h4></div>`;
      newListItem += `<div><h4>Plot: ${items.Plot}</h4></div>`;
      newListItem += `<div><h4>Top Actors: ${items.Actors}</h4></div>`;
      newListItem += `<div><h4>Awards: ${items.Awards}</h4></div>`;
      newListItem += '<button class="btn btn-lg btn-secondary" id="add-to-watch-list">Add To Watch List</button>';
    $('#movie-search-results').append(newListItem);
    $("#movie-name").val("");
    searchResult = items;
   });
 }

function createLogoutButton(){
  FbAPI.getUser(FbAPIKeys,uid).then(function(userResponse){
    $('#logout-container').html('');
    let currentUsername = userResponse.username;
    let logoutButton = `<button class="btn btn-danger" id="logoutButton">LOGOUT ${currentUsername}</button>`;
    $('#logout-container').append(logoutButton);
  });
}

$(document).ready(function(){
	movieAPI.movieCredentials().then(function(keys){
	    apiKeys = keys;
	     console.log("apiKeys",apiKeys );
	     // putMovieInDOM();
	     // firebase.initializeApp(apiKeys);
	});

	FbAPI.firebaseCredentials().then(function(keys){
 	     console.log("FBkeys", keys);
 	     FbAPIKeys = keys;
 	     firebase.initializeApp(FbAPIKeys);
 	     // showMyMovies();
 	   });

	$('#registerButton').on('click',function(){
    let email = $('#inputEmail').val();
    let password = $('#inputPassword').val();
    let username = $('#inputUsername').val();
    let user = {
      "email": email,
      "password": password
   	};
    FbAPI.registerUser(user).then(function(registerResponse){
      console.log("register response",registerResponse);
      let newUser = {
        "username": username,
        "uid": registerResponse.uid
      };
      let uid = registerResponse;
      return FbAPI.addUser(FbAPIKeys, newUser);
    }).then(function(adduserResponse){
      return FbAPI.loginUser(user);
    }).then(function(loginResponse){
      console.log("login response", loginResponse);
      uid = loginResponse.uid;
      createLogoutButton();
      showMyMovies();
      //hide is a bootstrap class
      $('#login-container').addClass("hide");
      $('#movie-search-view').removeClass("hide");
      $('#user-movie-view').removeClass("hide");
    });
  });

  $('#loginButton').on('click',function(){
    let email = $('#inputEmail').val();
    let password = $('#inputPassword').val();
    let user = {
      "email": email,
      "password": password
    };
    FbAPI.loginUser(user).then(function(loginResponse){
      uid = loginResponse.uid;
      createLogoutButton();
      showMyMovies();
      $('#login-container').addClass("hide");
      $('#movie-search-view').removeClass("hide");
      $('#user-movie-view').removeClass("hide");
    });
  });

  $('#logout-container').on('click','#logoutButton',function(){
      FbAPI.logoutUser();
      uid = "";
      $('#incomplete-tasks').html('');
      $('#completed-tasks').html('');
      $('#login-container').removeClass('hide');
      $('#movie-search-view').addClass('hide');
      $('#user-movie-view').addClass('hide');
      $('#inputEmail').val('');
      $('#inputPassword').val('');
      $('#inputUsername').val('');
      $('#inputEmail').focus();
  });

  $('#movie-search-button').on('click',function(){
    console.log('movie-search-button clicked!');
    putMovieInDOM($('#movie-name').val());
  });

  // adds movie to watch database and displays to DOM
  $('#movie-search-results').on('click','#add-to-watch-list',function(){
    console.log("clicked the add movie button");
    console.log(searchResult);
    // let interestArray = $('#interests-text-area').val().split(',');
    // console.log("interest array", interestArray);
    let newMovie = {
      "Poster": `${searchResult.Poster}`,
      "Title": `${searchResult.Title}`,
      "Genre": `${searchResult.Genre}`,
      "Rated": `${searchResult.Rated}`,
      "Released": `${searchResult.Released}`,
      "Plot": `${searchResult.Plot}`,
      "imdbRating": `${searchResult.imdbRating}`,
      "Watched": false,
      "userRating": null,
      "Actors": `${searchResult.Actors}`,
      "Awards": `${searchResult.Awards}`,
      "uid": uid
    };
    console.log("newMovie Object", newMovie);
    FbAPI.addMovieToWatch(FbAPIKeys, newMovie).then(function(){
      showMyMovies();
    });
  });

// deletes movie member from the DB and rewrites the new db to the DOM
  $('#movies-to-watch').on("click", ".delete", function(){
    let itemId = $(this).data("fbid");
    FbAPI.deleteFamilyMember(apiKeys, itemId).then(function(){
      console.log("show the DB of movies in a div");
    });
  });
});
