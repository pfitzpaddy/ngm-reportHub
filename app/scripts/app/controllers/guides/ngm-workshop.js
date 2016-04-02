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
      });
  })
  .controller('WorkshopFormCtrl', [
    '$scope',
    '$timeout',
    '$http',
    '$location',
    'ngmAuth',
    'ngmUser',
    'config',
    function($scope, $timeout, $http, $location, ngmAuth, ngmUser, config){

      // project
      $scope.panel = {

        // template
        templateUrl: '/views/app/guides/workshop.html',

        data: [{
          workshops: []
        }],

        // register for workshop
        register: function($grand$parent, $parent, $index){


        // move array position
        $scope.panel.data[$grand$parent].workshops[$parent].participants[1] = $scope.panel.data[$grand$parent].workshops[$parent].participants[0]
        $scope.panel.data[$grand$parent].workshops[$parent].participants[3] = $scope.panel.data[$grand$parent].workshops[$parent].participants[1]
        $scope.panel.data[$grand$parent].workshops[$parent].participants[2] = $scope.panel.data[$grand$parent].workshops[$parent].participants[3];


          // exists?
          var count = 0;
          angular.forEach($scope.panel.data, function(d, i){
            angular.forEach(d.workshops, function(w, j){
              angular.forEach(w.participants, function(p, k){
                if ( $scope.panel.data[$grand$parent].workshops[$parent].participants[$index].email ) {
                  if ( $scope.panel.data[$grand$parent].workshops[$parent].participants[$index].email === p.email ){
                    count++;
                  }`
                }
              });
            });
          });

          console.log(count);

          // if not
          if ( count === 1 ) {
            
            // seat taken
            $scope.panel.data[$grand$parent].workshops[$parent].participants[$index].taken = true;

            // set displabled
            $('#ngm-workshop-dutystation-' + $grand$parent + '-' + $parent + '-' + $index ).prop('disabled', true);
            // update dropdown
            $timeout(function(){
              $( '#ngm-workshop-dutystation-' + $grand$parent + '-' + $parent + '-' + $index ).material_select('update');
            }, 100);            

            // return project
            $http({
              method: 'POST',
              url: 'http://' + $location.host() + '/api/health/workshop/set',
              data: {
                data: $scope.panel.data
              }
            }).then(function(data){

              // assign data
              Materialize.toast( $scope.panel.data[$grand$parent].workshops[$parent].participants[$index].name + ', you are now registered for the ' + $scope.panel.data[$grand$parent].workshops[$parent].date + ' session ', 3000, 'note');
            });

          } else {

            console.log($scope.panel.data[$grand$parent].workshops[$parent]);

            // exists!
            Materialize.toast( $scope.panel.data[$grand$parent].workshops[$parent].participants[$index].name + ', already registered?', 3000 );
          }

        }


      }

      // Merge defaults with config
      $scope.panel = angular.merge( {}, $scope.panel, config );

      // data
      $scope.panel.data = config.data.data ? angular.merge( {}, $scope.panel.data, config.data.data ) : $scope.panel.data;

      // on page load
      angular.element(document).ready(function () {

        // give a few seconds to render
        $timeout(function() {

          // selects
          $('select').material_select();

        }, 1000);
      });

    }

]);
