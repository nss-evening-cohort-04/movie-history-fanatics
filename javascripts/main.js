"use strict";
let apiKeys = {};
console.log("jqeury connected");

	    function putMovieInDOM (searchValue){
  			movieAPI.movieCredentials(apiKeys,searchValue).then(function(items){
      			console.log("items from movie call in ajaxCalls.js", items);
		      	let newListItem = "";
		          newListItem+=`<div class="col-xs-8"><h4>${items.name}</h4></div>`;
		          $('.output').append(newListItem);
    });
  }


$(document).ready(function(){ 
	 movieAPI.movieCredentials().then(function(keys){
	    apiKeys = keys;
	    console.log("apiKeys",apiKeys );
	    putMovieInDOM();
	    // firebase.initializeApp(apiKeys);
  });
});