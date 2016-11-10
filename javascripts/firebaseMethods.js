"use strict";
var FbAPI = (function(oldFirebase){

	oldFirebase.oldMovies = function(FbAPIKeys, uid){
		return new Promise((resolve, reject) => {
			$.ajax({
				method: 'GET',
				url:`${FbAPIKeys.databaseURL}/movies.json?orderBy="uid"&equalTo="${uid}"`
			}).then((response)=>{
				//turn the object response into an array with this code
				let items = [];
				Object.keys(response).forEach(function(key){
					response[key].id = key;
					items.push(response[key]);
				});
				resolve(items);
			}, (error)=>{
				reject(error);
			});
		});
	};

	oldFirebase.addMovieToWatch = function(FbAPIKeys, newItem){
		return new Promise((resolve, reject) => {
			$.ajax({
				method: 'POST',
				url:`${FbAPIKeys.databaseURL}/movies.json`,
				data: JSON.stringify(newItem),
				dataType: 'json'
			}).then((response)=>{
				console.log("response from post: ",response);
				resolve(response);
			}, (error)=>{
				reject(error);
			});
		});
	};

	oldFirebase.deleteMovie = function(FbAPIKeys, itemId){
		return new Promise((resolve, reject) => {
			$.ajax({
				method: 'DELETE',
				url:`${FbAPIKeys.databaseURL}/movies/${itemId}.json`,
			}).then((response)=>{
				console.log("response from delete: ",response);
				resolve(response);
			}, (error)=>{
				reject(error);
			});
		});
	};

	oldFirebase.editMovie = function(FbAPIKeys, itemId, editedItem){
		return new Promise((resolve, reject) => {
			$.ajax({
				method: 'PUT',
				url:`${FbAPIKeys.databaseURL}/movies/${itemId}.json`,
				data: JSON.stringify(editedItem),
				dataType: 'json'
			}).then((response)=>{
				console.log("response from put: ",response);
				resolve(response);
			}, (error)=>{
				reject(error);
			});
		});
	};

	return oldFirebase;
})(FbAPI || {});
