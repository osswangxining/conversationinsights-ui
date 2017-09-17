var api_endpoint_v2 = '/api/v2';

var app = angular.module('app', ['ngRoute', 'chart.js', 'ngResource', 'ngTagsInput', 'jsonFormatter'])

.controller('app', function($scope, $route, $routeParams, $location) {
     $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;

     $scope.go = function ( path ) {
       $location.path( path );
     };

     $scope.formData = {};
})
