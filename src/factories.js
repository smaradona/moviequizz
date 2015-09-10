angular.module('ContactsApp')
    .factory('quit', function(){
        return function(cookies) {
            cookies.remove('lives');
            cookies.remove('score');
            return cookies;
        }
    });