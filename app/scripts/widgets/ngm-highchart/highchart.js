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

angular.module('ngm.widget.highchart', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('highchart', {
        title: 'Highcharts Panel',
        description: 'Displays a Highcharts chart',
        controller: 'highchartCtrl',
        templateUrl: '/scripts/widgets/ngm-highchart/view.html'
      });
  }).controller('highchartCtrl', [
    '$scope',
    '$filter',
    '$element',
    'config',
    'ngmData',
    function($scope, $filter, $element, config, ngmData){

      // statistics widget default config
      $scope.highchart = {
        id: config.id ? config.id : 'ngm-highchart-' + Math.floor((Math.random()*1000000)),
        align: 'middle',
        title: {
          align: 'left',
					text: 'Incidents',
					style: 'line-height: 1.0'
        },
        templateUrl: '/scripts/widgets/ngm-highchart/template/default.html',
        label: {
          defaults: {
            duration: 1,
            filter: 'number',
            fractionSize: 0,
            postfix: '',
            prefix: '',
            from: 0,
            label: false,            
          },
          left: {},
          center: {},
          right: {}
        },
        chartConfig: {
          options: {
            chart: {
              type: 'line'
            },
            exporting: {
              enabled: false
            }            
          },
          credits: {
            enabled: false
          },
          series: [{
            states:{
              hover:{
                enabled: false
              }
						},
						data:[]
          }],
          func: function(chart) {

            // set highchart to scope
            $scope.highchart.chart = chart;
            
          }
        },

        // set defaults
        setDefaults: function() {
          // merge label defaults
          // left
          $scope.highchart.label.left.label = angular.merge({}, $scope.highchart.label.left.label, $scope.highchart.label.defaults);
          $scope.highchart.label.left.subLabel = angular.merge({}, $scope.highchart.label.left.subLabel, $scope.highchart.label.defaults);
          // center
          $scope.highchart.label.center.label = angular.merge({}, $scope.highchart.label.center.label, $scope.highchart.label.defaults);
          $scope.highchart.label.center.subLabel = angular.merge({}, $scope.highchart.label.center.subLabel, $scope.highchart.label.defaults);
          // right
          $scope.highchart.label.right.label = angular.merge({}, $scope.highchart.label.right.label, $scope.highchart.label.defaults);
          $scope.highchart.label.right.subLabel = angular.merge({}, $scope.highchart.label.right.subLabel, $scope.highchart.label.defaults);
          
        },

        // make a request for each HighChart series
        update: function(){

          // For each series, make request
          angular.forEach($scope.highchart.chartConfig.series, function(series, key){
            
            // if no request object, treat as static chart
            if ( !$.isEmptyObject(series.request) ) {

              // make request
              ngmData.get(series.request).then(function(data) {

                // set data with options.foo to enable animation
                $scope.highchart.chartConfig.series[key].data = data.data;
                $scope.highchart.chartConfig.options.foo = Math.random();

                // set labels
                $scope.highchart.label = angular.merge({}, $scope.highchart.label, data.label);

              });

            } else if ( series.data.label ) {

              // set labels & data
              $scope.highchart.label = angular.merge({}, $scope.highchart.label, series.data.label);
              $scope.highchart.chartConfig.series[key].data = series.data.data;

            }

          });

        }        

      };

      // set defaults
      $scope.highchart.setDefaults();

      // Merge defaults with config
      $scope.highchart = angular.merge({}, $scope.highchart, config);

      // set data
      $scope.highchart.update();

  }

]);


