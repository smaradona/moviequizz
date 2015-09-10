angular.module("ContactsApp", ['ngRoute', 'ngResource', 'ngMessages', 'ngCookies'])
	.config(function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				controller: 'MenuController',
				templateUrl: 'views/menu.html'
			})
			.when('/start', {
				controller: 'StartController',
				templateUrl: 'views/start.html'
			})
			.when('/genre/', {
				controller: 'YearController',
				templateUrl: 'views/year.html'
			})
			.when('/movie/', {
				controller: 'MovieController',
				templateUrl: 'views/movie.html'
			})
			.when('/contact/:id', {
				controller: 'SingleController',
				templateUrl: 'views/single.html'
			})
		$locationProvider.html5Mode(true);
	});