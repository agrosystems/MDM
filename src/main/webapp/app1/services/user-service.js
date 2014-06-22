'use strict';
angular.module("UserService", []).
        factory('userService', function($http) {
            return {
                
                register: function(data) {
                    return $http({
                        method: 'get',
                        url: '/mdm/user/register?'+data,
                        
                        async: false
                    });
                }
            }
        });