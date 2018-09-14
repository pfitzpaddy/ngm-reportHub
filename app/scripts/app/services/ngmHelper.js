/**
 * @name ngmReportHub.factory:ngmHelper
 * @description
 * # ngmHelper
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
  .filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  })
  // sums object by key 
  .filter('sumByKey', function() {
      return function( data, key ) {
        var sum = 0;
        if ( typeof( data ) === 'undefined' || typeof(key) === 'undefined' ) {
          return sum;
        }
        for ( var i = data.length - 1; i >= 0; i-- ) {
          sum += parseFloat( data[i][key] );
        }
        return sum;
      };
  })
  // sums object by keys
  .filter('sumByKeys', function() {
      return function( data, keys, skip ) {
        var sum = 0;
        if ( typeof( data ) === 'undefined' || typeof(keys) === 'undefined' ) {
          return 0;
        }

        angular.forEach(data, function(d,i){
          // put in checks here
          angular.forEach(keys, function(k,j){
            if( i === j && typeof( k ) === 'number' ) {
              if( skip.indexOf(i) < 0 ) {
                sum += parseInt( d );
              }
            }
          });
        });
        return sum;
      };
  })
  // sums array of objects by keys
  .filter('sumArrayByKeys', function() {
      return function( array, key1, keys, skip ) {
        var sum = 0;
        if ( typeof( array ) === 'undefined' || typeof(keys) === 'undefined' ) {
          return 0;
        }
        angular.forEach(array[ key1 ], function(a,i){
          angular.forEach(a, function(d,i){
            // put in checks here
            angular.forEach(keys, function(k,j){
              if( i === j && typeof( k ) === 'number' ) {
                if( skip.indexOf(i) < 0 ) {
                  sum += parseInt( d );
                }
              }
            });
          });
        });
        return sum;
      };
  })
  // sums array of objects by keys
  .filter('sumArrayofArraysByKeys', function() {
      return function( array, key1, key2, keys, skip ) {
        var sum = 0;
        if ( typeof( array ) === 'undefined' || 
              typeof( key1 ) === 'undefined' || 
              typeof( key2 ) === 'undefined' || 
              typeof( keys ) === 'undefined' ) {
          return 0;
        }
        
        // array 1
        angular.forEach(array[key1], function(a,i){
          angular.forEach(a, function(d,i){
            // put in checks here
            angular.forEach(keys, function(k,j){
              if( i === j && typeof( k ) === 'number' ) {
                if( skip.indexOf(i) < 0 ) {
                  sum += parseInt( d );
                }
              }
            });
          });
        });

        // array 2
        angular.forEach(array[key2], function(a,i){
          angular.forEach(a, function(d,i){
            // put in checks here
            angular.forEach(keys, function(k,j){
              if( i === j && typeof( k ) === 'number' ) {
                if( skip.indexOf(i) < 0 ) {
                  sum += parseInt( d );
                }
              }
            });
          });
        });

        return sum;
      };
  })
  .filter('filterByArray', function() {
    return function(tasks, tags, key ) {
      return tasks.filter(function(task) {

        for (var i in task[ key ]) {
          if (tags === task[ key ][i] ) {
            return true;
          }
        }
        return false;

      });
    };
  })

  // checks 2 passwords are identical 
  .directive( 'pwCheck', [ function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var firstPassword = '#' + attrs.pwCheck;
        elem.add( firstPassword ).on( 'keyup', function () {
          scope.$apply(function () {
            var v = elem.val()===$(firstPassword).val();
            ctrl.$setValidity( 'pwmatch', v);
          });
        });
      }
    }
  }])

  // typeahead directive
  .directive('typeahead', function($timeout) {
    return {
      restrict: 'AEC',
        scope: {
          label: '@',
          items: '=',
          prompt:'@',
          title: '@',
          subtitle:'@',
          model: '=',
          onSelect:'&'
        },
        link:function(scope,elem,attrs){
          scope.handleSelection=function(selectedItem){
            scope.model=selectedItem;
            scope.current=0;
            scope.selected=true;        
            $timeout(function(){
              scope.onSelect();
            },200);
          };
          scope.current=0;
          scope.selected=true;
          scope.isCurrent=function(index){
            return scope.current==index;
          };
          scope.setCurrent=function(index){
            scope.current=index;
          };
          $timeout(function(){
            $( window ).resize(function() {
              $('#dropdown').width($('#dropdowninputid').width());
            });
            scope.dropdownwidth = $('#dropdowninputid').width();
          },200);
        },
        templateUrl: 'scripts/app/views/typeahead.html'
    }
  });