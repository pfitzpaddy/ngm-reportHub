/**
 * @name ngmReportHub.factory:ngmHelper
 * @description
 * # ngmHelper
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
  // sums object by key 
  .filter('sumByKey', function() {
      return function( data, key ) {
        if ( typeof( data ) === 'undefined' || typeof(key) === 'undefined' ) {
          return 0;
        }
        var sum = 0;
        for ( var i = data.length - 1; i >= 0; i-- ) {
          sum += parseInt( data[i][key] );
        }
        return sum;
      };
  })
  // sums object by keys
  .filter('sumByKeys', function() {
      return function( data, keys, skip ) {
        if ( typeof( data ) === 'undefined' || typeof(keys) === 'undefined' ) {
          return 0;
        }
        var sum = 0;
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
  // checks 2 passwords are identical 
  .directive( 'pwCheck', [function () {
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
  }]);