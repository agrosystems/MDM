//var Intelesant = angular.module("Intelesant", ['LoginService']);
var mdm = angular.module("mdm", ['LoginService']);
mdm.controller('LoginController', function($rootScope, $scope, $log, loginService, $location) {
    $scope.flag = true;
    $scope.user;
    $scope.loginUser = function() {
        alert("User details are " + $scope.user.userName)
        loginService.loginUser($scope.user).success(function(data) {
           $location.path("/dashBoard");
        })

    }


});
mdm.config(function($routeProvider) {
    $routeProvider.when('/dashBoard', {
        templateUrl: 'app/views/LifeStoryAlbumImagesView.html'
//        controller: 'LifeStoryAlbumImagesViewController'


    });
});

