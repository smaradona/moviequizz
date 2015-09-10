angular.module("ContactsApp")
	.filter("labelCase", function(){
		return function(input) {
			input = input.replace(/([A-Z])/g, ' $1');
			return input[0].toUpperCase() + input.slice(1);
		}
	})
	.filter("yearFilter", function(){
		return function(input) {
			if (!! input) {
				return input.substr(0, 4);
			}
		}
	})
	.filter("overviewFilter", function(){
		return function(input) {
			if (!! input) {
				return input.substr(0, 300).concat("...");
			}
		}
	})
	.filter("titleFilter", function(){
		return function(overview, title) {
			if (!! overview) {
				if(overview.indexOf(title) > -1) {
					return overview.replace(title, "*****");
				} else {
					return overview;
				}
			}
		}
	})
	.filter('keyFilter', function () {
		return function (obj, query) {
			var result = {};
			angular.forEach(obj, function (val, key) {
				if (key !== query) {
					result[key] = val;
				}
			});

			return result;
		}
	})
	.filter('shuffleFilter', function () {
		return function (array) {
		  var currentIndex = array.length, temporaryValue, randomIndex ;

		  // While there remain elements to shuffle...
		  while (0 !== currentIndex) {

		    // Pick a remaining element...
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;

		    // And swap it with the current element.
		    temporaryValue = array[currentIndex];
		    array[currentIndex] = array[randomIndex];
		    array[randomIndex] = temporaryValue;
		  }

		  return array;
		}
	});