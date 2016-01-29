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
        templateUrl: 'widgets/ngm-highchart/view.html'
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
        chart: {},
        title: 'Incidents',
        element: $element,
        display: {
          label: false,
          subLabel: false,
          width: angular.element($element).parent().width() + 'px',
          top: '90px',
          left: '-'+$('.card-panel').css('padding'),
          subLabelTop: '120px',
          filter: 'number',
          duration: 1,          
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
            }
          }],
          func: function(chart) {

            // set highchart to scope
            $scope.highchart.chart = chart;
            
          }
        },

        // make a request for each HighChart series
        update: function(){

          // values for labels
          var val,
              label;

          // For each series, make request
          angular.forEach($scope.highchart.chartConfig.series, function(series, key){
            
            // if no request object, treat as static chart
            if ( !$.isEmptyObject(series.request) ) {
              ngmData.get(series.request).then(function(data) {

                // set data with options.foo to enable animation
                $scope.highchart.chartConfig.series[key].data = data;
                $scope.highchart.chartConfig.options.foo = Math.random();
                // redraw
                // $scope.highchart.chart.redraw();

                // set labels
                if ($scope.highchart.display.label) {
                  $scope.highchart.display.label = data[0].y.toFixed(1);
                  $scope.highchart.display.subLabel = data[0].label;
                }

              });
            } else {

              // set labels
              if ($scope.highchart.display.label) {
                  $scope.highchart.display.label = series.data[0].y.toFixed(1);
                  $scope.highchart.display.subLabel = series.data[0].label;
              }

            }

          });

        }        

      };

      // Merge defaults with config
      $scope.highchart = angular.merge({}, $scope.highchart, config);

      // set data
      $scope.highchart.update();

      // capture resize event
      if ($scope.highchart.display.label) {
        angular.element($(window)).bind('resize', function() {
          // resize label
          $scope.highchart.display.width = angular.element($element).parent().width() + 'px';
          $('#label-' + $scope.highchart.id).css('width', $scope.highchart.display.width);
          $('#subLabel-' + $scope.highchart.id).css('width', $scope.highchart.display.width);
        });
      }

  }

]);


