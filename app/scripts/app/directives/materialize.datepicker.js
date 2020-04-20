angular
	.module( "ngm.materialize.datepicker", [])
		.directive( "materializeDatepicker", [ "$compile", "$timeout", function ( $compile, $timeout ) {
			return {
				// model
				require: 'ngModel',
				
				// scope
				scope: {
					container: '@',
					format: '@',
					formatSubmit: '@',
					months: '@',
					monthsShort: '@',
					weekdays: '@',
					weekdaysShort: '@',
					weekdaysAbbrev: '@',
					firstDay: '@',
					disable: '@',
					today: '@',
					clear: '@',
					close: '@',
					cancel: '@',
					yearRange: '@',
					minDate: "=",
					maxDate: "=",
					defaultDate: '=',
					// open, close, draw
					autoClose: '=',
					onOpen: '=',
					onClose: '=',
					onDraw: '=',
					// start, end
					onOpenStart: '=',
					onOpenEnd: '=',
					onCloseStart: '=',
					onCloseEnd: '=',
					onSelect: '='
				},

				// link
				link: function ( $scope, element, attrs, ngModelCtrl ) {				

					// attrs
					var months = [
						'January',
						'February',
						'March',
						'April',
						'May',
						'June',
						'July',
						'August',
						'September',
						'October',
						'November',
						'December'
					];
					var monthsShort =[
						'Jan',
						'Feb',
						'Mar',
						'Apr',
						'May',
						'Jun',
						'Jul',
						'Aug',
						'Sep',
						'Oct',
						'Nov',
						'Dec'
					];
					var weekdays = [
						'Sunday',
						'Monday',
						'Tuesday',
						'Wednesday',
						'Thursday',
						'Friday',
						'Saturday'
					];
					var weekdaysShort = [
						'Sun',
						'Mon',
						'Tue',
						'Wed',
						'Thu',
						'Fri',
						'Sat'
					];
					var weekdaysAbbrev = ['S','M','T','W','T','F','S'];

					// defaults
					var options = {
							container : $scope.container,
							defaultDate: (angular.isDefined($scope.defaultDate)) ? new Date( $scope.defaultDate ) : undefined,
							minDate: (angular.isDefined($scope.minDate)) ? new Date( $scope.minDate ) : undefined,
							maxDate: (angular.isDefined($scope.maxDate)) ? new Date( $scope.maxDate ) : undefined,
							format: (angular.isDefined($scope.format)) ? $scope.format : 'dd mmm, yyyy',
							formatSubmit: (angular.isDefined($scope.formatSubmit)) ? $scope.formatSubmit : undefined,
							months: (angular.isDefined(months)) ? months : undefined,
							monthsShort: (angular.isDefined(monthsShort)) ? monthsShort : undefined,
							weekdays: (angular.isDefined(weekdays)) ? weekdays : undefined,
							weekdaysShort: (angular.isDefined(weekdaysShort)) ? weekdaysShort : undefined,
							weekdaysAbbrev: (angular.isDefined(weekdaysAbbrev)) ? weekdaysAbbrev : undefined,
							firstDay: (angular.isDefined($scope.firstDay)) ? $scope.firstDay : 0,
							disable: (angular.isDefined($scope.disable)) ? $scope.disable : undefined,
							today: (angular.isDefined($scope.today)) ? $scope.today : undefined,
							clear: (angular.isDefined($scope.clear)) ? $scope.clear : undefined,
							close: (angular.isDefined($scope.close)) ? $scope.close : undefined,
							cancel: (angular.isDefined($scope.cancel)) ? $scope.cancel : undefined,
							yearRange: (angular.isDefined($scope.yearRange)) ? $scope.yearRange : undefined,
							// open, close, draw fn
							autoClose: (angular.isDefined($scope.autoClose)) ? $scope.autoClose : true,
							onOpen: (angular.isDefined($scope.onOpen)) ? function(){ $scope.onOpen(); } : undefined,
							onClose: (angular.isDefined($scope.onClose)) ? function(){ $scope.onClose(); } : undefined,
							onDraw: (angular.isDefined($scope.onDraw)) ? function(){ $scope.onDraw(); } : undefined,
							// start, end
							onOpenStart: (angular.isDefined($scope.onOpenStart)) ? function(){ $scope.onOpenStart(); } : undefined,
							onOpenEnd: (angular.isDefined($scope.onOpenEnd)) ? function(){ $scope.onOpenEnd(); } : undefined,
							onCloseStart: (angular.isDefined($scope.onCloseStart)) ? function(){ $scope.onCloseStart(); } : undefined,
							onCloseEnd: (angular.isDefined($scope.onCloseEnd)) ? function(){ $scope.onCloseEnd(); } : undefined,
							onSelect: (angular.isDefined($scope.onSelect)) ? function(){ $scope.onSelect(); } : undefined
					};

					// init datepicker
					var instance = M.Datepicker.init( element, options );
					var picker = M.Datepicker.getInstance( element );

					// format date
					ngModelCtrl.$formatters.unshift(function ( modelValue ) {
						if ( modelValue && modelValue !== 'Invalid date' ) {
							var date = new Date( modelValue );
							return (angular.isDefined($scope.format)) ? date.format($scope.format) : date.format( 'dd mmm, yyyy' );
						}
					});

					// max / min $watch date
					$scope.$watch('maxDate', function (newMax) {
						picker.options.maxDate = newMax ? new Date(newMax) : false;
					});
					$scope.$watch('minDate', function (newMin) {
						picker.options.minDate = newMin ? new Date(newMin) : false;
					});

				}
			}
		}]);