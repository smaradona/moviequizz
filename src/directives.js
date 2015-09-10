angular.module("ContactsApp")
    .directive('helpOptions', function ($timeout) {
        return {
            restrict: 'E',
            templateUrl: 'views/help-options.html',
            replace: true
        }
    })
    .directive('lost', function ($timeout) {
        return {
            restrict: 'E',
            templateUrl: 'views/lost.html',
            replace: true
        }
    })
    .directive('guessRight', function ($timeout) {
        return {
            restrict: 'E',
            templateUrl: 'views/guess-right.html',
            replace: true
        }
    });