//var Intelesant = angular.module("Intelesant", ['LoginService']);
var mdm = angular.module("mdm", ['LoginService']);
mdm.controller('LoginController', function($rootScope, $scope, $log, loginService, $location) {
    $scope.flag = true;
    $scope.user="";
    console.log("inside login controller user object is "+$scope.user);
    $scope.loginUser = function() {
        loginService.loginUser($scope.user).success(function(data) {
            console.log("returned data is " + data);
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

