/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ProjectFinancialsCtrl
 * @description
 * # ProjectFinancialsCtrl
 * Controller of the ngmReportHub
 */

angular.module('ngm.widget.form.authentication', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('form.authentication', {
        title: 'ReportHub Authentication Form',
        description: 'ReportHub Authentication Form',
        controller: 'AuthenticationFormCtrl',
        templateUrl: '/scripts/app/views/view.html'
      });
  })
  .controller('AuthenticationFormCtrl', [
    '$scope',
    '$location',
    '$timeout',
    'ngmAuth',
    'ngmUser',
    'ngmData',
    'config',
    function($scope, $location, $timeout, ngmAuth, ngmUser, ngmData, config){

      // project
      $scope.panel = {

        err: false,

        // login fn
        login: function( ngmLoginForm ){

          // if invalid
          if( ngmLoginForm.$invalid ){
            // set submitted for validation
            ngmLoginForm.$setSubmitted();
          } else {
            
            // login
            ngmAuth.login({ user: $scope.panel.user }).success( function( result ) {
              
              // go to default org page
              $location.path( result.app_home );

              // remove any 'guest' location storage
              localStorage.removeItem( 'guest' );

              // user toast msg
              $timeout( function(){
                Materialize.toast( 'Welcome back ' + result.username + '!', 3000, 'note' );
              }, 2000);

            }).error( function( err ) {

              // update
              $timeout(function(){
                Materialize.toast( err.msg, 6000, 'error' );
              }, 400);
            });
          }
        },

        // register fn
        register: function( ngmRegisterForm ){

          // if $invalid
          // if(ngmRegisterForm.$invalid){
          //   // set submitted for validation
          //   ngmRegisterForm.$setSubmitted();
          // } else {

            // register
            ngmAuth.register({ user: $scope.panel.user }).success(function( result ) {
              
              // go to default org page
              $location.path( result.app_home );

              // remove any 'guest' location storage
              localStorage.removeItem( 'guest' );

              // user toast msg
              $timeout(function(){
                Materialize.toast( 'Welcome ' + result.username + ', time to create a Project!', 3000, 'success' );
              }, 2000);

            }).error(function( err ) {
              // update
              $timeout(function(){
                Materialize.toast( err.msg, 6000, 'error' );
              }, 1000);
            });

          // }
        },

        // register fn
        passwordResetSend: function( ngmResetForm ){

          // if $invalid
          if(ngmResetForm.$invalid){
            // set submitted for validation
            ngmResetForm.$setSubmitted();
          } else {

            // user toast msg
            $timeout(function(){
              Materialize.toast('Your Email Is Being Prepared!', 3000, 'note');
            }, 400);            

            // resend password email
            ngmAuth.passwordResetSend({ 
                user: $scope.panel.user, 
                url: 'http://' + $location.host() + '/desk/#/cluster/find/' 
              }).success(function(result) {
              
                // go to password reset page
                $( '.carousel' ).carousel( 'prev' );

                // user toast msg
                $timeout(function(){
                  Materialize.toast('Email Sent! Please Check Your Inbox', 3000, 'success');
                }, 400);

              }).error(function( err ) {

                // set err
                $scope.panel.err = err;

                // update
                $timeout(function(){
                  Materialize.toast( err.msg, 6000, 'error' );
                }, 400);
              });
          }

        },

        // register fn
        passwordReset: function( ngmResetPasswordForm, token ){

          // if $invalid
          if(ngmResetPasswordForm.$invalid){
            // set submitted for validation
            ngmResetPasswordForm.$setSubmitted();
          } else {
            
            // register
            ngmAuth.passwordReset({ reset: $scope.panel.user, token: token }).success(function(result) {

              // go to default org page 
              $location.path( '/' + result.app_home );

              // remove any 'guest' location storage
              localStorage.removeItem( 'guest' );

              // user toast msg
              $timeout(function(){
                Materialize.toast('Welcome back ' + result.username + '!', 3000, 'note');
              }, 2000);


            }).error(function(err) {
              // update
              $timeout(function(){
                Materialize.toast( err.msg, 6000, 'error' );
              }, 1000);
            });
          }

        }        

      }

      // Merge defaults with config
      $scope.panel = angular.merge({}, $scope.panel, config);

      // on page load
      angular.element(document).ready(function () {

        // give a few seconds to render
        $timeout(function() {

          // on change
          $( '#ngm-country' ).on( 'change', function() {

            var adminRegion = {
              'AF': { adminRpcode: 'EMRO', adminRname: 'EMRO' },
              'ET': { adminRpcode: 'AFRO', adminRname: 'AFRO' },
              'IQ': { adminRpcode: 'EMRO', adminRname: 'EMRO' },
              'KE': { adminRpcode: 'AFRO', adminRname: 'AFRO' },
              'SO': { adminRpcode: 'EMRO', adminRname: 'EMRO' }
            }            

            // update icon color
            $( '.country' ).css({ 'color': 'teal' });
            
            // add country display name
            $scope.panel.user.admin0name = $( this ).find( 'option:selected' ).text();
            // add regions
            $scope.panel.user = angular.merge( {}, $scope.panel.user, adminRegion[ $scope.panel.user.admin0pcode ] );

          });

          // cluster
          $( '#ngm-cluster' ).on( 'change', function() {

            // update icon color
            $( '.cluster' ).css({ 'color': 'teal' });
            
            // add country display name
            $scope.panel.user.cluster = $( this ).find( 'option:selected' ).text();

          });

        }, 400 );

      });      

    }

]);
