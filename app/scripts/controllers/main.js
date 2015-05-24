'use strict';

angular.module('worldmapApp')
  .controller('MainCtrl', function ($scope, leafletBoundsHelpers, leafletData, API) {
    $scope.center = {
      lat: 20,
      lng: -60,
      zoom: 4
    };

    $scope.defaults = {
      maxZoom: 18
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
      var zoom = $scope.center.zoom;
      if($scope.layers[id] && $scope.layers[id].zoom >= zoom) {
        // do nothing, we have higher resolution data already
      } else {
        leafletData.getMap('map').then(function(map) {
          var country = API.Country.get({id: id, zoom: zoom}, function() {
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
            if($scope.layers[id]) {
              map.removeLayer($scope.layers[id].layer);
            }
            layer.addTo(map);
            $scope.layers[id] = {layer: layer, zoom: zoom};
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
    $scope.$watch('bounds', update, true);
  });
