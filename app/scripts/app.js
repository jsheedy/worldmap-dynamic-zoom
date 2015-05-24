'use strict';

/**
 * @ngdoc overview
 * @name worldmapApp
 * @description
 * # worldmapApp
 *
 * Main module of the application.
 */
angular
  .module('worldmapApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'leaflet-directive'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
  });
