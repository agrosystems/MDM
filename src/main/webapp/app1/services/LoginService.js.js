'use strict';
angular.module("LoginService", []).
        factory('loginService', function($http) {
            return {
                loginUser: function(data) {
                    return $http.post('/mdm/userLogin/validateUser', data)
                }
            }
        });
        