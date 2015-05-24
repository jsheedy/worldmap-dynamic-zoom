'use strict';

angular.module('worldmapApp')
  .factory('API', function ($resource) {

    var CONFIG = {apiURL: 'http://localhost:5000/'};

    var resourceFactory = function(apiPath) {
      return $resource(CONFIG.apiURL + apiPath, {}, {get: {method: 'GET', cache: true}});
    };

    var methods = {
      Countries: $resource(CONFIG.apiURL + 'country/', {}, {get: {isArray: true, method: 'GET', cache: false}}),
      Country: resourceFactory('country/:id'),
      apiURL: CONFIG.apiURL
    };

    return methods;
  });