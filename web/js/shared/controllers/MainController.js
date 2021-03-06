'use strict';

angular.module('passerelleFTP.Shared.Controllers.Main',[])
  .controller('MainController', ['$rootScope', '$scope', '$route', '$location', '$routeParams', '$log',
    function ($rootScope, $scope, $route, $location, $routeParams, $log) {
      $scope.$route = $route;
      $scope.$location = $location;
      $scope.$routeParams = $routeParams;
      $scope.ace = AceService;

      // transfert the menu event
      $scope.$on('handleTopAction', function (event, data) {
        $scope.$broadcast('handleAction', data);
      });

      $scope.$on("$routeChangeSuccess", function (event, route) {
        $scope.currentRoute = route;
      });

      var getUserSession = function () {
        if ($sessionStorage.username && $sessionStorage.password) {
          SessionService.login($sessionStorage.username, $sessionStorage.password).then(function () {
            UserService.getInfo({
              username: $sessionStorage.username
            }).then(function (data) {
              $rootScope.loggedUser = {
                name: $sessionStorage.username,
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                etag: data.header.etag
              };
            }, function (error) {
              $rootScope.loggedUser = {};
            });
          });
        }
      };

      //check user session every  minute
      var interval = 60 * 1000;
      var intervalId = setInterval(getUserSession, interval);
      getUserSession();
      WindowActiveService.registerObserverCallback(function () {
        var data = WindowActiveService.isActiveWindow();
        if (data == false) {
          clearInterval(intervalId);
          intervalId = null;
        } else if (intervalId == null) {
          intervalId = setInterval(getUserSession, interval);
          getUserSession();
        }
      });
    }
  ]);