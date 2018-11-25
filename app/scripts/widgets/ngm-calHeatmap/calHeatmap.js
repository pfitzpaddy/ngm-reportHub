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

angular.module('ngm.widget.calHeatmap', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('calHeatmap', {
        title: 'Calendar Heatmap Panel',
        description: 'Displays a Calendar of Indicators',
        controller: 'calHeatmapCtrl',
        templateUrl: '/scripts/widgets/ngm-calHeatmap/view.html',
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

      // unique id
      var id = 'ngm-cal-heatmap-' + Math.floor((Math.random()*1000000));
			$scope.sum= function(data){
				var getValue = (Object.values(data));				
				temp = 0;
        for (i = 0; i < getValue.length; i++) { 
          temp = getValue[i] + temp;
        }
				return temp;
			}
      // statistics widget default config
      $scope.calHeatmap = {
        id: id,
        options: {
          itemSelector: '#' + id,
          itemName: 'case',
          start: new Date(moment().subtract(1, 'years')),
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
          data: data && data.data ? data.data : {},
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

            // select svg
            var svg = d3.select($scope.calHeatmap.options.itemSelector);

            // offset to cater for year labels
            var yOffset = parseFloat(svg.select('.graph').select('.graph-subdomain-group').attr('y')) + 5;
            var offset = $scope.calHeatmap.options.cellSize + $scope.calHeatmap.options.cellPadding;

            // enables rendering
            $timeout(function(){

              // Update container width
              svg
                .select('.cal-heatmap-container')
                .attr('width', parseFloat(svg.select('.cal-heatmap-container').attr('width')) + offset);

              // Monday
              svg
                .select('.graph')
                .append('text')
                  .attr('class', 'graph-secondary-label')
                  .attr('y', yOffset + offset)
                  .attr('x', 0)
                  .attr('dominant-baseline', 'middle')
                  .text('M');

              // Wednesday
              svg
                .select('.graph')   
                .append('text')
                  .attr('class', 'graph-secondary-label')
                  .attr('y', yOffset + (offset)*3)
                  .attr('x', 0)
                  .attr('dominant-baseline', 'middle')
                  .text('W');

              // Friday
              svg
                .select('.graph')   
                .append('text')
                  .attr('class', 'graph-secondary-label')
                  .attr('y', yOffset + (offset)*5)
                  .attr('x', 0)
                  .attr('dominant-baseline', 'middle')
                  .text('F');

              // Select and update all calendar blocks to allow for day labels
              svg
                .select('.graph')
                .selectAll('.graph-domain').each(function(d,i) {
                
                  // select svg calendar block
                  var graph = d3.select(this);
                      graph.attr('x', parseFloat(graph.attr('x')) +  offset);
                      graph.attr('width', parseFloat(graph.attr('width')) +  offset);
                });

              // update cal graph legend
              svg
                .select('.graph-legend')
                .attr('x', parseInt(svg.select('.graph-legend').attr('x')) + offset);              

            }, 500);

          },

          // adds a year label on month calendar
          setYearLabel: function(){

            // offset to cater for year labels
            var svg = d3.select($scope.calHeatmap.options.itemSelector);
            var offset = $scope.calHeatmap.options.cellSize + $scope.calHeatmap.options.cellPadding;

            // enable rendering
            $timeout(function(){

              // Select all the calendar elements
              svg
                .select('.graph').selectAll('.graph-domain').each(function(d,i) { 

                // select svg calendar block
                var graph = d3.select(this);

                // if its the first month of the year append year label
                if( graph.attr('class').search(' m_1 ') !=-1 ){

                  // Highlight month of Jan label
                  graph.select('.graph-label').attr('class', 'graph-title');

                  // update cal graph position
                  svg
                    .select('.graph')
                    .attr('y', offset);

                  // update cal graph legend
                  svg
                    .select('.graph-legend')
                    .attr('y', parseInt(d3.select('.graph-legend').attr('y')) + offset);

                  // update year label
                  svg
                    .select('.cal-heatmap-container')
                    .attr('height', parseInt(d3.select('.cal-heatmap-container').attr('height')) + offset)
                      .append('text')
                      .attr('class', 'graph-primary-label')
                      .attr('width', 100)
                      .attr('height', 100)
                      .attr('y', 10)
                      .attr('x', parseFloat(graph.attr('x')) + (parseFloat(graph.attr('width')/4)) )
                      .attr('dominant-baseline', 'middle')
                      .text(graph.attr('class').substr(-4));

                }

              });

            }, 600)

          }

		    },
		    dataLength: data && data.data ? $scope.sum(data.data) : 0,
      };
      
      // Merge defaults with config
      $scope.calHeatmap = angular.merge({}, $scope.calHeatmap, config);

      // Assign data to calHeatmap
      var cal = new CalHeatMap();

      // wait for element exists
      var waitForEl = function(selector, callback) {
        if (d3.select(selector)[0][0]) {
          callback();
        } else {
          setTimeout(function() {
            waitForEl(selector, callback);
          }, 20);
        }
      };

      // wait for cal-heatmap element exists
      waitForEl($scope.calHeatmap.options.itemSelector, function() {
        cal.init($scope.calHeatmap.options);
      });

    }
]);


