/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardPendingUserCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
    .controller('DashboardPendingUserCtrl', ['$scope', '$route', '$translate', function ($scope, $route, $translate) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        // assign to ngm app scope
        $scope.model = $scope.$parent.ngm.dashboard.model;

        // login object
        $scope.dashboard = {

            // parent
            ngm: $scope.$parent.ngm,

        }

        // padding
        $scope.dashboard.ngm.style.paddingHeight = 20;

        // dews dashboard model
        var model = {
            name: 'dashboard_pending_user',
            header: {
                div: {
                    'class': 'col s12 m12 l12 report-header',
                    style: 'border-bottom: 3px ' + $scope.dashboard.ngm.style.defaultPrimaryColor + ' solid;'
                },
                title: {
                    'class': 'col s12 m12 l12 report-title truncate',
                    style: 'color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
                    title: 'Pending User Activation'
                },
                subtitle: {
                    'class': 'col s12 m12 l12 report-subtitle',
                    html: true,
                    title: ' Please Contact Your Organization Admin to Activate your Account',
                }
            },
            rows: [{
                columns: [{
                    styleClass: 's12 m12 l12',
                    widgets: [{
                        type: 'html',
                        style: 'padding:0px; height: 90px; padding-top:10px;',
                        config: {
                            templateUrl: '/scripts/app/views/authentication/pending.html'
                        }
                    }]
                }]
            },{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'html',
						card: 'card-panel',
						style: 'padding:0px; height: 90px; padding-top:10px;',
						config: {
							html: $scope.dashboard.ngm.footer
						}
					}]
				}]
			}]
        };

        // assign model to scope
        $scope.model = model;

        // assign to ngm app scope
        $scope.dashboard.ngm.dashboard = $scope.model;

    }]);