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

angular.module('ngm.widget.html', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('html', {
        title: 'HTML Panel',
        description: 'Display HTML template',
        controller: 'htmlCtrl',
        templateUrl: '/scripts/widgets/ngm-html/view.html',
        resolve: {
          data: function(ngmData, config){
            if (config.request){
              return ngmData.get(config.request);
            }
          }
        }
      });
  }).controller('htmlCtrl', [
    '$scope',
    '$sce',
    '$element',
    '$location',
    '$timeout',
    'ngmAuth',
    'data', 
    'config',
    function($scope, $sce, $element, $location, $timeout, ngmAuth, data, config){
    
      // statistics widget default config
      $scope.panel = {
        
        // html template
        html: '',
        
        // src template
        templateUrl: '/scripts/widgets/ngm-html/template/default.html',

        // login fn
        login: function(ngmLoginForm){

          // if invalid
          if(ngmLoginForm.$invalid){
            // set submitted for validation
            ngmLoginForm.$setSubmitted();
          } else {
            // login
            ngmAuth.login($scope.panel.user).success(function(result) { 
              
              // go to default org page 
              $location.path( '/' + result.app_home );

              // user toast msg
              $timeout(function(){
                Materialize.toast('Welcome back ' + result.username + '!', 3000, 'note');
              }, 2000);

            }).error(function(err) {
              // update 
              $scope.panel.error = {
                msg: 'The email and password you entered is not correct'
              }
            });
          }
        },

        // register fn
        register: function(ngmRegisterForm){

          // if $invalid
          if(ngmRegisterForm.$invalid){
            // set submitted for validation
            ngmRegisterForm.$setSubmitted();
          } else {
            // register
            ngmAuth.register($scope.panel.user).success(function(result) {
              
              // go to default org page
              $location.path( '/' + result.app_home );

              // user toast msg
              $timeout(function(){
                Materialize.toast('Welcome ' + result.username + ', time to create a Project!', 3000, 'success');
              }, 2000);

            }).error(function(err) {
              // update 
              $scope.panel.error = {
                msg: 'There has been a registration issue, please contact the administrator!'
              }
            });            
          }
        }

      };

      // assign data
      $scope.panel.data = data ? data : false;

      // Merge defaults with config
      $scope.panel = angular.merge({}, $scope.panel, config);

      // trust html
      $scope.panel.html = $sce.trustAsHtml($scope.panel.html);

  }
]);


