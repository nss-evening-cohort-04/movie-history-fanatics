"use strict";
var movieAPI = (function () {

	return{
		movieCredentials: function(){
			return new Promise ((resolve,reject) => {
				// FIRST AJAX TO GET KEYS
				$.ajax({
					method: "GET",
					url: "data/apiKeys.json"
				}).then((response) =>{
					// console.log("response",response);
					resolve(response);
				});
			});
		}
	};

})();