/* *
 * The MIT License
 *
 * Copyright (c) 2015, Patrick Fitzgerald
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

angular.module('ngm.widget.leaflet', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('leaflet', {
        title: 'Leaflet',
        description: 'Displays a Leaflet Map',
        controller: 'leafletCtrl',
        templateUrl: '/scripts/widgets/ngm-leaflet/view.html',
        resolve: {
          data: function(ngmData, config){
            if (config.request){
              return ngmData.get(config.request);
            }
          }
        }
      });
  }).controller('leafletCtrl', [
    '$scope', 
    '$element',
    'leafletMarkersHelpers',
    'leafletData',
    'data', 
    'config',
    function($scope, $element, leafletMarkersHelpers, leafletData, data, config){

      // resets markers to avoid error - https://github.com/tombatossals/angular-leaflet-directive/issues/381
      $scope.$on('$destroy', function () {
        leafletMarkersHelpers.resetMarkerGroups();
      });
    
      // leaflet widget default config
      $scope.leaflet = {
        id: 'ngm-leaflet-' + Math.floor((Math.random()*1000000)),
        height: '320px',
        display: {
          type: 'default',
          geocoder: {
            position: 'topright'
          }
        },
        defaults: {
          controls: {
            layers: {}
          },
          map: {
            fullscreenControl: true,
            scrollWheelZoom: false,
            attributionControl: false
          },          
          center: { lat: 34.5, lng: 66, zoom: 6 },
          tileLayer: 'https://api.mapbox.com/v4/fitzpaddy.b207f20f/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZml0enBhZGR5IiwiYSI6ImNpZW1vcXZiaTAwMXBzdGtrYmp0cDlkdnEifQ.NCI7rTR3PvN4iPZpt6hgKA',

        },
        markers: {},
        layers: {
          baselayers: {
            osm: {
                name: 'Afghanistan',
                type: 'xyz',
                url: 'https://api.mapbox.com/v4/fitzpaddy.b207f20f/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZml0enBhZGR5IiwiYSI6ImNpZW1vcXZiaTAwMXBzdGtrYmp0cDlkdnEifQ.NCI7rTR3PvN4iPZpt6hgKA',
                layerOptions: {
                    continuousWorld: true
                }
            }
          }
        }

      }

      // Merge defaults with config
      $scope.leaflet = angular.merge({}, $scope.leaflet, config);

      if ($scope.leaflet.display.type === 'default') {
        $scope.leaflet.geojson = data;
      } else {
          
        // bounds and marker layer
        $scope.leaflet.bounds = [];
        if (data) {
          $scope.leaflet.markers = data.data;
        }
        

        // get array of bounds
        angular.forEach($scope.leaflet.markers, function(d, key){
          $scope.leaflet.bounds.push([d.lat, d.lng]);
        });
      }

      // set timeout to get map
      setTimeout(function(){
        // perform map actions once map promise retrned
        leafletData.getMap().then(function(map) {

          // 
          $('#ngm-leaflet-modal-pop').click(function(){
            console.log('popup!');
          })          
          
          // map $scope
          $scope.leaflet.map = map;

          // geocode
          if ($scope.leaflet.display.geocoder) {
            // geocoder (Nominatim by default)
            $scope.leaflet.map.addControl(new L.Control.Geocoder({ position: $scope.leaflet.display.geocoder.position }));
          }

          // zoomToBounds
          if ($scope.leaflet.display.zoomToBounds) {
            // zoom here!
            $scope.leaflet.map.fitBounds($scope.leaflet.bounds);
            if ($scope.leaflet.display.zoomCorrection) {
              $scope.leaflet.map.setZoom($scope.leaflet.map.getZoom() + $scope.leaflet.display.zoomCorrection)
            }
          }

        });
      });

    }

  ]);


