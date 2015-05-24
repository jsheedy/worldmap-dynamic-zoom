'use strict';

/**
 * @ngdoc function
 * @name worldmapApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the worldmapApp
 */
angular.module('worldmapApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
