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
        let newMovieItem = `<div class="card card-outline-success text-xs-center" data-completed="${movie.watched}" id='single-movie'>`;
          newMovieItem += `<img class="card-img-top" src=${movie.Poster} alt="Card image cap">`;
          newMovieItem += '<section class="card-block">';
          newMovieItem += `<h4 class="card-title">${movie.Title}</h4>`;
          newMovieItem += `<p class="card-text">${movie.Plot}</p>`;
          newMovieItem += '<button type="button" href="#" class="btn btn-primary watched">Watched</button>';
          newMovieItem += '<button type="button" href="#" class="btn btn-danger delete">Delete</button>';
        newMovieItem += '</section>';
        newMovieItem += '</div>';

    //apend to list
    $('#movies-to-watch').append(newMovieItem);
    }else{
      let newMovieItem = `<div class="card card-outline-success text-xs-center" data-completed="${movie.watched}" id='single-movie'>`;
        newMovieItem += `<img class="card-img-top" src=${movie.Poster} alt="Card image cap">`;
        newMovieItem += '<section class="card-block">';
        newMovieItem += `<h4 class="card-title">${movie.Title}</h4>`;
        newMovieItem += `<p class="card-text">${movie.Plot}</p>`;
        newMovieItem += '<section class="form-group" id="rating-container"><label for="sel1">RATE YOUR MOVIE</label><select class="form-control" id="star-rating"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></section><button type="button" href="#" class="btn btn-success rate">Rate Movie <i class="fa fa-star-o" aria-hidden="true"></i></button>';
        newMovieItem += '<button type="button" href="#" class="btn btn-danger delete">Delete</button>';
        newMovieItem += '</section>';
        newMovieItem += '</div>';
      //apend to list
      $('#movies-already-viewed').append(newMovieItem);
      }
    });
  });
}

function putMovieInDOM (searchValue){
  movieAPI.getMovie(apiKeys,searchValue).then(function(items){
    console.log("items from movie call in ajaxCalls.js", items);
    $("#movie-search-results").empty();
    let newMovieItem = `<div><img src=${items.Poster}/></div>`;
      newMovieItem += `<div><h4>Title: ${items.Title}</h4></div>`;
      newMovieItem += `<div><h4>imdb Rating: ${items.imdbRating}</h4></div>`;
      newMovieItem += `<div><h4>Genre: ${items.Genre}</h4></div>`;
      newMovieItem += `<div><h4>Rating: ${items.Rated}</h4></div>`;
      newMovieItem += `<div><h4>Year Released: ${items.Released}</h4></div>`;
      newMovieItem += `<div><h4>Plot: ${items.Plot}</h4></div>`;
      newMovieItem += `<div><h4>Top Actors: ${items.Actors}</h4></div>`;
      newMovieItem += `<div><h4>Awards: ${items.Awards}</h4></div>`;
      newMovieItem += '<button class="btn btn-lg btn-secondary" id="add-to-watch-list">Add To Watch List</button>';
    $('#movie-search-results').append(newMovieItem);
    $("#movie-name").val("");
    searchResult = items;
   });
 }

function createLogoutButton(){
  FbAPI.getUser(FbAPIKeys,uid).then(function(userResponse){
    $('#logout-container').html('');
    let currentUsername = userResponse.username;
    let logoutButton = `<button class="btn btn-warning" id="logoutButton">LOGOUT ${currentUsername}</button>`;
    $('#logout-container').append(logoutButton);
  });
}

$(document).ready(function(){

  movieAPI.movieCredentials().then(function(keys){
	   apiKeys = keys;
	   console.log("apiKeys",apiKeys );
	});

  FbAPI.firebaseCredentials().then(function(keys){
    console.log("FBkeys", keys);
    FbAPIKeys = keys;
    firebase.initializeApp(FbAPIKeys);
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

/////////////// things below here are NOT WORKING YET ///////////

// deletes movie member from the DB and rewrites the new db to the DOM
  $(document).on('click', '.delete', function() {
    let movieToDelete = $(this).closest("div");
    console.log("movieToDelete", movieToDelete);
    let itemId = $(this).data("fbid");
    FbAPI.deleteMovie(apiKeys, itemId).then(function(){
      showMyMovies();
    });
  });

// edits movie's watched status in the DB and rewrites the new db to the DOM
//// click event on the watched button moves card from left list to right list
  $(document).on('click', '.watched', function() {
    let movieWatched = $(this).closest("div");
    console.log("movieWatched", movieWatched);
    let editedMovie = {
      "Poster": `${searchResult.Poster}`,
      "Title": `${searchResult.Title}`,
      "Genre": `${searchResult.Genre}`,
      "Rated": `${searchResult.Rated}`,
      "Released": `${searchResult.Released}`,
      "Plot": `${searchResult.Plot}`,
      "imdbRating": `${searchResult.imdbRating}`,
      "Watched": true,
      "userRating": null,
      "Actors": `${searchResult.Actors}`,
      "Awards": `${searchResult.Awards}`,
      "uid": uid
    };
    let itemId = $(this).data("fbid");
    FbAPI.editMovie(apiKeys, itemId, editedMovie).then(function(){
      showMyMovies();
    });
  });

// edits movie's user rating status in the DB and rewrites the new db to the DOM
//// click event on the rating button moves card from left list to right list
  $(document).on('click', '.rate', function() {
    let movieWatched = $(this).closest("div");
    console.log("movieWatched", movieWatched);
    let userStarRating = $('#star-rating').val();
    let editedMovie = {
      "Poster": `${searchResult.Poster}`,
      "Title": `${searchResult.Title}`,
      "Genre": `${searchResult.Genre}`,
      "Rated": `${searchResult.Rated}`,
      "Released": `${searchResult.Released}`,
      "Plot": `${searchResult.Plot}`,
      "imdbRating": `${searchResult.imdbRating}`,
      "Watched": true,
      "userRating": userStarRating,
      "Actors": `${searchResult.Actors}`,
      "Awards": `${searchResult.Awards}`,
      "uid": uid
    };
    let itemId = $(this).data("fbid");
    FbAPI.editMovie(apiKeys, itemId, editedMovie).then(function(){
      showMyMovies();
    });
    //hide the rating field and the rate button

    //show a certain number of stars to match their rating
  });

});
