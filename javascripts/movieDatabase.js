"use strict";
var movieAPI = (function (movieCall) {

movieCall.getMovie = function (apiKeys, searchValue) {
		return new Promise((resolve, reject) =>{
				// console.log("apiKeys",apiKeys );
				let keyHolder = apiKeys.omdbApi;
				console.log("keyHolder",keyHolder );
			$.ajax({
				method:"GET",
				url:`http://img.omdbapi.com/?i=tt2294629&apikey=109d54fa`
			}).then((response)=>{
				console.log("getMovie response",response );
				let users = [];
				Object.keys(response).forEach(function(key){ // exact code to use every firebase project
					response[key].id = key; //
					users.push(response[key]); //
				});
				resolve(response);
			},(error)=>{
				reject(error);
			});

		});
		
	};
	return movieCall;
})(movieAPI || {});