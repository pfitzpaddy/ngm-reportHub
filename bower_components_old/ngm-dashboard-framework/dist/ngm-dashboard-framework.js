(function(window, undefined) {'use strict';
/*
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
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



angular.module('ngm', ['ngm.provider'])
  .value('ngmTemplatePath', '../src/templates/')
  .value('rowTemplate', '<ngm-dashboard-row row="row" ngm-model="ngmModel" options="options" edit-mode="editMode" ng-repeat="row in column.rows" />')
  .value('columnTemplate', '<ngm-dashboard-column column="column" ngm-model="ngmModel" options="options" edit-mode="editMode" ng-repeat="column in row.columns" />')
  .value('ngmVersion', '0.3.8');

/*
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
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * @ngdoc directive
 * @name ngm.directive:ngmDashboard
 * @element div
 * @restrict EA
 * @scope
 * @description
 *
 * `ngmDashboard` is a directive which renders the dashboard with all its
 * components. The directive requires a name attribute. The name of the
 * dashboard can be used to store the model.
 *
 * @param {string} name name of the dashboard. This attribute is required.
 * @param {boolean=} editable false to disable the editmode of the dashboard.
 * @param {boolean=} collapsible true to make widgets collapsible on the dashboard.
 * @param {boolean=} maximizable true to add a button for open widgets in a large modal panel.
 * @param {string=} structure the default structure of the dashboard.
 * @param {object=} ngmModel model object of the dashboard.
 * @param {function=} ngmWidgetFilter function to filter widgets on the add dialog.
 */

angular.module('ngm')
	.service('ngmData', ['$q', '$http', function($q, $http){
		return {
			get: function(request){
				var deferred = $q.defer();
				$http(request)
					.success(function(data){
						deferred.resolve(data);
					})
					.error(function(){
						deferred.reject();
					});

				return deferred.promise;
			}
		};
	}])
	.directive('ngmDashboard', ['$rootScope', '$log', '$sce', 'dashboard', 'ngmTemplatePath', function ($rootScope, $log, $sce, dashboard, ngmTemplatePath) {
		

		function stringToBoolean(string){
			switch(angular.isDefined(string) ? string.toLowerCase() : null){
				case 'true': case 'yes': case '1': return true;
				case 'false': case 'no': case '0': case null: return false;
				default: return Boolean(string);
			}
		}

		function copyWidgets(source, target) {
			if ( source.widgets && source.widgets.length > 0 ){
				var w = source.widgets.shift();
				while (w){
					target.widgets.push(w);
					w = source.widgets.shift();
				}
			}
		}

		/**
		* Copy widget from old columns to the new model
		* @param object root the model
		* @param array of columns
		* @param counter
		*/
		function fillStructure(root, columns, counter) {
			counter = counter || 0;

			if (angular.isDefined(root.rows)) {
				angular.forEach(root.rows, function (row) {
					angular.forEach(row.columns, function (column) {
						// if the widgets prop doesn't exist, create a new array for it.
						// this allows ui.sortable to do it's thing without error
						if (!column.widgets) {
							column.widgets = [];
						}

						// if a column exist at the counter index, copy over the column
						if (angular.isDefined(columns[counter])) {
							// do not add widgets to a column, which uses nested rows
							if (!angular.isDefined(column.rows)){
								copyWidgets(columns[counter], column);
								counter++;
							}
						}

						// run fillStructure again for any sub rows/columns
						counter = fillStructure(column, columns, counter);
					});
				});
			}
			return counter;
		}

		/**
		* Read Columns: recursively searches an object for the 'columns' property
		* @param object model
		* @param array  an array of existing columns; used when recursion happens
		*/
		function readColumns(root, columns) {
			columns = columns || [];

			if (angular.isDefined(root.rows)) {
				angular.forEach(root.rows, function (row) {
					angular.forEach(row.columns, function (col) {
						columns.push(col);
						// keep reading columns until we can't any more
						readColumns(col, columns);
					});
				});
			}

			return columns;
		}

		function changeStructure(model, structure){
			var columns = readColumns(model);
			var counter = 0;

			model.rows = angular.copy(structure.rows);

			while ( counter < columns.length ){
				counter = fillStructure(model, columns, counter);
			}
		}

		function createConfiguration(type){
			var cfg = {};
			var config = dashboard.widgets[type].config;
			if (config){
				cfg = angular.copy(config);
			}
			return cfg;
		}

		/**
		 * Find first widget column in model.
		 *
		 * @param dashboard model
		 */
		function findFirstWidgetColumn(model){
			var column = null;
			if (!angular.isArray(model.rows)){
				$log.error('model does not have any rows');
				return null;
			}
			for (var i=0; i<model.rows.length; i++){
				var row = model.rows[i];
				if (angular.isArray(row.columns)){
					for (var j=0; j<row.columns.length; j++){
						var col = row.columns[j];
						if (!col.rows){
							column = col;
							break;
						}
					}
				}
				if (column){
					break;
				}
			}
			return column;
		}

		return {
			replace: true,
			restrict: 'EA',
			transclude : false,
			scope: {
				structure: '@',
				name: '@',
				collapsible: '@',
				editable: '@',
				maximizable: '@',
				ngmModel: '=',
				ngmWidgetFilter: '='
			},
			controller: function($scope){
				var model = {};
				var structure = {};
				var widgetFilter = null;
				var structureName = {};
				var name = $scope.name;

				// Update widget configs with broadcast
				// if($scope.ngmModel){
				// 	$scope.ngmModel.updateWidgets = function(params){
				// 		$scope.$broadcast( 'widgetConfigChanged', params );
				// 	}
				// }

				// Watching for changes on ngmModel
				$scope.$watch('ngmModel', function(oldVal, newVal) {
					// has model changed or is the model attribute not set
					if (newVal !== null || (oldVal === null && newVal === null)) {
						model = $scope.ngmModel;
						widgetFilter = $scope.ngmWidgetFilter;
						if ( ! model || ! model.rows ){
							structureName = $scope.structure;
							structure = dashboard.structures[structureName];
							if (structure){
								if (model){
									model.rows = angular.copy(structure).rows;
								} else {
									model = angular.copy(structure);
								}
								model.structure = structureName;
							} else {
								$log.error( 'could not find structure ' + structureName);
							}
						}

						if (model) {
							if (!model.title){
								model.title = 'Dashboard';
							}
							if (!model.titleTemplateUrl) {
								model.titleTemplateUrl = ngmTemplatePath + 'dashboard-title.html';
							}
							$scope.model = model;
						} else {
							$log.error('could not find or create model');
						}
					}
				}, true);

				// edit mode
				$scope.editMode = false;
				$scope.editClass = '';

			},
			link: function ($scope, $element, $attr) {
				// pass options to scope
				var options = {
					name: $attr.name,
					editable: true,
					maximizable: stringToBoolean($attr.maximizable),
					collapsible: stringToBoolean($attr.collapsible)
				};
				if (angular.isDefined($attr.editable)){
					options.editable = stringToBoolean($attr.editable);
				}
				$scope.options = options;
			},
			templateUrl: ngmTemplatePath + 'dashboard.html'
		};
	}])
	// toggles accordian classes for 
	.directive('ngmMenu', function() {

		return {
			
			// Restrict it to be an attribute in this case
			restrict: 'A',
			
			// responsible for registering DOM listeners as well as updating the DOM
			link: function(scope, el, attr) {

				// set initial menu style - has to be a better way?
				setTimeout(function(){

					// For all itmes
					$('.side-menu').find('li').each(function(i, d) {

						// find the row that is active
						if ($(d).attr('class').search('active') > 0) {

							// set list header
							$(d).closest('.bold').attr('class', 'bold active');
							
							// set z-depth-1
							$(d).closest('.bold').find('a').attr('class', 
									$(d).closest('.bold').find('a').attr('class') + ' z-depth-1' );

							// slide down list
							$(d).closest('.collapsible-body').slideDown();
							$(d).closest('.collapsible-body').attr('class',
								$(d).closest('.collapsible-body').attr('class') + ' active');
						}
					});

				}, 0);

				// on element click
				el.bind( 'click', function( $event ) {
					
					// toggle list 
					el.toggleClass('active');
					// toggle list 
					el.find('.collapsible-header').toggleClass('z-depth-1');

					// toggle list rows active
					el.find('.collapsible-body').toggleClass('active');

					// toggle list rows animation
					if (el.find('.collapsible-body').hasClass('active')) {
						el.find('.collapsible-body').slideDown();
					} else {
						el.find('.collapsible-body').slideUp();
					}
					
				});
			}
		};
	})
	.directive('ngmDashboardDownload', [ '$timeout', 'dashboard', 'ngmData',  function( $timeout, dashboard, ngmData ) {

		// client side download    
		var download = {
	
			// prepare and stream CSV to client      
			'csv': function(request){
				// get data
				ngmData.get(request)
					//
					.then(function(csv){

						// save as blob
						var csvData = new Blob([ csv.data ], { type: 'text/csv' }); 
						var csvUrl = URL.createObjectURL( csvData );

						var el = document.createElement('a');
							el.href =  csvUrl;
							el.target = '_blank';
							el.download = request.data.report + '.csv';

						// append, download & remove
						document.body.appendChild(el);
						el.click();
						el.remove();

						// close loading mask
						$('#ngm-loading-modal').closeModal();

					},function(data){
						// close loading mask
						$('#ngm-loading-modal').closeModal();
						// error msg						
						Materialize.toast(data.error, 4000);
					});			
			},

			// client side PDF generation
			'pdf': function(request){
				// get data
				ngmData.get(request)
					//
					.then(function(response){
						// close loading mask
						$('#ngm-loading-modal').closeModal();
						// open in new tab
						window.open(request.data.downloadUrl + response.report, '_blank');
					},function(data){
						// close loading mask
						$('#ngm-loading-modal').closeModal();
						// error msg						
						Materialize.toast(data.error, 4000);
					});
			},

			// writes metrics to rest api
			'setMetrics': function(request){
				ngmData.get(request)
					.then(function(data){
					});
			}

		}

		return {
			
			// element or attrbute
			restrict: 'EA',

			replace: true,

			template: '<li><a id="{{ type + icon }}" class="btn-floating {{ color }} z-depth-2 tooltipped" data-position="bottom" data-delay="50"><i class="material-icons">{{ icon }}</i></a></li>',

			scope: {
				type: '=',
				icon: '=',
				color: '=',
				hover: '=',
				url: '=',
				request: '=',
				metrics: '='
			},

			// onclick
			link: function(scope, el, attr) {

				// set defaults
				scope.type = scope.type ? scope.type : 'csv';
				scope.icon = scope.icon ? scope.icon : 'cloud_download';
				scope.color = scope.color ? scope.color : 'blue';
				scope.hover = scope.hover ? scope.hover : 'Download ' + scope.type.toUpperCase();

				// init tooltip
				$timeout(function(){
					$('#' + scope.type + scope.icon ).tooltip({
						tooltip: scope.hover
					});
				}, 0);
				
				// bind download event
				el.bind( 'click', function($e) {

					// if simple download url exists
					if(scope.url){

						window.open(scope.url, '_blank');

					// else download process
					} else {
						// open loading mask
						$('#ngm-loading-modal').openModal({dismissible: false});

						// prepare download
						download[scope.type](scope.request);

						// record metrics
						if (scope.metrics) {
							download.setMetrics(scope.metrics);
						}
					}

				});

			}
		}
	}])
	.directive("ngModel", ["$timeout", function($timeout){
		return {
			restrict: 'A',
			priority: -1, // lower priority than built-in ng-model so it runs first
			link: function(scope, element, attr) {
				scope.$watch(attr.ngModel,function(value){
					$timeout(function () {
						if (value){
								element.trigger("change");
						} else if(element.attr('placeholder') === undefined) {
							if(!element.is(":focus")) {
								element.trigger("blur");
							}
						}
					});
				});
			}
		};
	}])
  /**
   * Add pickadate directive
   * Type text is mandatory
   * Source: https://github.com/krescruz/angular-materialize/
   * Example:
   <input ngm-date
      type="text"
      name="created"
      id="inputCreated"
      ng-model="currentTime"
      format="dd/mm/yyyy"
      months-full="{{ monthFr }}"
      months-short="{{ monthShortFr }}"
      weekdays-full="{{ weekdaysFullFr }}"
      weekdays-short="{{ weekdaysShortFr }}"
      weekdays-letter="{{ weekdaysLetterFr }}"
      disable="disable"
      today="today"
      clear="clear"
      close="close"
      on-start="onStart()"
      on-render="onRender()"
      on-open="onOpen()"
      on-close="onClose()"
      on-set="onSet()"
      on-stop="onStop()" />
   */
  .directive('ngmDate', ["$compile", "$timeout", function ($compile, $timeout) {
      // Fix for issue 46. This gotta be a bug in the materialize code, but this fixes it.
      var style = $('<style>#inputCreated_root {outline: none;}</style>');
      $('html > head').append(style);

      // Define Prototype Date format
      // Use like this
      // today = new Date();
      // var dateString = today.format("dd-m-yy");
      var dateFormat = function () {

          var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
              timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
              timezoneClip = /[^-+\dA-Z]/g,
              pad = function (val, len) {
                  val = String(val);
                  len = len || 2;
                  while (val.length < len) {
                      val = "0" + val;
                  }
                  return val;
              };

          // Regexes and supporting functions are cached through closure
          return function (date, mask, utc) {

              var dF = dateFormat;

              // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
              if (arguments.length === 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
                  mask = date;
                  date = undefined;
              }

              // Passing date through Date applies Date.parse, if necessary
              date = date ? new Date(date) : new Date();
              if (isNaN(date)) throw SyntaxError("invalid date");

              // force UTC
              date = new Date( date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0 );

              // mask?
              mask = String(dF.masks[mask] || mask || dF.masks["default"]);

              // Allow setting the utc argument via the mask
              if (mask.slice(0, 4) == "UTC:") {
                  mask = mask.slice(4);
                  utc = true;
              }

              var _ = utc ? "getUTC" : "get",
                  d = date[ _ + "Date" ](),
                  D = date[ _ + "Day" ](),
                  m = date[ _ + "Month" ](),
                  y = date[ _ + "FullYear" ](),
                  H = date[ _ + "Hours" ](),
                  M = date[ _ + "Minutes" ](),
                  s = date[ _ + "Seconds" ](),
                  L = date[ _ + "Milliseconds" ](),
                  o = utc ? 0 : date.getTimezoneOffset(),
                  flags = {
                      d:    d,
                      dd:   pad(d),
                      ddd:  dF.i18n.dayNames[D],
                      dddd: dF.i18n.dayNames[D + 7],
                      m:    m + 1,
                      mm:   pad(m + 1),
                      mmm:  dF.i18n.monthNames[m],
                      mmmm: dF.i18n.monthNames[m + 12],
                      yy:   String(y).slice(2),
                      yyyy: y,
                      h:    H % 12 || 12,
                      hh:   pad(H % 12 || 12),
                      H:    H,
                      HH:   pad(H),
                      M:    M,
                      MM:   pad(M),
                      s:    s,
                      ss:   pad(s),
                      l:    pad(L, 3),
                      L:    pad(L > 99 ? Math.round(L / 10) : L),
                      t:    H < 12 ? "a"  : "p",
                      tt:   H < 12 ? "am" : "pm",
                      T:    H < 12 ? "A"  : "P",
                      TT:   H < 12 ? "AM" : "PM",
                      Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                      o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                      S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                  };

              return mask.replace(token, function ($0) {
                  return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
              });
          };
      }();

      // Some common format strings
      dateFormat.masks = {
         "default":      "ddd mmm dd yyyy HH:MM:ss",
          shortDate:      "m/d/yy",
          mediumDate:     "mmm d, yyyy",
          longDate:       "mmmm d, yyyy",
          fullDate:       "dddd, mmmm d, yyyy",
          shortTime:      "h:MM TT",
          mediumTime:     "h:MM:ss TT",
          longTime:       "h:MM:ss TT Z",
          isoDate:        "yyyy-mm-dd",
          isoTime:        "HH:MM:ss",
          isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
          isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
      };

      // Internationalization strings
      dateFormat.i18n = {
          dayNames: [
              "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
              "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
          ],
          monthNames: [
              "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
              "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
          ]
      };

      // For convenience...
      Date.prototype.format = function (mask, utc) {
          return dateFormat(this, mask, utc);
      };

      /**
       * Validate date object
       * @param  {Date}  date
       * @return {Boolean}
       */
      var isValidDate = function(date) {
          if( Object.prototype.toString.call(date) === '[object Date]' ) {
              return !isNaN(date.getTime());
          }
          return false;
      };

      return {
          require: 'ngModel',
          scope: {
              container: "@",
              format: "@",
              formatSubmit: "@",
              monthsFull: "@",
              monthsShort: "@",
              weekdaysFull: "@",
              weekdaysShort: "@",
              weekdaysLetter: "@",
              firstDay: "=",
              disable: "=",
              today: "=",
              clear: "=",
              close: "=",
              selectYears: "=",
              onStart: "&",
              onRender: "&",
              onOpen: "&",
              onClose: "&",
              onSet: "&",
              onStop: "&",
              ngReadonly: "=?",
              max: "@",
              min: "@"
          },
          link: function (scope, element, attrs, ngModelCtrl) {

              ngModelCtrl.$formatters.unshift(function (modelValue) {
                  if (modelValue) {
                      var date = new Date(modelValue);
                      return (angular.isDefined(scope.format)) ? date.format(scope.format) : date.format('d mmmm, yyyy');
                  }
                  return null;
              });

              var monthsFull = (angular.isDefined(scope.monthsFull)) ? scope.$eval(scope.monthsFull) : undefined,
                  monthsShort = (angular.isDefined(scope.monthsShort)) ? scope.$eval(scope.monthsShort) : undefined,
                  weekdaysFull = (angular.isDefined(scope.weekdaysFull)) ? scope.$eval(scope.weekdaysFull) : undefined,
                  weekdaysShort = (angular.isDefined(scope.weekdaysShort)) ? scope.$eval(scope.weekdaysShort) : undefined,
                  weekdaysLetter = (angular.isDefined(scope.weekdaysLetter)) ? scope.$eval(scope.weekdaysLetter) : undefined;


              $compile(element.contents())(scope);
              if (!(scope.ngReadonly)) {
                  $timeout(function () {
                      var options = {
                          container : scope.container,
                          format: (angular.isDefined(scope.format)) ? scope.format : undefined,
                          formatSubmit: (angular.isDefined(scope.formatSubmit)) ? scope.formatSubmit : undefined,
                          monthsFull: (angular.isDefined(monthsFull)) ? monthsFull : undefined,
                          monthsShort: (angular.isDefined(monthsShort)) ? monthsShort : undefined,
                          weekdaysFull: (angular.isDefined(weekdaysFull)) ? weekdaysFull : undefined,
                          weekdaysShort: (angular.isDefined(weekdaysShort)) ? weekdaysShort : undefined,
                          weekdaysLetter: (angular.isDefined(weekdaysLetter)) ? weekdaysLetter : undefined,
                          firstDay: (angular.isDefined(scope.firstDay)) ? scope.firstDay : 0,
                          disable: (angular.isDefined(scope.disable)) ? scope.disable : undefined,
                          today: (angular.isDefined(scope.today)) ? scope.today : undefined,
                          clear: (angular.isDefined(scope.clear)) ? scope.clear : undefined,
                          close: (angular.isDefined(scope.close)) ? scope.close : undefined,
                          selectYears: (angular.isDefined(scope.selectYears)) ? scope.selectYears : undefined,
                          onStart: (angular.isDefined(scope.onStart)) ? function(){ scope.onStart(); } : undefined,
                          onRender: (angular.isDefined(scope.onRender)) ? function(){ scope.onRender(); } : undefined,
                          onOpen: (angular.isDefined(scope.onOpen)) ? function(){ scope.onOpen(); } : undefined,
                          onClose: (angular.isDefined(scope.onClose)) ? function(){ scope.onClose(); } : undefined,
                          // onSet: (angular.isDefined(scope.onSet)) ? function(event){ if(event.select) { var picker = this; setTimeout(function(){ picker.close(); }, 0, picker); } } : undefined,
                          onSet: (angular.isDefined(scope.onSet)) ? function(event){ if(event.select) { this.close(); } } : undefined,
                          onStop: (angular.isDefined(scope.onStop)) ? function(){ scope.onStop(); } : undefined
                      };
                      if (!scope.container) {
                          delete options.container;
                      }
                      var pickadateInput = element.pickadate(options);
                      //pickadate API
                      var picker = pickadateInput.pickadate('picker');

                      //watcher of min, max, and disabled dates
                      scope.$watch('max', function(newMax) {
                          if( picker ) {
                              var maxDate = new Date(newMax);
                              picker.set({max: isValidDate(maxDate) ? maxDate : false});
                          }
                      });
                      scope.$watch('min', function(newMin) {
                          if( picker ) {
                              var minDate = new Date(newMin);
                              picker.set({min: isValidDate(minDate) ? minDate : false});
                          }
                      });
                      scope.$watch('disable', function(newDisabled) {
                          if( picker ) {
                              var disabledDates = angular.isDefined(newDisabled) && angular.isArray(newDisabled) ? newDisabled : false;
                              picker.set({disable: disabledDates});
                          }
                      });
                  });
              }
          }
      };
  }]);

/*
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
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



/**
 * @ngdoc object
 * @name ngm.dashboardProvider
 * @description
 *
 * The dashboardProvider can be used to register structures and widgets.
 */
angular.module('ngm.provider', [])
	.provider('dashboard', function(){

		var widgets = {};
		var widgetsPath = '';
		var structures = {};
		var messageTemplate = '<div class="alert alert-danger">{}</div>';
		var loadingTemplate = '\
			<div class="progress progress-striped active">\n\
				<div class="progress-bar" role="progressbar" style="width: 100%">\n\
					<span class="sr-only">loading ...</span>\n\
				</div>\n\
			</div>';

	 /**
		* @ngdoc method
		* @name ngm.dashboardProvider#widget
		* @methodOf ngm.dashboardProvider
		* @description
		*
		* Registers a new widget.
		*
		* @param {string} name of the widget
		* @param {object} widget to be registered.
		*
		*   Object properties:
		*
		*   - `title` - `{string=}` - The title of the widget.
		*   - `description` - `{string=}` - Description of the widget.
		*   - `config` - `{object}` - Predefined widget configuration.
		*   - `controller` - `{string=|function()=}` - Controller fn that should be
		*      associated with newly created scope of the widget or the name of a
		*      {@link http://docs.angularjs.org/api/angular.Module#controller registered controller}
		*      if passed as a string.
		*   - `controllerAs` - `{string=}` - A controller alias name. If present the controller will be
		*      published to scope under the `controllerAs` name.
		*   - `template` - `{string=|function()=}` - html template as a string.
		*   - `templateUrl` - `{string=}` - path to an html template.
		*   - `reload` - `{boolean=}` - true if the widget could be reloaded. The default is false.
		*   - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
		*      be injected into the controller. If any of these dependencies are promises, the widget
		*      will wait for them all to be resolved or one to be rejected before the controller is
		*      instantiated.
		*      If all the promises are resolved successfully, the values of the resolved promises are
		*      injected.
		*
		*      The map object is:
		*      - `key` – `{string}`: a name of a dependency to be injected into the controller.
		*      - `factory` - `{string|function}`: If `string` then it is an alias for a service.
		*        Otherwise if function, then it is {@link http://docs.angularjs.org/api/AUTO.$injector#invoke injected}
		*        and the return value is treated as the dependency. If the result is a promise, it is
		*        resolved before its value is injected into the controller.
		*   - `edit` - `{object}` - Edit modus of the widget.
		*      - `controller` - `{string=|function()=}` - Same as above, but for the edit mode of the widget.
		*      - `template` - `{string=|function()=}` - Same as above, but for the edit mode of the widget.
		*      - `templateUrl` - `{string=}` - Same as above, but for the edit mode of the widget.
		*      - `resolve` - `{Object.<string, function>=}` - Same as above, but for the edit mode of the widget.
		*      - `reload` - {boolean} - true if the widget should be reloaded, after the edit mode is closed.
		*        Default is true.
		*
		* @returns {Object} self
		*/
		this.widget = function(name, widget){
			var w = angular.extend({reload: false}, widget);
			if ( w.edit ){
				var edit = {reload: true};
				angular.extend(edit, w.edit);
				w.edit = edit;
			}
			widgets[name] = w;
			return this;
		};

		/**
		 * @ngdoc method
		 * @name ngm.dashboardProvider#widgetsPath
		 * @methodOf ngm.dashboardProvider
		 * @description
		 *
		 * Sets the path to the directory which contains the widgets. The widgets
		 * path is used for widgets with a templateUrl which contains the
		 * placeholder {widgetsPath}. The placeholder is replaced with the
		 * configured value, before the template is loaded, but the template is
		 * cached with the unmodified templateUrl (e.g.: {widgetPath}/src/widgets).
		 * The default value of widgetPaths is ''.
		 *
		 *
		 * @param {string} path to the directory which contains the widgets
		 *
		 * @returns {Object} self
		 */
		this.widgetsPath = function(path){
			widgetsPath = path;
			return this;
		};

	 /**
		* @ngdoc method
		* @name ngm.dashboardProvider#structure
		* @methodOf ngm.dashboardProvider
		* @description
		*
		* Registers a new structure.
		*
		* @param {string} name of the structure
		* @param {object} structure to be registered.
		*
		*   Object properties:
		*
		*   - `rows` - `{Array.<Object>}` - Rows of the dashboard structure.
		*     - `styleClass` - `{string}` - CSS Class of the row.
		*     - `columns` - `{Array.<Object>}` - Columns of the row.
		*       - `styleClass` - `{string}` - CSS Class of the column.
		*
		* @returns {Object} self
		*/
		this.structure = function(name, structure){
			structures[name] = structure;
			return this;
		};

	 /**
		* @ngdoc method
		* @name ngm.dashboardProvider#messageTemplate
		* @methodOf ngm.dashboardProvider
		* @description
		*
		* Changes the template for messages.
		*
		* @param {string} template for messages.
		*
		* @returns {Object} self
		*/
		this.messageTemplate = function(template){
			messageTemplate = template;
			return this;
		};

	 /**
		* @ngdoc method
		* @name ngm.dashboardProvider#loadingTemplate
		* @methodOf ngm.dashboardProvider
		* @description
		*
		* Changes the template which is displayed as
		* long as the widget resources are not resolved.
		*
		* @param {string} loading template
		*
		* @returns {Object} self
		*/
		this.loadingTemplate = function(template){
			loadingTemplate = template;
			return this;
		};
		
	 /**
		* @ngdoc service
		* @name ngm.dashboard
		* @description
		*
		* The dashboard holds all options, structures and widgets.
		*
		* @property {Array.<Object>} widgets Array of registered widgets.
		* @property {string} widgetsPath Default path for widgets.
		* @property {Array.<Object>} structures Array of registered structures.
		* @property {string} messageTemplate Template for messages.
		* @property {string} loadingTemplate Template for widget loading.
		*
		* @returns {Object} self
		*/
		this.$get = function(){
			var cid = 0;

			return {
				widgets: widgets,
				widgetsPath: widgetsPath,
				structures: structures,
				messageTemplate: messageTemplate,
				loadingTemplate: loadingTemplate,

				/**
				 * @ngdoc method
				 * @name ngm.dashboard#id
				 * @methodOf ngm.dashboard
				 * @description
				 *
				 * Creates an ongoing numeric id. The method is used to create ids for
				 * columns and widgets in the dashboard.
				 */
				id: function(){
					return ++cid;
				}

			};
		};
});

/*
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
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/


/* global angular */
angular.module('ngm')
  .directive('ngmDashboardRow', function ($compile, ngmTemplatePath, columnTemplate) {
    

    return {
      restrict: 'E',
      replace: true,
      scope: {
        row: '=',
        ngmModel: '=',
        editMode: '=',
        options: '='
      },
      templateUrl: ngmTemplatePath + 'dashboard-row.html',
      link: function ($scope, $element) {
        if (angular.isDefined($scope.row.columns) && angular.isArray($scope.row.columns)) {
          $compile(columnTemplate)($scope, function(cloned) {
            $element.append(cloned);
          });
        }
      }
    };
  });

/*
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
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/


/* global angular */
angular.module('ngm')
  .directive('ngmDashboardColumn', function ($log, $compile, ngmTemplatePath, rowTemplate, dashboard) {
    

    /**
     * finds a widget by its id in the column
     */
    function findWidget(column, index){
      var widget = null;
      for (var i=0; i<column.widgets.length; i++){
        var w = column.widgets[i];
        if (w.wid === index){
          widget = w;
          break;
        }
      }
      return widget;
    }

    /**
     * finds a column by its id in the model
     */
    function findColumn(model, index){
      var column = null;
      for (var i=0; i<model.rows.length; i++){
        var r = model.rows[i];
        for (var j=0; j<r.columns.length; j++){
          var c = r.columns[j];
          if ( c.cid === index ){
            column = c;
            break;
          } else if (c.rows){
            column = findColumn(c, index);
          }
        }
        if (column){
          break;
        }
      }
      return column;
    }

    /**
     * get the ngm id from an html element
     */
    function getId(el){
      var id = el.getAttribute('ngm-id');
      return id ? parseInt(id) : -1;
    }

    return {
      restrict: 'E',
      replace: true,
      scope: {
        column: '=',
        editMode: '=',
        ngmModel: '=',
        options: '='
      },
      templateUrl: ngmTemplatePath + 'dashboard-column.html',
      link: function ($scope, $element) {
        // set id
        var col = $scope.column;
        if (!col.cid){
          col.cid = dashboard.id();
        }
        // be sure to tell Angular about the injected directive and push the new row directive to the column
        $compile(rowTemplate)($scope, function(cloned) {
          $element.append(cloned);
        });
      }
    };
  });

/*
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
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



angular.module('ngm')
  .directive('ngmWidgetContent', function($log, $q, $sce, $http, $templateCache,
    $compile, $controller, $injector, dashboard) {

    function parseUrl(url){
      var parsedUrl = url;
      if ( url.indexOf('{widgetsPath}') >= 0 ){
        parsedUrl = url.replace('{widgetsPath}', dashboard.widgetsPath)
                       .replace('//', '/');
        if (parsedUrl.indexOf('/') === 0){
          parsedUrl = parsedUrl.substring(1);
        }
      }
      return parsedUrl;
    }

    function getTemplate(widget){
      var deferred = $q.defer();

      if ( widget.template ){
        deferred.resolve(widget.template);
      } else if (widget.templateUrl) {
        // try to fetch template from cache
        var tpl = $templateCache.get(widget.templateUrl);
        if (tpl){
          deferred.resolve(tpl);
        } else {
          var url = $sce.getTrustedResourceUrl(parseUrl(widget.templateUrl));
          $http.get(url)
            .success(function(response){
              // put response to cache, with unmodified url as key
              $templateCache.put(widget.templateUrl, response);
              deferred.resolve(response);
            })
            .error(function(){
              deferred.reject('could not load template');
            });
        }
      }

      return deferred.promise;
    }

    function compileWidget($scope, $element, currentScope) {
      var model = $scope.model;
      var content = $scope.content;

      // display loading template
      $element.html(dashboard.loadingTemplate);

      // create new scope
      var templateScope = $scope.$new();

      // pass config object to scope
      if (!model.config) {
        model.config = {};
      }

      templateScope.config = model.config;

      // local injections
      var base = {
        $scope: templateScope,
        $element: $element.parent(),
        widget: model,
        config: model.config
      };

      // get resolve promises from content object
      var resolvers = {};
      resolvers.$tpl = getTemplate(content);
      if (content.resolve) {
        angular.forEach(content.resolve, function(promise, key) {
          if (angular.isString(promise)) {
            resolvers[key] = $injector.get(promise);
          } else {
            resolvers[key] = $injector.invoke(promise, promise, base);
          }
        });
      }

      // resolve all resolvers
      $q.all(resolvers).then(function(locals) {
        angular.extend(locals, base);

        // compile & render template
        var template = locals.$tpl;
        $element.html(template);
        if (content.controller) {
          var templateCtrl = $controller(content.controller, locals);
          if (content.controllerAs){
            templateScope[content.controllerAs] = templateCtrl;
          }
          $element.children().data('$ngControllerController', templateCtrl);
        }
        $compile($element.contents())(templateScope);
      }, function(reason) {
        // handle promise rejection
        var msg = 'Could not resolve all promises';
        if (reason) {
          msg += ': ' + reason;
        }
        $log.warn(msg);
        $element.html(dashboard.messageTemplate.replace(/{}/g, msg));
      });

      // destroy old scope
      if (currentScope){
        currentScope.$destroy();
      }

      return templateScope;
    }

    return {
      replace: true,
      restrict: 'EA',
      transclude: false,
      scope: {
        model: '=',
        content: '='
      },
      link: function($scope, $element) {
        var currentScope = compileWidget($scope, $element, null);
        $scope.$on('widgetReload', function(){
          currentScope = compileWidget($scope, $element, currentScope);
        });
        $scope.$on('widgetConfigChanged', function(event, params){
          // match update to widget using 'broadcast'
          if ($scope.model.broadcast === params.broadcast){
            // Extend widget config with params
            $scope.model.config = angular.merge({}, $scope.model.config, params.config);
            // Re-compile widget
            currentScope = compileWidget($scope, $element, currentScope);
          }
        });
      }
    };

  });

/*
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
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



angular.module('ngm')
  .directive('ngmWidget', function($log, dashboard, ngmTemplatePath) {

    function preLink($scope){
      var definition = $scope.definition;
      if (definition) {
        var w = dashboard.widgets[definition.type];
        if (w) {

          // set id for sortable
          if (!definition.wid){
            definition.wid = dashboard.id();
          }

          // pass copy of widget to scope
          $scope.widget = angular.copy(w);

          // create config object
          var config = definition.config;
          if (config) {
            if (angular.isString(config)) {
              config = angular.fromJson(config);
            }
          } else {
            config = {};
          }

          // pass config to scope
          $scope.config = config;

          // collapse exposed $scope.widgetState property
         if(!$scope.widgetState){
             $scope.widgetState ={};
             $scope.widgetState.isCollapsed= false;
          }

        } else {
          $log.warn('could not find widget ' + definition.type);
        }
      } else {
        $log.debug('definition not specified, widget was probably removed');
      }
    }

    function postLink($scope, $element) {
      var definition = $scope.definition;
      if (definition) {
        // bind reload function
        $scope.reload = function(){
          $scope.$broadcast('widgetReload');
        };
      } else {
        $log.debug('widget not found');
      }
    }

    return {
      replace: true,
      restrict: 'EA',
      transclude: false,
      templateUrl: ngmTemplatePath + 'widget.html',
      scope: {
        definition: '=',
        col: '=column',
        editMode: '=',
        options: '=',
        widgetState: '='
      },

      controller: function ($scope) {
        // 
      },

      compile: function compile(){

        /**
         * use pre link, because link of widget-content
         * is executed before post link widget
         */
        return {
          pre: preLink,
          post: postLink
        };
      }
    };

  });

angular.module("ngm").run(["$templateCache", function($templateCache) {$templateCache.put("../src/templates/dashboard-column.html","<div ngm-id={{column.cid}} class=\"col {{column.styleClass}}\" ng-class=column.styleClass ng-model=column.widgets> <ngm-widget ng-repeat=\"definition in column.widgets\" definition=definition column=column options=options widget-state=widgetState>  </ngm-widget></div> ");
$templateCache.put("../src/templates/dashboard-row.html","<div class=row ng-class=row.styleClass>  </div> ");
$templateCache.put("../src/templates/dashboard-title.html"," <div class=\"{{ model.header.div.class }}\" style=\"{{ model.header.div.style }}\">  <div class=row>  <h2 id=ngm-report-title class=\"{{ model.header.title.class }}\" style=\"{{ model.header.title.style }}\" ng-bind-html=model.header.title.title> </h2>  <div id=ngm-report-download class=\"{{ model.header.download.class }}\" style=\"{{ model.header.download.style }}\" align=right ng-if=model.header.download> <div class=\"fixed-action-btn horizontal\" style=\"position: relative; display: inline-block; margin-top:66px;\"> <a class=\"btn-floating btn-large {{ model.header.download.btnColor }} z-depth-2\"> <i class=\"large material-icons\">cloud_download</i> </a> <ul>  <div>  <ngm-dashboard-download ng-repeat=\"data in model.header.download.downloads track by $index\" type=data.type color=data.color icon=data.icon hover=data.hover filename=data.filename url=data.url request=data.request metrics=data.metrics> </ngm-dashboard-download> </div> </ul> </div> </div> </div>  <div class=row>  <p id=ngm-report-subtitle class=\"{{ model.header.subtitle.class }}\" style=\"{{ model.header.subtitle.style }}\" ng-bind-html=model.header.subtitle.title> </p>  <div id=ngm-report-datepicker class=\"{{ model.header.datePicker.class }}\" style=\"{{ model.header.datePicker.style }}\"> <div ng-repeat=\"date in model.header.datePicker.dates track by $index\">  <div id=\"ngmDateContainer-{{ $index }}\" class=ngm-date style=\"{{ date.style }}\"> <label for=\"ngmDateLabel-{{ $index }}\">{{ date.label }}</label> <input ngm-date id=\"ngmDatePicker-{{ $index }}\" type=text name=\"{{ date.name }}\" ng-model=date.currentTime format=\"{{ date.format }}\" min=\"{{ date.min }}\" max=\"{{ date.max }}\" on-close=date.onClose()> </div> </div> </div> </div> </div> ");
$templateCache.put("../src/templates/dashboard.html","<div class=dashboard-container> <div ng-include src=model.titleTemplateUrl></div> <div class=dashboard> <ngm-dashboard-row row=row ngm-model=model options=options ng-repeat=\"row in model.rows\"> </ngm-dashboard-row> </div> </div> ");
$templateCache.put("../src/templates/widget.html","<div ngm-id=\"{{ definition.wid }}\" ngm-widget-type=\"{{ definition.type }}\" class=\"widget {{ definition.card }}\" style=\"{{ definition.style }}\"> <ngm-widget-content model=definition content=widget> </ngm-widget-content></div> ");}]);})(window);