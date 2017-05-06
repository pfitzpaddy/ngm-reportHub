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
  .controller( 'AuthenticationFormCtrl', [
    '$scope',
    '$http',
    '$location',
    '$timeout',
    '$filter',
    'ngmAuth',
    'ngmUser',
    'ngmData',
    'config',
    function( $scope, $http, $location, $timeout, $filter, ngmAuth, ngmUser, ngmData, config ){

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

              // db error!
              if( result.err || result.summary ){
                var msg = result.summary ? result.summary : result.msg;
                Materialize.toast( msg, 6000, 'error' );
              }

              // success
              if ( !result.err && !result.summary ){

                if ( $location.host().indexOf('dev') > -1 && result.cluster_id === 'fsac' ) {
                  $( '#ngm-fsac-dev-modal' ).openModal({dismissible: false});
                }

                // go to default org page
                $location.path( result.app_home );
                $timeout( function(){
                  Materialize.toast( 'Welcome back ' + result.username + '!', 3000, 'note' );
                }, 2000);
              }

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

              // db error!
              if( result.err || result.summary ){
                var msg = result.summary ? result.summary : result.msg;
                Materialize.toast( msg, 6000, 'error' );
              }

              // success
              if ( !result.err && !result.summary ){
                // go to default org page
                $location.path( result.app_home );
                $timeout( function(){
                  Materialize.toast( 'Welcome ' + result.username + ', time to create a Project!', 3000, 'success' );
                }, 2000);
              }

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
              }).success( function( result ) {
              
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
            ngmAuth.passwordReset({ reset: $scope.panel.user, token: token })
              .success( function( result ) {

              // go to default org page 
              $location.path( '/' + result.app_home );

              // user toast msg
              $timeout(function(){
                Materialize.toast( 'Welcome back ' + result.username + '!', 3000, 'note' );
              }, 2000);


            }).error(function(err) {
              // update
              $timeout(function(){
                Materialize.toast( err.msg, 6000, 'error' );
              }, 1000);
            });
          }

        },

        // RnR chapter validation
        organizationDisabled: function(){
          
          var disabled = true;
          if ( $scope.panel.user && $scope.panel.user.admin0pcode && $scope.panel.user.cluster_id && $scope.panel.user.organization_name ) {
            // not R&R Chapter
            if ( $scope.panel.user.cluster_id !== 'rnr_chapter' ) {
              disabled = false;
            } else {
              if ( $scope.panel.user.organization === 'UNHCR' || $scope.panel.user.organization === 'IOM' ) {
                disabled = false;
              } else {
                disabled = true;
              }
            }
          }
          return disabled;
        },

        // select org
        onOrganizationSelected: function(){
          // filter
          $scope.select = $filter( 'filter' )( $scope.panel.organizations, { organization: $scope.panel.user.organization }, true );
          // merge org
          var org = angular.copy( $scope.select[0] );
          delete org.id;
          angular.merge( $scope.panel.user, org );

          // validate
          if ( $scope.panel.user && $scope.panel.user.admin0pcode && $scope.panel.user.cluster_id && $scope.panel.user.organization_name ) {
            // not R&R Chapter
            if ( $scope.panel.user.cluster_id !== 'rnr_chapter' ) {
              Materialize.toast( org.organization + '<br/>' + org.organization_name + ' Selected...', 4000, 'note' );
            } else {
              if ( $scope.panel.user.organization === 'UNHCR' || $scope.panel.user.organization === 'IOM' ) {
                Materialize.toast( org.organization + '<br/>' + org.organization_name + ' Selected...', 4000, 'note' );
              } else {
                Materialize.toast( 'Only UNHCR or IOM Can Register in R&R Chapter!', 6000, 'error' );
              }
            }
          }
        }

      }

      // Merge defaults with config
      $scope.panel = angular.merge( {}, $scope.panel, config );

      // get organizations
      // if ( !localStorage.getObject( 'organizations') ){

        // set
        $http.get( 'http://' + $location.host() + '/api/cluster/list/organizations' ).then(function( organizations ){
          localStorage.setObject( 'organizations', organizations.data );
          $scope.panel.organizations = organizations.data;
          $timeout(function() {
            $( 'select' ).material_select();
          }, 100);
        });

      // } else {

        // set
        // $scope.panel.organizations = localStorage.getObject( 'organizations');
        // $timeout(function() {
        //   $( 'select' ).material_select();
        // }, 100);

      // }

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
              'NG': { adminRpcode: 'AFRO', adminRname: 'AFRO' },
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
            if ( $scope.panel.user.cluster_id !== 'cvwg' ) {
              $scope.panel.user.cluster = $( this ).find( 'option:selected' ).text();
            } else {
              $scope.panel.user.cluster = 'Cash';
            }

          });

        }, 400 );

      });      

    }

]);
