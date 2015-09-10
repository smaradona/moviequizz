angular.module("ContactsApp")
    .controller("HeaderController", ['$cookies', '$scope', '$location', 'quit', function($cookies, $scope, $location, quit) {
        $scope.exit = function() {
            $cookies = quit($cookies);
            $scope.$parent.lives = 0;
            $scope.$parent.score = 0;
            $location.url('/');
        }
    }])
    .controller("MenuController", ['$cookies', '$scope', '$location', function($cookies, $scope, $location) {
        $scope.play = function() {
            $location.url('/start/');
        }
    }])
    .controller("StartController", ['$cookies', '$scope', '$location', '$http', 'shuffleFilterFilter', 'quit', function($cookies, $scope, $location, $http, shuffleFilterFilter, quit) {
        var wrap = function fetch() {
            if ($cookies.get('score')) {
                $scope.$parent.lives = parseInt($cookies.get('lives'), 10);
                $scope.$parent.score = parseInt($cookies.get('score'), 10);
                $cookies.remove('buttonClicked');
            } else {
                $scope.$parent.score = 0;
                $scope.$parent.lives = 3;
                $cookies.put('score', 0);
                $cookies.put('lives', 3);
                $cookies.remove('buttonClicked');
            }
            $scope.genres = [];
            genres2 = [0, 1, 2, 3, 4, 6, 7, 8, 11, 14, 15, 17];
            shuffleFilterFilter(genres2);
            $http.get("http://api.themoviedb.org/3/genre/movie/list?api_key=452536b52f0b5d1dc33ff67d182a1223").success(function(response){
                for(i=0; i < 5; i++) {          
                    $scope.genres.push(response.genres[genres2[i]]);            
                }
            });
        };

        $scope.select = function(id, name) {
            $cookies.put('genreId', id);
            $cookies.put('genreName', name);
            $location.url('/genre/');
        }

        wrap();
    }])
    .controller("YearController", ['$cookies', '$scope', '$location', '$http', 'yearFilterFilter', function($cookies, $scope, $location, $http, yearFilterFilter) {
        $scope.years = [];
        $scope.genreName = $cookies.get('genreName');
        $scope.$parent.score = parseInt($cookies.get('score'), 10);
        $scope.$parent.lives = parseInt($cookies.get('lives'), 10);
        var page = Math.floor(Math.random() * (100 - 1)) + 1;
        $http.get("http://api.themoviedb.org/3/genre/" + $cookies.get('genreId') + "/movies?api_key=452536b52f0b5d1dc33ff67d182a1223&page=" + page).success(function(response){
            for(i = 0; i < 5; i++) {
                $scope.years.push(response.results[i]);
            }
        });

        $scope.select = function(id, year) {

            $cookies.put('movieId', id);
            $cookies.put('movieYear', yearFilterFilter(year));
            $location.url('/movie/');
        }

    }])
    .controller("MovieController", ['$cookies', '$scope', '$location', '$http', 'shuffleFilterFilter', 'quit', function($cookies, $scope, $location, $http, shuffleFilterFilter, quit) {
        $scope.helps = [];
        $scope.helpMe = true;
        $scope.movie;
        $scope.guess;
        $scope.hint = true;
        $scope.show = true;
        $scope.genreName = $cookies.get('genreName');
        $scope.movieYear = $cookies.get('movieYear');
        $scope.nextQuestion = false;
        $scope.$parent.score = parseInt($cookies.get('score'), 10);
        $scope.$parent.lives = parseInt($cookies.get('lives'), 10);
        var page = Math.floor(Math.random() * (100 - 1)) + 1;
        $http.get("http://api.themoviedb.org/3/movie/" + $cookies.get('movieId') + "?api_key=452536b52f0b5d1dc33ff67d182a1223").success(function(response){
                $scope.movie = response;
                $scope.selectorChecker();
        });
        $scope.guessChecker = function(guess) {
            if(!! $scope.movie.title) {
                if(guess.toUpperCase() === $scope.movie.title.toUpperCase()){
                    $cookies.put('points', 200);
                    $scope.nextQuestion = true;
                    $scope.guess = true;
                    $cookies.put('score', $scope.score);
                    $scope.helpMe = false;
                }   
            }
            
        }

        $scope.showOptions = function() {
            $scope.show = false;
            $scope.helpMe = false;
            var options;
            $http.get("http://api.themoviedb.org/3/movie/" + $cookies.get('movieId') + "/similar?api_key=452536b52f0b5d1dc33ff67d182a1223").success(function(response){
                if(response.total_results > 5) {
                    for(i = 0; i < 4; i++) {
                        $scope.helps.push(response.results[i]);
                    }
                    $scope.helps.push($scope.movie);
                    shuffleFilterFilter($scope.helps);
                } else {
                    $http.get("http://api.themoviedb.org/3/genre/" + $cookies.get('genreId') + "/movies?api_key=452536b52f0b5d1dc33ff67d182a1223").success(function(response){
                        for(i = 0; i < 4; i++) {
                            $scope.helps.push(response.results[i]);
                        }
                        $scope.helps.push($scope.movie);
                        shuffleFilterFilter($scope.helps);
                    });
                }
            });
        }
        $scope.select = function(id) {
            if(typeof $cookies.get('buttonClicked') === "undefined") {
                $scope.idSelectedOption = null;
                $cookies.put('selectId', id);
                if(parseInt($cookies.get('selectId')) === $scope.movie.id){
                    $scope.idCorrectOption = parseInt($cookies.get('selectId'));
                    $cookies.put('points', 50);
                } else {
                    $cookies.put('lives', $cookies.get('lives') - 1);
                    $scope.$parent.lives--;
                    $cookies.put('points', 0);
                    $scope.idIncorrectOption = parseInt($cookies.get('selectId'));
                    $scope.idCorrectOption = $scope.movie.id;
                }
                $cookies.put('buttonClicked', true);
                if($scope.$parent.lives !== 0) {
                    $scope.nextQuestion = true;
                } else {
                    $scope.lost = true;
                    $scope.hint = false;
                }
            } else {
                if(parseInt($cookies.get('selectId')) === $scope.movie.id){
                    $scope.idCorrectOption = $cookies.get('selectId');
                } else {
                    $scope.idIncorrectOption = parseInt($cookies.get('selectId'));
                    $scope.idCorrectOption = $scope.movie.id;
                }
                $scope.nextQuestion = true;
            }
        }
        $scope.selectorChecker = function() {
            if(typeof $cookies.get('buttonClicked') !== "undefined") {
                $scope.showOptions();
                $scope.select(parseInt($cookies.get('selectId')));
            }
        }
        $scope.nextTrivia = function() {
            $cookies.remove("genreId");
            $cookies.remove("movieId");
            $cookies.remove('buttonClicked');
            var score = $scope.$parent.score + parseInt($cookies.get('points'));
            $cookies.put('score', score);
            $location.url('/start/');
        }
        
        $scope.exit = function() {
            $cookies = quit($cookies);
            $scope.$parent.lives = 0;
            $scope.$parent.score = 0;
            $location.url('/');
        }
    }]);
