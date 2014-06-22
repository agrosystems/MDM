'use strict';
angular.module("UserService", []).
        factory('userService', function($http) {
            return {
                
                register: function(data) {
                    return $http({
                        method: 'get',
                        url: '/mailapp/user/register?'+data,
                        
                        async: false
                    });
                }
            }
        });