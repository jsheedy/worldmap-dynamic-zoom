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

    function onEachFeature(feature, layer) {
      leafletData.getMap('map').then(function(map) {

        layer.on('mouseover mousemove', function(e){
          var hover_bubble = new L.Rrose({ offset: new L.Point(0,-10), closeButton: false, autoPan: false })
            .setContent(feature.properties.name)
            .setLatLng(e.latlng)
            .openOn(map);
        });
        layer.on('mouseout', function(e){ map.closePopup() });
      });
    }


    var addFeature = function(id) {
      if($scope.layers[id]) {
        // map.removeLayer($scope.layers[id]);
        // delete $scope.layers[id];
      } else {
        var country = API.Country.get({id: id}, function() {
          leafletData.getMap('map').then(function(map) {
            var layer = L.geoJson(country, {
              onEachFeature: onEachFeature,
              style: function(feature) {
                return {
                  fillColor: 'rgb('
                    + parseInt(Math.random() * 255) + ','
                    + parseInt(Math.random() * 255) + ','
                    + parseInt(Math.random() * 255)
                    + ')',
                  color: '#000',
                  fillOpacity: 0.5,
                  weight: 1.0 };
              }
            })
            $scope.layers[id] = layer;
            layer.addTo(map);
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
