//var Intelesant = angular.module("Intelesant", ['LoginService']);
var myapp = angular.module("myapp", ['UserService']);
myapp.controller('UserController', function($rootScope, $scope, $log, userService, $location) {
    $scope.flag = true;
    $scope.user;
    $scope.registerUser = function() {
        alert("User details are " + $scope.user.name)
        userService.register($scope.user).success(function(data) {
            $scope.flag = false;
            $scope.registeredUser = data;
        })

    }


});
