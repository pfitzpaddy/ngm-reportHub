/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ProjectFinancialsCtrl
 * @description
 * # ProjectFinancialsCtrl
 * Controller of the ngmReportHub
 */

angular.module('ngm.widget.workshop', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('ngm.workshop', {
        title: 'ReportHub Workshop Form',
        description: 'ReportHub Workshop Form',
        controller: 'WorkshopFormCtrl',
        templateUrl: '/views/app/authentication/view.html',
        resolve: {
          // pass in ngmData for $http requests
          data: function(ngmData, config){
            if (config.request){
              return ngmData.get(config.request);
            }
          }
        }
      });
  })
  .controller('WorkshopFormCtrl', [
    '$scope',
    '$timeout',
    '$http',
    '$location',
    'ngmAuth',
    'ngmUser',
    'data', 
    'config',
    function($scope, $timeout, $http, $location, ngmAuth, ngmUser, data, config){

      // project
      $scope.panel = {

        // template
        templateUrl: '/views/app/guides/workshop.html',

        data: [{
          workshops: []
        }],

        // register for workshop
        register: function($grand$parent, $parent, $index){

          // exists?
          var count = 0;
          angular.forEach($scope.panel.data, function(d, i){
            angular.forEach(d.workshops, function(w, j){
              angular.forEach(w.participants, function(p, k){
                if ( $scope.panel.data[$grand$parent].workshops[$parent].participants[$index].email === p.email ){
                  count++;
                }
              });
            });
          });

          // if not
          if ( count === 1 ) {
            
            // seat taken
            $scope.panel.data[$grand$parent].workshops[$parent].participants[$index].taken = true;
            $('#ngm-workshop-dutystation-' + $grand$parent + '-' + $parent ).prop('disabled', true);
            // update dropdown
            $timeout(function(){
              $( '#ngm-workshop-dutystation-' + $grand$parent + '-' + $parent ).material_select('update');
            }, 100);            

            // return project
            $http({
              method: 'POST',
              url: 'http://' + $location.host() + '/api/health/workshop/set',
              data: {
                data: $scope.panel.data
              }
            }).then(function(data){

              //
              console.log(data);

              // assign data
              Materialize.toast( $scope.panel.data[$grand$parent].workshops[$parent].participants[$index].name + ', you are now registered for the ' + $scope.panel.data[$grand$parent].workshops[$parent].time + ' session ', 3000, 'note');
            });

          } else if ( count !== 16) {

            // exists!
            Materialize.toast( $scope.panel.data[$grand$parent].workshops[$parent].participants[$index].name + ', already registered?', 3000 );
          }

        }


      }

      // Merge defaults with config
      $scope.panel = angular.merge( {}, $scope.panel, config );

      // data
      console.log(data);
      $scope.panel.data = data ? angular.merge( {}, $scope.panel.data, data ) : $scope.panel.data;

      // on page load
      angular.element(document).ready(function () {

        // give a few seconds to render
        $timeout(function() {

          // selects
          $('select').material_select();

        }, 400);
      });

    }

]);
