"use strict";
let apiKeys = {};
let FbAPIKeys = {};
let uid = "";
let searchResult = {};

function showMyMovies(){
  FbAPI.oldMovies(FbAPIKeys, uid).then(function(movies){
    $('#movies-to-watch').html('');
    $('#movies-already-viewed').html('');
    movies.forEach(function(movie){
      if(!movie.Watched){
      let newMovieItem = `<div class="card card-outline-success text-xs-center" data-fbid="${movie.id}" data-completed="${movie.Watched}" id='single-movie'>`;
          newMovieItem += "<div class='row'>";
            newMovieItem += "<div class='col-sm-6'>";
              newMovieItem += `<img class="card-img-top" src=${movie.Poster} alt="Card image cap">`;
            // newMovieItem += '<section class="card-block">';
            newMovieItem += "</div>";
            newMovieItem += "<div class='col-sm-6'>";
              newMovieItem += `<h4 class="card-title">${movie.Title}</h4>`;
              newMovieItem += `<p class="card-text">${movie.Plot}</p>`;
            newMovieItem += "</div>";
          newMovieItem += "<div class='row'>";
            newMovieItem += '<button type="button" class="btn btn-primary watched">Watched</button>';
            newMovieItem += '<button type="button" class="btn btn-danger delete">Delete</button>';
          newMovieItem += "</div>";

          // newMovieItem += '</section>';
          newMovieItem += '</div>';
          newMovieItem += '</div>';

        //apend to list
        $('#movies-to-watch').append(newMovieItem);
    }else{
    let newMovieItem = `<div class="card card-outline-success text-xs-center" data-fbid="${movie.id}" data-completed="${movie.watched}" id='single-movie'>`;
        newMovieItem += `<img class="card-img-top" src=${movie.Poster} alt="Card image cap">`;
        newMovieItem += '<section class="card-block" >';
        newMovieItem += `<h4 class="card-title">${movie.Title}</h4>`;
        newMovieItem += `<p class="card-text">${movie.Plot}</p>`;
        console.log(movie.userRating);
        switch(parseInt(movie.userRating)){
          case 1:
            newMovieItem += '<section class="form-group" id="rating-container"><i class="fa fa-star fa-lg" aria-hidden="true"></i></section>';
            break;
          case 2:
            newMovieItem += '<section class="form-group" id="rating-container"><i class="fa fa-star fa-lg" aria-hidden="true"></i><i class="fa fa-star fa-lg" aria-hidden="true"></i></section>';
            break;
          case 3:
            newMovieItem += '<section class="form-group" id="rating-container"><i class="fa fa-star fa-lg" aria-hidden="true"></i><i class="fa fa-star fa-lg" aria-hidden="true"></i><i class="fa fa-star fa-lg" aria-hidden="true"></i></section>';
            break;
          case 4:
            newMovieItem += '<section class="form-group" id="rating-container"><i class="fa fa-star fa-lg" aria-hidden="true"></i><i class="fa fa-star fa-lg" aria-hidden="true"></i><i class="fa fa-star fa-lg" aria-hidden="true"></i><i class="fa fa-star fa-lg" aria-hidden="true"></i></section>';
            break;
          case 5:
            newMovieItem += '<section class="form-group" id="rating-container"><i class="fa fa-star fa-lg" aria-hidden="true"></i><i class="fa fa-star fa-lg" aria-hidden="true"></i><i class="fa fa-star fa-lg" aria-hidden="true"></i><i class="fa fa-star fa-lg" aria-hidden="true"></i><i class="fa fa-star fa-lg" aria-hidden="true"></i></section>';
            break;
          default:
            newMovieItem += '<section class="form-group" id="rating-container"><label for="sel1">RATE YOUR MOVIE</label><select class="form-control" id="star-rating"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></section><button type="button" class="btn btn-success rate">Rate Movie <i class="fa fa-star" aria-hidden="true"></i></button>';
        }
        newMovieItem += '<button type="button" class="btn btn-danger delete">Delete</button>';
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
    let newMovieItem = "<div class='card card-outline-success'>";
      newMovieItem += `<div class="col-sm-4"><img src=${items.Poster}/></div>`;
      newMovieItem += "<div class='col-sm-8'>";
      newMovieItem += `<div><h4 class="text-uppercase">Title:  </h4><p>  ${items.Title}</p></div>`;
      newMovieItem += `<div><h4 class="text-uppercase">imdb Rating:  </h4><p>  ${items.imdbRating}</p></div>`;
      newMovieItem += `<div><h4 class="text-uppercase">Genre:  </h4><p>  ${items.Genre}</p></div>`;
      newMovieItem += `<div><h4 class="text-uppercase">Rating:  </h4><p>  ${items.Rated}</p></div>`;
      newMovieItem += `<div><h4 class="text-uppercase">Year Released:  </h4><p>  ${items.Released}</p></div>`;
      newMovieItem += `<div><h4 class="text-uppercase">Plot:  </h4><p>  ${items.Plot}</p></div>`;
      newMovieItem += `<div><h4 class="text-uppercase">Top Actors:  </h4><p>  ${items.Actors}</p></div>`;
      newMovieItem += `<div><h4 class="text-uppercase">Awards:  </h4><p>  ${items.Awards}</div>`;
      newMovieItem += '<button class="btn btn-lg btn-secondary" id="add-to-watch-list">Add To Watch List</button>';
      newMovieItem += "</div>";
      newMovieItem += "</div>";
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
    let userInfo = `<div><span class="glyphicon glyphicon-user" aria-hidden="true"> </span><h4>Hello ${currentUsername}, welcome back!</h4></div>`;
    $('#user-container').append(userInfo);
  });
}

$(document).ready(function(){

  movieAPI.movieCredentials().then(function(keys){
     apiKeys = keys;
  });

  FbAPI.firebaseCredentials().then(function(keys){
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


  // $('#movie-search-button').on('click',function(){
  //   $('#movie-search-button').button('loading');
  //   console.log('movie-search-button clicked!');
  //   putMovieInDOM($('#movie-name').val());
  //   // simulating a timeout
  //   setTimeout(function () {
  //     $('#movie-search-button').button('reset');
  //   }, 1000);
  // });

  // // adds movie to watch database and displays to DOM
  // $('#movie-search-results').on('click','#add-to-watch-list',function(){
  //   console.log("clicked the add movie button");
  //   console.log(searchResult);
  //   // let interestArray = $('#interests-text-area').val().split(',');
  //   // console.log("interest array", interestArray);
  //   let newMovie = {
  //     "Poster": `${searchResult.Poster}`,
  //     "Title": `${searchResult.Title}`,
  //     "Genre": `${searchResult.Genre}`,
  //     "Rated": `${searchResult.Rated}`,
  //     "Released": `${searchResult.Released}`,
  //     "Plot": `${searchResult.Plot}`,
  //     "imdbRating": `${searchResult.imdbRating}`,
  //     "Watched": false,
  //     "userRating": null,
  //     "Actors": `${searchResult.Actors}`,
  //     "Awards": `${searchResult.Awards}`,
  //     "uid": uid
  //   };
  //   console.log("newMovie Object", newMovie);
  //   FbAPI.addMovieToWatch(FbAPIKeys, newMovie).then(function(){
  //     showMyMovies();
  //   });
  // });

// deletes movie member from the DB and rewrites the new db to the DOM
  $('div').on('click', '.delete', function() {
    let movieToDelete = $(this).closest("div#single-movie");
    let itemId = $(movieToDelete).data("fbid");
    console.log("fbid-delete", itemId);
    console.log("movieToDelete", movieToDelete);
    FbAPI.deleteMovie(FbAPIKeys, itemId).then(function(){
      showMyMovies();
    });
  });

// edits movie's watched status in the DB and rewrites the new db to the DOM
//// click event on the watched button moves card from left list to right list
  $(document).on('click', '.watched', function() {
    let movieWatched = $(this).closest("div#single-movie");
    let itemId = $(movieWatched).data("fbid");
    console.log("fbid-watched", itemId);
    console.log("movieWatched", movieWatched);
    let movie = {};
    FbAPI.oldMovies(FbAPIKeys, uid).then(function(movies){
      let select = movies.filter((index)=>{
        return index.id === itemId;
      });
      movie = select[0];
    let editedMovie = {
      "Poster": `${movie.Poster}`,
      "Title": `${movie.Title}`,
      "Genre": `${movie.Genre}`,
      "Rated": `${movie.Rated}`,
      "Released": `${movie.Released}`,
      "Plot": `${movie.Plot}`,
      "imdbRating": `${movie.imdbRating}`,
      "Watched": true,
      "userRating": null,
      "Actors": `${movie.Actors}`,
      "Awards": `${movie.Awards}`,
      "uid": uid
    };
    FbAPI.editMovie(FbAPIKeys, itemId, editedMovie).then(function(){
      showMyMovies();
    });
  });
});

// edits movie's user rating status in the DB and rewrites the new db to the DOM
//// click event on the rating button moves card from left list to right list
  $(document).on('click', '.rate', function(e) {
    e.preventDefault();
    let movieWatched = $(this).closest("div");
    console.log('movieWatched', movieWatched);
    let starContainer = $(this).siblings('span#starContainer')[0];
    console.log('starContainer', starContainer);
    console.log('trying to log out the userStarRating for the current card being edited.');
    console.log($(movieWatched).children('section.card-block').children('section#rating-container').children('select#star-rating'));
    let starValue = $(movieWatched).children('section.card-block').children('section#rating-container').children('select#star-rating').val();
    console.log(starValue);

    let itemId = $(movieWatched).data("fbid");
    console.log("movieWatched", movieWatched);
    console.log("fbid-userRating", itemId);

    let movie = {};
    FbAPI.oldMovies(FbAPIKeys, uid).then(function(movies){
      let select = movies.filter((index)=>{
        return index.id === itemId;
      });
      movie = select[0];

    let editedMovie = {
      "Poster": `${movie.Poster}`,
      "Title": `${movie.Title}`,
      "Genre": `${movie.Genre}`,
      "Rated": `${movie.Rated}`,
      "Released": `${movie.Released}`,
      "Plot": `${movie.Plot}`,
      "imdbRating": `${movie.imdbRating}`,
      "Watched": true,
      "userRating": starValue,
      "Actors": `${movie.Actors}`,
      "Awards": `${movie.Awards}`,
      "uid": uid
    };

    FbAPI.editMovie(FbAPIKeys, itemId, editedMovie).then(function(){
      showMyMovies();
    });

    });
  });
});