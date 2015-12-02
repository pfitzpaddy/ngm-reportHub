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

'use strict';

angular.module('ngm.widget.leaflet', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('leaflet', {
        title: 'Leaflet',
        description: 'Displays a Leaflet Map',
        controller: 'leafletCtrl',
        templateUrl: 'widgets/ngm-leaflet/view.html',
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
          message: '<div class="count" style="text-align:center">__{ "value": feature.properties.incidents }__</div> cases in __{ "value": feature.properties.district }__' // special format required

        },
        options: {
          group: 'outbreaks',
          zoomToBounds: true

        },        
        defaults: {
          center: { lat: 34.5, lng: 66, zoom: 6 },
          scrollWheelZoom: false,
          attributionControl: false,
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
          },          
          overlays: {
            outbreaks: {
                name: 'Outbreaks',
                type: 'markercluster',
                visible: true,
                layerOptions: {
                    maxClusterRadius: 90
                }
            }
          }          
        },
        getMarkerMessage: function(m, feature){
          
          // form marker message 
          var message = '',
              messageArray = m.split('__');
          
          // parse markermessage to set html
          angular.forEach(messageArray, function(d, i){
            // evaluate html from features
            if( d.search('value') > 0 ){
              message += (eval('(' + d + ')').value);
            } else {
              message += d;
            }
          });

          // return html formatted msg
          return message;

        },

        setMap: function(){

          // Add geojson to map as markers
          switch ($scope.leaflet.display.type) {
            
            // type marker
            case 'marker':
                
              // store markers 
              $scope.leaflet.bounds = [];

              // for each feature
              angular.forEach(data.features, function(feature, key) {

                // markers
                $scope.leaflet.bounds.push([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);

                // create markers
                $scope.leaflet.markers['marker' + key] = {
                  layer: $scope.leaflet.options.group,
                  // group: $scope.leaflet.options.group,
                  lat: feature.geometry.coordinates[1],
                  lng: feature.geometry.coordinates[0],
                  message: $scope.leaflet.getMarkerMessage($scope.leaflet.display.message, feature)
                };

              });

              break;

            default:
              
              // default is geojson
              $scope.leaflet.geojson = {
                data: data
              }
          }

        }

      }

      // Merge defaults with config
      $scope.leaflet = angular.merge({}, $scope.leaflet, config);      

      // set timeout to get map
      setTimeout(function(){
        
        // perform map actions once map promise retrned
        leafletData.getMap().then(function(map) {
          
          // map $scope
          $scope.leaflet.map = map;

          // Set display by display type
          $scope.leaflet.setMap();

          // zoom to bounds
          if($scope.leaflet.options.zoomToBounds && Object.keys($scope.leaflet.markers).length > 0){

            // fit bounds of markers
            $scope.leaflet.map.fitBounds($scope.leaflet.bounds);

          }

        });

      });

    }

  ]);


