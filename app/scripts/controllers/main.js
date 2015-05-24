'use strict';

angular.module('worldmapApp')
  .controller('MainCtrl', function ($scope, leafletBoundsHelpers, leafletData, API) {
    $scope.center = {
      lat: 20,
      lng: -60,
      zoom: 4
    };
    $scope.layers = {};
    $scope.cache = {};

    var bounds = leafletBoundsHelpers.createBoundsFromArray([
              [ 0, 0 ],
              [ 0, 0 ]
          ]);

    angular.extend($scope, {
      bounds : bounds
    });

    var addFeature = function(id) {
      if($scope.layers[id]) {
        // map.removeLayer($scope.layers[id]);
        // delete $scope.layers[id];
      } else {
        var style = {color: '#000', fillColor: '#000', fillOpacity: 0.1, weight: 1.0 };
        var country = API.Country.get({id: id}, function() {
          leafletData.getMap('map').then(function(map) {
            $scope.layers[id] = L.geoJson(country, {style: style}).addTo(map);
          });
        });
      }
    };

    var update = function() {
      leafletData.getMap('map').then(function(map) {

        var bbox = [
          $scope.bounds.southWest.lng,
          $scope.bounds.southWest.lat,
          $scope.bounds.northEast.lng,
          $scope.bounds.northEast.lat,
        ];

        $scope.countries = API.Countries.get({bbox:bbox}, function(){
          angular.forEach($scope.countries, function(country) {
            addFeature(country[0]);
          });
        });
      });

    };
    $scope.$watch('center', update, true);
  });
