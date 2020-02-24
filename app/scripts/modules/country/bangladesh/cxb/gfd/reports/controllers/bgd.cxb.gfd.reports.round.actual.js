/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardBgdCxbGfdRoundActualCtrl
 * @description
 * # ClusterProjectProjectsCtrl
 * Controller of the ngmReportHub
 */
angular.module( 'ngmReportHub' )
	.controller( 'DashboardBgdCxbGfdRoundActualCtrl', ['$scope', '$location', '$route', 'ngmAuth', 'ngmData', 'ngmUser', 'ngmClusterHelper', '$translate', '$filter', '$timeout', function ($scope, $location, $route, ngmAuth, ngmData, ngmUser, ngmClusterHelper, $translate, $filter, $timeout ) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// init empty model
		$scope.model = $scope.$parent.ngm.dashboard.model;

		// report object
		$scope.report = {

			// ngm
			ngm: $scope.$parent.ngm,

			// user
			user: ngmUser.get(),

			// report round
			report_round: $route.current.params.report_round,

			// report distribution
			report_distribution: $route.current.params.report_distribution,

			// report period
			reporting_period: $route.current.params.reporting_period,

			// menu for full range
			reporting_menu_start: $route.current.params.reporting_period,
			reporting_menu_end: moment( $route.current.params.reporting_period ).endOf( 'month' ).format( 'YYYY-MM-DD' ),

			// org
			organization_tag: $route.current.params.organization_tag,

			// site
			site_id: $route.current.params.site_id,

			// camp
			admin3pcode: $route.current.params.admin3pcode,

			// block
			admin4pcode: $route.current.params.admin4pcode,

			// sub block
			admin5pcode: $route.current.params.admin5pcode,

			// start_date
			start_date: $route.current.params.start_date,

			// end_date
			end_date: $route.current.params.end_date,

			// title
			title: "GFD | Actual | R" + $route.current.params.report_round + " | D" + $route.current.params.report_distribution,

			// subtitle
			subtitle: "Actual GFD Report for Cox's Bazar, Bangladesh, GFD Round " + $route.current.params.report_round + ", Distribution " + $route.current.params.report_distribution,
			
			// kobo forms ( inside obbject so i can collapse )
			forms: { list:[] },

			// camp list
			camps: {
				list:[{
						"admin3name" : "Camp 23",
						"admin3pcode" : "CXB-032"
				},{
						"admin3name" : "Camp 25",
						"admin3pcode" : "CXB-017"
				},{
						"admin3name" : "Camp 27",
						"admin3pcode" : "CXB-037"
				},{
						"admin3name" : "Camp 24",
						"admin3pcode" : "CXB-233"
				},{
						"admin3name" : "Camp 16",
						"admin3pcode" : "CXB-224"
				},{
						"admin3name" : "Camp 01W",
						"admin3pcode" : "CXB-202"
				},{
						"admin3name" : "Camp 07",
						"admin3pcode" : "CXB-207"
				},{
						"admin3name" : "Camp 15",
						"admin3pcode" : "CXB-223"
				},{
						"admin3name" : "Camp 01E",
						"admin3pcode" : "CXB-201"
				},{
						"admin3name" : "Kutupalong RC",
						"admin3pcode" : "CXB-221"
				},{
						"admin3name" : "Camp 02E",
						"admin3pcode" : "CXB-203"
				},{
						"admin3name" : "Camp 09",
						"admin3pcode" : "CXB-213"
				},{
						"admin3name" : "Camp 10",
						"admin3pcode" : "CXB-214"
				},{
						"admin3name" : "Camp 13",
						"admin3pcode" : "CXB-220"
				},{
						"admin3name" : "Camp 08W",
						"admin3pcode" : "CXB-211"
				},{
						"admin3name" : "Camp 03",
						"admin3pcode" : "CXB-205"
				},{
						"admin3name" : "Camp 05",
						"admin3pcode" : "CXB-209"
				},{
						"admin3name" : "Camp 18",
						"admin3pcode" : "CXB-215"
				},{
						"admin3name" : "Camp 19",
						"admin3pcode" : "CXB-219"
				},{
						"admin3name" : "Camp 14",
						"admin3pcode" : "CXB-222"
				},{
						"admin3name" : "Camp 06",
						"admin3pcode" : "CXB-208"
				},{
						"admin3name" : "Camp 02W",
						"admin3pcode" : "CXB-204"
				},{
						"admin3name" : "Camp 11",
						"admin3pcode" : "CXB-217"
				},{
						"admin3name" : "Camp 12",
						"admin3pcode" : "CXB-218"
				},{
						"admin3name" : "Camp 17",
						"admin3pcode" : "CXB-212"
				},{
						"admin3name" : "Camp 08E",
						"admin3pcode" : "CXB-210"
				},{
						"admin3name" : "Camp 20",
						"admin3pcode" : "CXB-216"
				},{
						"admin3name" : "Camp 04 Extension",
						"admin3pcode" : "CXB-232"
				},{
						"admin3name" : "Camp 04",
						"admin3pcode" : "CXB-206"
				},{
						"admin3name" : "Camp 20 Extension",
						"admin3pcode" : "CXB-234"
				},{
						"admin3name" : "Nayapara RC",
						"admin3pcode" : "CXB-089"
				},{
						"admin3name" : "Camp 26",
						"admin3pcode" : "CXB-025"
				},{
						"admin3name" : "Camp 22",
						"admin3pcode" : "CXB-085"
				},{
						"admin3name" : "Choukhali",
						"admin3pcode" : "CXB-235"
				},{
						"admin3name" : "Camp 21",
						"admin3pcode" : "CXB-108"
				},{
						"admin3name" : "No Mans Land",
						"admin3pcode" : "CXB-NML"
				}]
			},

			// title
			setTitle: function () {
				// title
				if ( $scope.report.organization_tag === 'wfp' || $scope.report.organization_tag === 'immap' ) {
					$scope.model.header.title.title = 'ALL | ' + $scope.report.title;
				} else {
					$scope.model.header.title.title = $scope.report.organization_tag.toUpperCase() + ' | ' + $scope.report.title;
				}

				// get data
				ngmData.get({
					method: 'POST',
					url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getForms',
					data: {
						admin0pcode: $scope.report.user.admin0pcode,
						organization_tag: $scope.report.organization_tag,
						report_round: $scope.report.report_round,
						report_distribution: $scope.report.report_distribution,
					}
				}).then( function( forms ){
					// set
					$scope.report.forms = forms;
					
					// add GFD point to title
					if ( $scope.report.site_id !== 'all' ) {
						var gfd = $filter( 'filter' )( $scope.report.forms.list, { report_round: $scope.report.report_round, site_id: $scope.report.site_id } )[ 0 ];
						$scope.model.header.title.title += ' | ' + gfd.site_name;
						$scope.model.header.subtitle.title += ', ' + gfd.site_name + ' GFD Point';
					}

					// add camp to title
					if ( $scope.report.admin3pcode !== 'all' ) {
						var camp = $filter( 'filter' )( $scope.report.camps.list, { admin3pcode: $scope.report.admin3pcode } )[ 0 ];
						$scope.model.header.title.title += ' | ' + camp.admin3name;
						$scope.model.header.subtitle.title += ', ' + camp.admin3name;
					}         
				});

			},

			// menu
			setMenu: function () {
				
				// menu
				if ( $scope.report.user.organization_tag === 'wfp' ) {
					$scope.model.menu = [{
						'id': 'search-gfd-organization',
						'icon': 'supervisor_account',
						'title': 'Organization',
						'class': 'teal lighten-1 white-text',
						'rows': [{
							'title': 'ALL',
							'param': 'organization_tag',
							'active': 'wfp',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/actual/wfp/all/all/all/all/' + $scope.report.start_date + '/' + $scope.report.end_date
						},{
							'title': 'AAH',
							'param': 'organization_tag',
							'active': 'aah',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/actual/aah/all/all/all/all/' + $scope.report.start_date + '/' + $scope.report.end_date
						},{
							'title': 'BRAC',
							'param': 'organization_tag',
							'active': 'brac',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/actual/brac/all/all/all/all/' + $scope.report.start_date + '/' + $scope.report.end_date
						},{
							'title': 'RIC',
							'param': 'organization_tag',
							'active': 'ric',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/actual/ric/all/all/all/all/' + $scope.report.start_date + '/' + $scope.report.end_date
						},{
							'title': 'SCI',
							'param': 'organization_tag',
							'active': 'sci',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/actual/sci/all/all/all/all/' + $scope.report.start_date + '/' + $scope.report.end_date
						},{
							'title': 'WVI',
							'param': 'organization_tag',
							'active': 'wvi',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/actual/wvi/all/all/all/all/' + $scope.report.start_date + '/' + $scope.report.end_date
						}]
					}]
				
				}

				// filter by round if WFP
				if ( $scope.report.organization_tag === 'wfp' ||  $scope.report.organization_tag === 'immap' ) {
					var filter = { report_round: $scope.report.report_round }
				} 
				// filter by round and org if !WFP
				if ( $scope.report.organization_tag !== 'wfp' && $scope.report.organization_tag !== 'immap' ) {
					var filter = { report_round: $scope.report.report_round, organization_tag: $scope.report.organization_tag }
				}

				// add GFD menu
				$scope.model.menu.push({
					'id': 'search-location-organization',
					'search': true,
					'icon': 'location_on',
					'title': 'GFD Point',
					'class': 'teal lighten-1 white-text',
					"rows": [{
						'title': 'All',
						'param': 'site_id',
						'active': 'all',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/actual/' + $scope.report.organization_tag + '/all/all/all/all/' + $scope.report.start_date + '/' + $scope.report.end_date
					}]

				});

				// get data
				ngmData.get({
					method: 'POST',
					url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getActualBeneficiariesIndicator',
					data: {
						indicator: 'menu',
						distribution_status: 'actual',
						admin0pcode: $scope.report.user.admin0pcode,
						organization_tag: $scope.report.organization_tag,
						report_round: $scope.report.report_round,
						report_distribution: $scope.report.report_distribution,
						site_id: $scope.report.site_id,
						admin3pcode: $scope.report.admin3pcode,
						admin4pcode: $scope.report.admin4pcode,
						admin5pcode: $scope.report.admin5pcode,
						start_date: $scope.report.reporting_menu_start,
						end_date: $scope.report.reporting_menu_end
					}

				}).then( function( menu ){

					// add rows to GFD menu
					angular.forEach( menu.site_id, function( d ){
						$scope.model.menu[ $scope.model.menu.length-1 ].rows.push({
							'title': d.site_name,
							'param': 'site_id',
							'active': d.site_id,
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/actual/' + d.organization_tag + '/' + d.site_id + '/all/all/all/' + $scope.report.start_date + '/' + $scope.report.end_date
						});
					
					});

					// add camp menu
					$scope.model.menu.push({
						'id': 'search-camp-organization',
						'search': true,
						'icon': 'person_pin',
						'title': 'Beneficiary Camp',
						'class': 'teal lighten-1 white-text',
						"rows": [{
							'title': 'All',
							'param': 'admin3pcode',
							'active': 'all',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/actual/' + $scope.report.organization_tag + '/all/all/all/all/' + $scope.report.start_date + '/' + $scope.report.end_date
						}]
					
					});

					// add rows to GFD menu
					angular.forEach( menu.admin3, function( d ){
						$scope.model.menu[ $scope.model.menu.length-1 ].rows.push({
							'title': d.admin3name,
							'param': 'admin3pcode',
							'active': d.admin3pcode,
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/actual/' + $scope.report.organization_tag + '/' + $scope.report.site_id + '/' + d.admin3pcode + '/all/all/' + $scope.report.start_date + '/' + $scope.report.end_date
						});
					
					});

					// admin4pcode
					if ( $scope.report.admin3pcode !== 'all'  ) {
						$scope.model.menu.push({
							'id': 'search-block-organization',
							'search': true,
							'icon': 'person_pin',
							'title': 'Beneficiary Block',
							'class': 'teal lighten-1 white-text',
							"rows": [{
								'title': 'All',
								'param': 'admin4pcode',
								'active': 'all',
								'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
								'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/actual/' + $scope.report.organization_tag + '/' + $scope.report.site_id + '/' + $scope.report.admin3pcode + '/all/all/' + $scope.report.start_date + '/' + $scope.report.end_date
							}]
						});

						// add rows to GFD menu
						angular.forEach( menu.admin4, function( d ){
							$scope.model.menu[ $scope.model.menu.length-1 ].rows.push({
								'title': d.admin4name,
								'param': 'admin4pcode',
								'active': d.admin4pcode,
								'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
								'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/actual/' + $scope.report.organization_tag + '/' + $scope.report.site_id + '/' + $scope.report.admin3pcode + '/' + d.admin4pcode + '/all/' + $scope.report.start_date + '/' + $scope.report.end_date
							});
						});

						// admin5pcode
						if ( $scope.report.admin4pcode !== 'all'  ) {
							$scope.model.menu.push({
								'id': 'search-sub-block-organization',
								'search': true,
								'icon': 'person_pin',
								'title': 'Beneficiary Sub-Block',
								'class': 'teal lighten-1 white-text',
								"rows": [{
									'title': 'All',
									'param': 'admin5pcode',
									'active': 'all',
									'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
									'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/actual/' + $scope.report.organization_tag + '/' + $scope.report.site_id + '/' + $scope.report.admin3pcode + '/' + $scope.report.admin4pcode + '/all/' + $scope.report.start_date + '/' + $scope.report.end_date
								}]
							});

							// subtitle
							$scope.model.header.subtitle.title += ', ' + menu.admin4[ 0 ].admin4name;

							// add rows to GFD menu
							angular.forEach( menu.admin5, function( d ){
								$scope.model.menu[ $scope.model.menu.length-1 ].rows.push({
									'title': d.admin5name,
									'param': 'admin5pcode',
									'active': d.admin5pcode,
									'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
									'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/actual/' + $scope.report.organization_tag + '/' + $scope.report.site_id + '/' + $scope.report.admin3pcode + '/' + $scope.report.admin4pcode + '/' + d.admin5pcode + '/' + $scope.report.start_date + '/' + $scope.report.end_date
								});
							});

							// subtitle
							if ( $scope.report.admin5pcode !== 'all' ) {
								var subtitle = $filter( 'filter' )( menu.admin5, { 'admin5pcode': $scope.report.admin5pcode } );
								$scope.model.header.subtitle.title += ', ' + subtitle[ 0 ].admin5name;
							}

						}

					}

					// DATE
					$scope.model.menu.push({
						'id': 'search-date-distribution',
						'search': true,
						'icon': 'date_range',
						'title': 'Distribution Date',
						'class': 'teal lighten-1 white-text',
						"rows": [{
							'title': 'All',
							'param': 'end_date',
							'active': 'all',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/actual/' + $scope.report.organization_tag + '/' + $scope.report.site_id + '/' + $scope.report.admin3pcode + '/' + $scope.report.admin4pcode + '/all/' + $scope.report.reporting_period + '/' + moment( $scope.report.reporting_period ).endOf( 'month' ).format( 'YYYY-MM-DD' )
						}]

					});

					// add rows to DATE menu
					angular.forEach( menu.dates, function( d ){
						if ( d.distribution_date_plan ) {
							$scope.model.menu[ $scope.model.menu.length-1 ].rows.push({
								'title': d.distribution_date_plan,
								'param': 'end_date',
								'active': d.distribution_date_plan,
								'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
								'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/actual/' + $scope.report.organization_tag + '/' + $scope.report.site_id + '/' + $scope.report.admin3pcode + '/' + $scope.report.admin4pcode + '/' + $scope.report.admin5pcode + '/' + d.distribution_date_plan + '/' + d.distribution_date_plan
							});
						}
					
					});

				});
			
			},

			// set downloads
			setDownloads: function() {

				// downloads
				var downloads = []

				// distribution list
				if ( $scope.report.organization_tag !== 'wfp' && $scope.report.organization_tag !== 'immap' ) {
					
					// downloads
					downloads.push({
						type: 'pdf',
						color: 'blue',
						icon: 'picture_as_pdf',
						hover: 'Download Planned Distribution Revision',
						request: {
							method: 'POST',
							url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getActualBeneficiariesIndicator',
							data: {
								download: true,
								indicator: 'print_distribution_actual_zip',
								downloadUrl: ngmAuth.LOCATION + '/report/',
								distribution_status: 'actual',
								admin0pcode: $scope.report.user.admin0pcode,
								organization_tag: $scope.report.organization_tag,
								report_round: $scope.report.report_round,
								report_distribution: $scope.report.report_distribution,
								site_id: $scope.report.site_id,
								admin3pcode: $scope.report.admin3pcode,
								admin4pcode: $scope.report.admin4pcode,
								admin5pcode: $scope.report.admin5pcode,
								start_date: $scope.report.start_date,
								end_date: $scope.report.end_date,
								report: $scope.report.organization_tag +'_planned_distribution_revision_round_' + $scope.report.report_round + '_distribution_' + $scope.report.report_distribution + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ),
							}
						},
						metrics: {
							method: 'POST',
							url: ngmAuth.LOCATION + '/api/metrics/set',
							data: {
								organization: $scope.report.user.organization,
								username: $scope.report.user.username,
								email: $scope.report.user.email,
								dashboard: 'gfa_gfd_plan_distribution_list_' + $scope.report.report_round + '_' + $scope.report.report_distribution,
								theme: 'gfa_gfd_plan_distribution_list',
								format: 'csv',
								url: $location.$$path
							}
						}
					
					});		
				
				}				

				// downlaods
				downloads.push({
					type: 'csv',
					color: 'teal lighten-3',
					icon: 'group',
					hover: 'Download Duplicates',
					request: {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getActualBeneficiariesIndicator',
						data: {
							download: true,
							indicator: 'downloads_duplicates',
							distribution_status: 'actual',
							admin0pcode: $scope.report.user.admin0pcode,
							organization_tag: $scope.report.organization_tag,
							report_round: $scope.report.report_round,
							report_distribution: $scope.report.report_distribution,
							site_id: $scope.report.site_id,
							admin3pcode: $scope.report.admin3pcode,
							admin4pcode: $scope.report.admin4pcode,
							admin5pcode: $scope.report.admin5pcode,
							start_date: $scope.report.start_date,
							end_date: $scope.report.end_date,
							report: $scope.report.organization_tag +'_actual_duplicates_round_' + $scope.report.report_round + '_distribution_' + $scope.report.report_distribution + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ),
						}
					},
					metrics: {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/metrics/set',
						data: {
							organization: $scope.report.user.organization,
							username: $scope.report.user.username,
							email: $scope.report.user.email,
							dashboard: 'gfa_gfd_actual_duplicates_' + $scope.report.report_round + '_' + $scope.report.report_distribution,
							theme: 'gfa_gfd_actual_duplicates',
							format: 'csv',
							url: $location.$$path
						}
					}
				},{
					type: 'csv',
					color: 'teal lighten-3',
					icon: 'accessible',
					hover: 'Download Vulnerable Populations',
					request: {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getActualBeneficiariesIndicator',
						data: {
							download: true,
							indicator: 'downloads_vulnerable',
							distribution_status: 'actual',
							admin0pcode: $scope.report.user.admin0pcode,
							organization_tag: $scope.report.organization_tag,
							report_round: $scope.report.report_round,
							report_distribution: $scope.report.report_distribution,
							site_id: $scope.report.site_id,
							admin3pcode: $scope.report.admin3pcode,
							admin4pcode: $scope.report.admin4pcode,
							admin5pcode: $scope.report.admin5pcode,
							start_date: $scope.report.start_date,
							end_date: $scope.report.end_date,
							report: $scope.report.organization_tag +'_actual_vulnerable_popn_round_' + $scope.report.report_round + '_distribution_' + $scope.report.report_distribution + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ),
						}
					},
					metrics: {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/metrics/set',
						data: {
							organization: $scope.report.user.organization,
							username: $scope.report.user.username,
							email: $scope.report.user.email,
							dashboard: 'gfa_gfd_actual_vulnerable_popns_' + $scope.report.report_round + '_' + $scope.report.report_distribution,
							theme: 'gfa_gfd_actual_vulnerable_popns',
							format: 'csv',
							url: $location.$$path
						}
					}
				},{
					type: 'csv',
					color: 'teal lighten-3',
					icon: 'person_outline',
					hover: 'Absent Beneficiaries',
					request: {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getActualBeneficiariesIndicator',
						data: {
							download: true,
							indicator: 'downloads_absent_beneficiaries',
							distribution_status: 'actual',
							admin0pcode: $scope.report.user.admin0pcode,
							organization_tag: $scope.report.organization_tag,
							report_round: $scope.report.report_round,
							report_distribution: $scope.report.report_distribution,
							site_id: $scope.report.site_id,
							admin3pcode: $scope.report.admin3pcode,
							admin4pcode: $scope.report.admin4pcode,
							admin5pcode: $scope.report.admin5pcode,
							start_date: $scope.report.start_date,
							end_date: $scope.report.end_date,
							report: $scope.report.organization_tag +'_absent_beneficiaries_round_' + $scope.report.report_round + '_distribution_' + $scope.report.report_distribution + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ),
						}
					},
					metrics: {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/metrics/set',
						data: {
							organization: $scope.report.user.organization,
							username: $scope.report.user.username,
							email: $scope.report.user.email,
							dashboard: 'gfa_gfd_actual_unplanned_new_beneficiaries_' + $scope.report.report_round + '_' + $scope.report.report_distribution,
							theme: 'gfa_gfd_actual_unplanned_new_beneficiaries',
							format: 'csv',
							url: $location.$$path
						}
					}
				},{
					type: 'csv',
					color: 'teal lighten-3',
					icon: 'person',
					hover: 'Download Actual Beneficiaries',
					request: {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getActualBeneficiariesIndicator',
						data: {
							download: true,
							indicator: 'downloads_beneficiaries',
							distribution_status: 'actual',
							admin0pcode: $scope.report.user.admin0pcode,
							organization_tag: $scope.report.organization_tag,
							report_round: $scope.report.report_round,
							report_distribution: $scope.report.report_distribution,
							site_id: $scope.report.site_id,
							admin3pcode: $scope.report.admin3pcode,
							admin4pcode: $scope.report.admin4pcode,
							admin5pcode: $scope.report.admin5pcode,
							start_date: $scope.report.start_date,
							end_date: $scope.report.end_date,
							report: $scope.report.organization_tag +'_actual_beneficiaries_round_' + $scope.report.report_round + '_distribution_' + $scope.report.report_distribution + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ),
						}
					},
					metrics: {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/metrics/set',
						data: {
							organization: $scope.report.user.organization,
							username: $scope.report.user.username,
							email: $scope.report.user.email,
							dashboard: 'gfa_gfd_actual_beneficiaries_' + $scope.report.report_round + '_' + $scope.report.report_distribution,
							theme: 'gfa_gfd_actual_beneficiaries',
							format: 'csv',
							url: $location.$$path
						}
					}
				},{
					type: 'csv',
					color: 'teal lighten-3',
					icon: 'store',
					hover: 'Download Actual Food Distribution',
					request: {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getActualBeneficiariesIndicator',
						data: {
							download: true,
							indicator: 'downloads_food_distribution_actual',
							distribution_status: 'actual',
							admin0pcode: $scope.report.user.admin0pcode,
							organization_tag: $scope.report.organization_tag,
							report_round: $scope.report.report_round,
							report_distribution: $scope.report.report_distribution,
							site_id: $scope.report.site_id,
							admin3pcode: $scope.report.admin3pcode,
							admin4pcode: $scope.report.admin4pcode,
							admin5pcode: $scope.report.admin5pcode,
							start_date: $scope.report.start_date,
							end_date: $scope.report.end_date,
							report: $scope.report.organization_tag +'_actual_food_distribution_' + $scope.report.report_round + '_distribution_' + $scope.report.report_distribution + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ),
						}
					},
					metrics: {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/metrics/set',
						data: {
							organization: $scope.report.user.organization,
							username: $scope.report.user.username,
							email: $scope.report.user.email,
							dashboard: 'gfa_gfd_actual_food_distribution_' + $scope.report.report_round + '_' + $scope.report.report_distribution,
							theme: 'gfa_gfd_actual_food_distribution',
							format: 'csv',
							url: $location.$$path
						}
					}
				});

				// closing balance
				if ( $scope.report.organization_tag !== 'wfp' && $scope.report.organization_tag !== 'immap' ) {
					
					// downloads
					downloads.push({
						type: 'pdf',
						color: 'teal',
						icon: 'assignment_turned_in',
						hover: 'Download Distribution ' + $scope.report.report_distribution + ' Closing Balance',
						request: {
							method: 'POST',
							url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getActualBeneficiariesIndicator',
							data: {
								download: true,
								indicator: 'downloads_distribution_closing_balance',
								downloadUrl: ngmAuth.LOCATION + '/report/',
								distribution_status: 'actual',
								admin0pcode: $scope.report.user.admin0pcode,
								organization_tag: $scope.report.organization_tag,
								report_round: $scope.report.report_round,
								report_distribution: $scope.report.report_distribution,
								site_id: $scope.report.site_id,
								admin3pcode: $scope.report.admin3pcode,
								admin4pcode: $scope.report.admin4pcode,
								admin5pcode: $scope.report.admin5pcode,
								start_date: $scope.report.start_date,
								end_date: $scope.report.end_date,
								report: $scope.report.organization_tag +'_distribution_closing_balance_round_' + $scope.report.report_round + '_distribution_' + $scope.report.report_distribution + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ),
							}
						},
						metrics: {
							method: 'POST',
							url: ngmAuth.LOCATION + '/api/metrics/set',
							data: {
								organization: $scope.report.user.organization,
								username: $scope.report.user.username,
								email: $scope.report.user.email,
								dashboard: 'gfa_gfd_distribution_closing_balance_' + $scope.report.report_round + '_' + $scope.report.report_distribution,
								theme: 'gfa_gfd_distribution_closing_balance',
								format: 'pdf',
								url: $location.$$path
							}
						}
					});		
				
				}	

				// set downloads
				$scope.model.header.download.downloads = downloads;

			},

			// config of page
			setDashboardConfig: function () {		

				// ACTUAL BENEFICIARIES

				// INDICATORS

				// default indicators 
				$scope.model.rows.push({
					columns: [{
						styleClass: 's12 m12 l2',
						widgets: [{
							type: 'stats',
							style: 'text-align: center;',
							card: 'card-panel stats-card white grey-text text-darken-2',
							config: {
								title: "Family 1-3",
								request: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getActualBeneficiariesIndicator',
									data: {
										indicator: 'family_size_1_3',
										distribution_status: 'actual',
										admin0pcode: $scope.report.user.admin0pcode,
										organization_tag: $scope.report.organization_tag,
										report_round: $scope.report.report_round,
										report_distribution: $scope.report.report_distribution,
										site_id: $scope.report.site_id,
										admin3pcode: $scope.report.admin3pcode,
										admin4pcode: $scope.report.admin4pcode,
										admin5pcode: $scope.report.admin5pcode,
										start_date: $scope.report.start_date,
										end_date: $scope.report.end_date
									}
								}
							}
						}]
					},{
						styleClass: 's12 m12 l2',
						widgets: [{
							type: 'stats',
							style: 'text-align: center;',
							card: 'card-panel stats-card white grey-text text-darken-2',
							config: {
								title: "Family 4-7",
								request: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getActualBeneficiariesIndicator',
									data: {
										indicator: 'family_size_4_7',
										distribution_status: 'actual',
										admin0pcode: $scope.report.user.admin0pcode,
										organization_tag: $scope.report.organization_tag,
										report_round: $scope.report.report_round,
										report_distribution: $scope.report.report_distribution,
										site_id: $scope.report.site_id,
										admin3pcode: $scope.report.admin3pcode,
										admin4pcode: $scope.report.admin4pcode,
										admin5pcode: $scope.report.admin5pcode,
										start_date: $scope.report.start_date,
										end_date: $scope.report.end_date
									}
								}
							}
						}]
					},{
						styleClass: 's12 m12 l2',
						widgets: [{
							type: 'stats',
							style: 'text-align: center;',
							card: 'card-panel stats-card white grey-text text-darken-2',
							config: {
								title: "Family 8-10",
								request: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getActualBeneficiariesIndicator',
									data: {
										indicator: 'family_size_8_10',
										distribution_status: 'actual',
										admin0pcode: $scope.report.user.admin0pcode,
										organization_tag: $scope.report.organization_tag,
										report_round: $scope.report.report_round,
										report_distribution: $scope.report.report_distribution,
										site_id: $scope.report.site_id,
										admin3pcode: $scope.report.admin3pcode,
										admin4pcode: $scope.report.admin4pcode,
										admin5pcode: $scope.report.admin5pcode,
										start_date: $scope.report.start_date,
										end_date: $scope.report.end_date
									}
								}
							}
						}]
					},{
						styleClass: 's12 m12 l2',
						widgets: [{
							type: 'stats',
							style: 'text-align: center;',
							card: 'card-panel stats-card white grey-text text-darken-2',
							config: {
								title: "Family 11+",
								request: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getActualBeneficiariesIndicator',
									data: {
										indicator: 'family_size_11+',
										distribution_status: 'actual',
										admin0pcode: $scope.report.user.admin0pcode,
										organization_tag: $scope.report.organization_tag,
										report_round: $scope.report.report_round,
										report_distribution: $scope.report.report_distribution,
										site_id: $scope.report.site_id,
										admin3pcode: $scope.report.admin3pcode,
										admin4pcode: $scope.report.admin4pcode,
										admin5pcode: $scope.report.admin5pcode,                   
										start_date: $scope.report.start_date,
										end_date: $scope.report.end_date
									}
								}
							}
						}]
					},{
						styleClass: 's12 m12 l4',
						widgets: [{
							type: 'stats',
							style: 'text-align: center;',
							card: 'card-panel stats-card white grey-text text-darken-2',
							config: {
								title: "Total Families",
								request: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getActualBeneficiariesIndicator',
									data: {
										indicator: 'total',
										distribution_status: 'actual',
										admin0pcode: $scope.report.user.admin0pcode,
										organization_tag: $scope.report.organization_tag,
										report_round: $scope.report.report_round,
										report_distribution: $scope.report.report_distribution,
										site_id: $scope.report.site_id,
										admin3pcode: $scope.report.admin3pcode,
										admin4pcode: $scope.report.admin4pcode,
										admin5pcode: $scope.report.admin5pcode,
										start_date: $scope.report.start_date,
										end_date: $scope.report.end_date
									}
								}
							}
						}]
					}]
				
				});
				
				// highlights
				$scope.model.rows.push({
					columns: [{
						styleClass: 's12 m12 l3',
						widgets: [{
							type: 'stats',
							style: 'text-align: center;',
							card: 'card-panel stats-card indigo lighten-5 grey-text text-darken-2',
							config: {
								title: "Rice (Mt)",
								display: {
									fractionSize: 3
								},
								request: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getActualBeneficiariesIndicator',
									data: {
										indicator: 'rice',
										distribution_status: 'actual',
										admin0pcode: $scope.report.user.admin0pcode,
										organization_tag: $scope.report.organization_tag,
										report_round: $scope.report.report_round,
										report_distribution: $scope.report.report_distribution,
										site_id: $scope.report.site_id,
										admin3pcode: $scope.report.admin3pcode,
										admin4pcode: $scope.report.admin4pcode,
										admin5pcode: $scope.report.admin5pcode,
										start_date: $scope.report.start_date,
										end_date: $scope.report.end_date
									}
								}
							}
						}]
					},{
						styleClass: 's12 m12 l3',
						widgets: [{
							type: 'stats',
							style: 'text-align: center;',
							card: 'card-panel stats-card indigo lighten-5 grey-text text-darken-2',
							config: {
								title: "Lentils (Mt)",
								display: {
									fractionSize: 3
								},
								request: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getActualBeneficiariesIndicator',
									data: {
										indicator: 'lentils',
										distribution_status: 'actual',
										admin0pcode: $scope.report.user.admin0pcode,
										organization_tag: $scope.report.organization_tag,
										report_round: $scope.report.report_round,
										report_distribution: $scope.report.report_distribution,
										site_id: $scope.report.site_id,
										admin3pcode: $scope.report.admin3pcode,
										admin4pcode: $scope.report.admin4pcode,
										admin5pcode: $scope.report.admin5pcode,
										start_date: $scope.report.start_date,
										end_date: $scope.report.end_date
									}
								}
							}
						}]
					},{
						styleClass: 's12 m12 l3',
						widgets: [{
							type: 'stats',
							style: 'text-align: center;',
							card: 'card-panel stats-card indigo lighten-5 grey-text text-darken-2',
							config: {
								title: "Oil (Mt)",
								display: {
									fractionSize: 3
								},
								request: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getActualBeneficiariesIndicator',
									data: {
										indicator: 'oil',
										distribution_status: 'actual',
										admin0pcode: $scope.report.user.admin0pcode,
										organization_tag: $scope.report.organization_tag,
										report_round: $scope.report.report_round,
										report_distribution: $scope.report.report_distribution,
										site_id: $scope.report.site_id,
										admin3pcode: $scope.report.admin3pcode,
										admin4pcode: $scope.report.admin4pcode,
										admin5pcode: $scope.report.admin5pcode,
										start_date: $scope.report.start_date,
										end_date: $scope.report.end_date
									}
								}
							}
						}]
					},{
						styleClass: 's12 m12 l3',
						widgets: [{
							type: 'stats',
							style: 'text-align: center;',
							card: 'card-panel stats-card indigo lighten-5 grey-text text-darken-2',
							config: {
								title: "Total Entitlements (Mt)",
								display: {
									fractionSize: 2
								},
								request: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getActualBeneficiariesIndicator',
									data: {
										indicator: 'entitlements',
										distribution_status: 'actual',
										admin0pcode: $scope.report.user.admin0pcode,
										organization_tag: $scope.report.organization_tag,
										report_round: $scope.report.report_round,
										report_distribution: $scope.report.report_distribution,
										site_id: $scope.report.site_id,
										admin3pcode: $scope.report.admin3pcode,
										admin4pcode: $scope.report.admin4pcode,
										admin5pcode: $scope.report.admin5pcode,
										start_date: $scope.report.start_date,
										end_date: $scope.report.end_date
									}
								}
							}
						}]
					}]
				
				}); 

				// TABLE

				// duplicate table
				$scope.model.rows.push({
					columns: [{
						styleClass: 's12 m12 l12',
						widgets: [{
							type: 'table',
							card: 'panel',
							config: {
								duplicate: true,
								headerClass: 'collection-header red lighten-2',
								headerText: 'white-text',
								headerIcon: 'group',
								headerTitle: "Duplicate FCN's",
								templateUrl: '/scripts/widgets/ngm-table/templates/bgd/gfd/beneficiaries.table.plan.html',
								tableOptions:{
									count: 10
								},
								request: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getActualBeneficiariesIndicator',
									data: {
										indicator: 'beneficiaries_duplicate_list',
										distribution_status: 'actual',
										admin0pcode: $scope.report.user.admin0pcode,
										organization_tag: $scope.report.organization_tag,
										report_round: $scope.report.report_round,
										report_distribution: $scope.report.report_distribution,
										site_id: $scope.report.site_id,
										admin3pcode: $scope.report.admin3pcode,
										admin4pcode: $scope.report.admin4pcode,
										admin5pcode: $scope.report.admin5pcode,
										start_date: $scope.report.start_date,
										end_date: $scope.report.end_date
									}
								}
							}
						}]
					}]
				
				});

				// absent table
				$scope.model.rows.push({
					columns: [{
						styleClass: 's12 m12 l12',
						widgets: [{
							type: 'table',
							card: 'panel',
							config: {
								duplicate: true,
								headerClass: 'collection-header blue-grey lighten-2',
								headerText: 'white-text',
								headerIcon: 'group',
								headerTitle: "Absent Beneficiaries",
								templateUrl: '/scripts/widgets/ngm-table/templates/bgd/gfd/beneficiaries.table.plan.html',
								tableOptions:{
									count: 10
								},
								request: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getPlannedBeneficiariesIndicator',
									data: {
										indicator: 'beneficiaries_absent_list',
										distribution_status: 'absent',
										admin0pcode: $scope.report.user.admin0pcode,
										organization_tag: $scope.report.organization_tag,
										report_round: $scope.report.report_round,
										report_distribution: $scope.report.report_distribution,
										site_id: $scope.report.site_id,
										admin3pcode: $scope.report.admin3pcode,
										admin4pcode: $scope.report.admin4pcode,
										admin5pcode: $scope.report.admin5pcode,
										start_date: $scope.report.start_date,
										end_date: $scope.report.end_date
									}
								}
							}
						}]
					}]
				
				});

				// data table
				$scope.model.rows.push({
					columns: [{
						styleClass: 's12 m12 l12',
						widgets: [{
							type: 'table',
							card: 'panel',
							config: {
								headerClass: 'collection-header teal lighten-2',
								headerText: 'white-text',
								headerIcon: 'assignment_turned_in',
								headerTitle: "Actual Beneficiaries List",
								site_name: 'actual_site_name',
								gfd_family_size: 'actual_gfd_family_size',
								templateUrl: '/scripts/widgets/ngm-table/templates/bgd/gfd/beneficiaries.table.actual.html',
								tableOptions:{
									count: 30
								},
								request: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getActualBeneficiariesIndicator',
									data: {
										indicator: 'beneficiaries_list',
										distribution_status: 'actual',
										admin0pcode: $scope.report.user.admin0pcode,
										organization_tag: $scope.report.organization_tag,
										report_round: $scope.report.report_round,
										report_distribution: $scope.report.report_distribution,
										site_id: $scope.report.site_id,
										admin3pcode: $scope.report.admin3pcode,
										admin4pcode: $scope.report.admin4pcode,
										admin5pcode: $scope.report.admin5pcode,
										start_date: $scope.report.start_date,
										end_date: $scope.report.end_date
									}
								}
							}
						}]
					}]
				
				});

				// footer
				$scope.model.rows.push({
					columns: [{
						styleClass: 's12 m12 l12',
						widgets: [{
							type: 'html',
							card: 'card-panel',
							style: 'padding:0px; height: 90px; padding-top:10px;',
							config: {
								html: $scope.report.ngm.footer
							}
						}]
					}]
				
				});

			},

			// init
			init: function() {

				// report dashboard model
				$scope.model = {
					name: 'report_distribution_actual',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m12 l8 report-title truncate',
							style: 'font-size: 2.3rem; font-weight: 300; color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: $scope.report.title
						},
						subtitle: {
							'class': 'col hide-on-small-only report-subtitle truncate m8 l9',
							style: 'font-weight: 400;',
							title: $scope.report.subtitle
						},
						datePicker: {
							'class': 'col s12 m4 l3',
							dates: [{
								style: 'float:left;',
								label: $filter('translate')('from'),
								format: 'd mmm, yyyy',
								min: $scope.report.reporting_period,
								max: moment( $scope.report.reporting_period ).endOf( 'month' ).format( 'YYYY-MM-DD' ),
								currentTime: $scope.report.start_date,
								onClose: function(){
									// set date
									var date = moment(new Date(this.currentTime)).format('YYYY-MM-DD');
									if ( date !== $scope.report.start_date ) {
										// set new date
										$scope.report.start_date = date;
										// path
										var path = '/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round +
																	'/distribution/' + $scope.report.report_distribution +
																	'/' + $scope.report.reporting_period +
																	'/actual/' + $scope.report.organization_tag +
																	'/' + $scope.report.site_id +
																	'/' + $scope.report.admin3pcode +
																	'/' + $scope.report.admin4pcode +
																	'/' + $scope.report.admin5pcode +
																	'/' + $scope.report.start_date +
																	'/' + $scope.report.end_date;
										// set path
										$location.path( path );
									}
								}
							},{
								style: 'float:right',
								label: $filter('translate')('to'),
								format: 'd mmm, yyyy',
								min: $scope.report.reporting_period,
								max: moment( $scope.report.reporting_period ).endOf( 'month' ).format( 'YYYY-MM-DD' ),
								currentTime: $scope.report.end_date,
								onClose: function(){
									// set date
									var date = moment(new Date(this.currentTime)).format('YYYY-MM-DD')
									if ( date !== $scope.report.end_date ) {
										// set new date
										$scope.report.end_date = date;
											// path
										var path = '/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round +
																	'/distribution/' + $scope.report.report_distribution +
																	'/' + $scope.report.reporting_period +
																	'/actual/' + $scope.report.organization_tag +
																	'/' + $scope.report.site_id +
																	'/' + $scope.report.admin3pcode +
																	'/' + $scope.report.admin4pcode +
																	'/' + $scope.report.admin5pcode +
																	'/' + $scope.report.start_date +
																	'/' + $scope.report.end_date;
										// set path
										$location.path( path );
									}
								}
							}]
						},
						download: {
							'class': 'col s12 m4 l4 hide-on-small-only'
						}
					},
					menu:[],
					rows: [{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'white grey-text text-darken-2',
								style: 'padding: 20px;',
								config: {                 
									// html
									templateUrl: '/scripts/widgets/ngm-html/template/bgd/gfd/dashboard.btns.html',
									// send request
									request: {
										method: 'POST',
										url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getActualBeneficiariesIndicator',
										data: {
											indicator: 'latest',
											distribution_status: 'actual',
											admin0pcode: $scope.report.user.admin0pcode,
											organization_tag: $scope.report.organization_tag,
											report_round: $scope.report.report_round,
											report_distribution: $scope.report.report_distribution,
											site_id: $scope.report.site_id,
											admin3pcode: $scope.report.admin3pcode,
											admin4pcode: $scope.report.admin4pcode,
											admin5pcode: $scope.report.admin5pcode,
											start_date: $scope.report.start_date,
											end_date: $scope.report.end_date
										}
									},
									// config
									helper: {
										// details for btns
										title: 'Back to Distribution Round ' + $scope.report.report_distribution,
										url: '#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period,
										today_url: '#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/actual/' +  $scope.report.organization_tag + '/all/all/all/all/' + moment().format( 'YYYY-MM-DD' ) + '/' + moment().format( 'YYYY-MM-DD' ),
										distribution_period_url: '#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/actual/' +  $scope.report.organization_tag + '/all/all/all/all/' + $scope.report.reporting_period + '/' + moment( $scope.report.reporting_period ).endOf( 'month' ).format( 'YYYY-MM-DD' )
									}
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'card-panel',
								style: 'padding:0px;',
								config: {
									header: 'collection-header orange',
									icon: 'check_circle',
									minimize: {
										open: false,
										toggle: false,
										disabled: true
									},
									message: 'Achievements',
									report_round: $scope.report.report_round,
									report_distribution: $scope.report.report_distribution,
									templateUrl: '/scripts/widgets/ngm-html/template/bgd/gfd/daily.report.forms.html',
								}
							}]
						}]
					},{           
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'white grey-text text-darken-2',
								style: 'padding: 0px;',
							}]
						}]          
					}]
				
				};

				// set title
				$scope.report.setTitle();

				// set menu
				$scope.report.setMenu();

				// set downloads
				$scope.report.setDownloads();
				
				// set config
				$scope.report.setDashboardConfig();

				// assign to ngm app scope
				$scope.report.ngm.dashboard.model = $scope.model;

				setTimeout(() => {
					$('.fixed-action-btn').floatingActionButton({ direction: 'left' });
				}, 0);

			}

		}   
		
		// init
		$scope.report.init();
		
	}]);
