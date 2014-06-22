'use strict';
angular.module("LoginService", []).
        factory('loginService', function($http) {
            return {
                loginUser: function(data) {
                    var user = data;
                    return $http({
                        method: 'get',
                        url: '/mdm/userLogin/validateUser',
                        params: {
                            userName: user.userName,
                            password: user.password,
                        },
                        async: false
                    });
                }
            }
        });