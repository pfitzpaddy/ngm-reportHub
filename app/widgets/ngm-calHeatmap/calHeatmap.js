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

angular.module('ngm.widget.calHeatmap', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('calHeatmap', {
        title: 'Calendar Heatmap Panel',
        description: 'Displays a Calendar of Indicators',
        controller: 'calHeatmapCtrl',
        templateUrl: 'widgets/ngm-calHeatmap/view.html',
        resolve: {
          data: function(ngmData, config){
            if (config.request){
              return ngmData.get(config.request);
            }
          }
        }
      });
  }).controller('calHeatmapCtrl', [
    '$scope', 
    '$element',
    '$timeout',
    'data', 
    'config',
    function($scope, $element, $timeout, data, config){

      // statistics widget default config
      $scope.calHeatmap = {
        options: {
          itemName: 'case',
          start: new Date(moment().subtract(1, 'years')),
          maxDate: new Date(),
          range: 12,
          domain: 'month',
          subDomain: 'day',
          cellPadding: 2,
          cellSize: 10,
          tooltip: true,
          weekStartOnMonday: false,
          legend: [20, 40, 60, 80],
          label: {
            position: 'top'
          },
          data: data.data,
          subDomainTitleFormat: {
            filled: "<div class='count'>{count}</div> {name} on {date}"
          },
          domainLabelFormat: function(label){
            // format month names
            var display = moment(label).format('MMM');
            return display;
          },
          onComplete: function() {
            
            // Set 'day' labels for calendar heatmap
            if($scope.calHeatmap.display.dayLabel) {
              $scope.calHeatmap.display.setDayLabel();
            }
            // Set 'year' labels for calendar heatmap
            if($scope.calHeatmap.display.yearLabel) {
              $scope.calHeatmap.display.setYearLabel();
            }
          }
        },
        display: {

          dayLabel: true,

          yearLabel: true,

          setDayLabel: function(){

            // offset to cater for year labels
            var yOffset = parseFloat(d3.select('.graph').select('.graph-subdomain-group').attr('y')) + 5;
            var offset = $scope.calHeatmap.options.cellSize + $scope.calHeatmap.options.cellPadding;

            // enables rendering
            $timeout(function(){

              // Update container width
              d3.select('.cal-heatmap-container')
                .attr('width', parseFloat(d3.select('.cal-heatmap-container').attr('width')) + offset);

              // Monday
              d3.select('.graph')
                .append('text')
                  .attr('class', 'graph-secondary-label')
                  .attr('y', yOffset + offset)
                  .attr('x', 0)
                  .attr('dominant-baseline', 'middle')
                  .text('M');

              // Wednesday
              d3.select('.graph')   
                .append('text')
                  .attr('class', 'graph-secondary-label')
                  .attr('y', yOffset + (offset)*3)
                  .attr('x', 0)
                  .attr('dominant-baseline', 'middle')
                  .text('W');

              // Friday
              d3.select('.graph')   
                .append('text')
                  .attr('class', 'graph-secondary-label')
                  .attr('y', yOffset + (offset)*5)
                  .attr('x', 0)
                  .attr('dominant-baseline', 'middle')
                  .text('F');

              // Select and update all calendar blocks to allow for day labels
              d3.select('.graph').selectAll('.graph-domain').each(function(d,i) {
                // select svg calendar block
                var svg = d3.select(this);
                svg.attr('x', parseFloat(svg.attr('x')) +  offset);
                svg.attr('width', parseFloat(svg.attr('width')) +  offset);
              });

              // update cal graph legend
              d3.select('.graph-legend')
                .attr('x', parseInt(d3.select('.graph-legend').attr('x')) + offset);              

            }, 500);

          },

          // adds a year label on month calendar
          setYearLabel: function(){

            // offset to cater for year labels
            var offset = $scope.calHeatmap.options.cellSize + $scope.calHeatmap.options.cellPadding;

            // enable rendering
            $timeout(function(){

              // Select all the calendar elements
              d3.select('.graph').selectAll('.graph-domain').each(function(d,i) { 

                // select svg calendar block
                var svg = d3.select(this);

                // if its the first month of the year append year label
                if( svg.attr('class').search(' m_1 ') !=-1 ){

                  // Highlight month of Jan label
                  svg.select('.graph-label').attr('class', 'graph-title');

                  // update cal graph position
                  d3.select('.graph')
                    .attr('y', offset);

                  // update cal graph legend
                  d3.select('.graph-legend')
                    .attr('y', parseInt(d3.select('.graph-legend').attr('y')) + offset);

                  // update year label
                  d3.select('.cal-heatmap-container')
                    .attr('height', parseInt(d3.select('.cal-heatmap-container').attr('height')) + offset)
                      .append('text')
                      .attr('class', 'graph-primary-label')
                      .attr('width', 100)
                      .attr('height', 100)
                      .attr('y', 10)
                      .attr('x', parseFloat(svg.attr('x')) + (parseFloat(svg.attr('width')/4)) )
                      .attr('dominant-baseline', 'middle')
                      .text(svg.attr('class').substr(-4));

                }

              });

            }, 600)

          }

        }
      };

      // Merge defaults with config
      $scope.calHeatmap = angular.merge({}, $scope.calHeatmap, config);

      // Assign data to calHeatmap
      var cal = new CalHeatMap();
      cal.init($scope.calHeatmap.options);

    }
]);


