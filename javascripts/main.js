"use strict";
let apiKeys = {};
let uid = "";
console.log("jqeury connected");

	function putMovieInDOM (searchValue){
  			movieAPI.getMovie(apiKeys,searchValue).then(function(items){
      			console.log("items from movie call in ajaxCalls.js", items);
		      	let newListItem = "";
		          newListItem+=`<div class="col-xs-8"><h4>${items.name}</h4></div>`;
		          $('.output').append(newListItem);
    });
  }

	function createLogoutButton(){
	  FbAPI.getUser(apiKeys,uid).then(function(userResponse){
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
	     putMovieInDOM();
	     // firebase.initializeApp(apiKeys);
	});

	FbAPI.firebaseCredentials().then(function(keys){
 	     console.log("keys", keys);
 	     apiKeys = keys;
 	     firebase.initializeApp(apiKeys);
 	     // putTodoInDOM();
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
        return FbAPI.addUser(apiKeys, newUser);
      }).then(function(adduserResponse){
        return FbAPI.loginUser(user);
      }).then(function(loginResponse){
        console.log("login response", loginResponse);
        uid = loginResponse.uid;
        createLogoutButton();
        // putTodoInDOM();
        //hide is a bootstrap class
        $('#login-container').addClass("hide");
        $('#todo-container').removeClass("hide");
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
        // putTodoInDOM();
        $('#login-container').addClass("hide");
        $('#todo-container').removeClass("hide");

      });
    });

    
    $('#logout-container').on('click','#logoutButton',function(){
        FbAPI.logoutUser();
        uid = "";
        $('#incomplete-tasks').html('');
        $('#completed-tasks').html('');
        $('#login-container').removeClass('hide');
        $('#todo-container').addClass('hide');
        $('#inputEmail').val('');
        $('#inputPassword').val('');
        $('#inputUsername').val('');
        $('#inputEmail').focus();
    });
 
});
