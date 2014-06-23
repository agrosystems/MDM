'use strict';
angular.module("UserService", []).
        factory('userService', function($http) {
            return {
                register: function(data) {
                    console.log(data);
                    return $http.post('/mdm/user/register', data)
                }
            }
        });