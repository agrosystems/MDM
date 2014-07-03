'use strict';
angular.module("LoginService", []).
        factory('loginService', function($http) {
            return {
                loginUser: function(data) {
                    return $http({
                    method: 'POST', 
                    url: '/mdm/userLogin/validateUser',
                        data: data,
                });
//                    return $http.post('/mdm/userLogin/validateUser', data)
                }
            }
        });
        