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
    'leaflet-directive',
    'httpu.caches'
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
  })
  .factory('LZStringSerializer', function($window) {
    return {
       stringify: function(obj) {
         return $window.LZString.compress(JSON.stringify(obj));
       },
       parse: function(str) {
         return JSON.parse($window.LZString.decompress(str));
       }
    };
  })
  .run(function($http, huCacheSerializableFactory) {
      var cache = huCacheSerializableFactory('myCache', {
        maxLength: 4.5 * 1024 * 1024, // 1MB of compressed chars
        maxAge: 86400 * 1000 * 7,
        serializer: 'LZStringSerializer',
        storageMode: 'localStorage'
      });
      $http.defaults.cache = cache;
    });


