/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardBgdCxbGfdRoundPlanCtrl
 * @description
 * # ClusterProjectProjectsCtrl
 * Controller of the ngmReportHub
 */
angular.module( 'ngmReportHub' )
	.controller('DashboardBgdCxbGfdRoundPlanCtrl', ['$scope', '$location', '$route', 'ngmAuth', 'ngmData', 'ngmUser', 'ngmClusterHelper', '$translate', '$filter', function ($scope, $location, $route, ngmAuth, ngmData, ngmUser, ngmClusterHelper, $translate, $filter ) {
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

			// title
			title: "GFD | Plan | R" + $route.current.params.report_round + " | D" + $route.current.params.report_distribution,

			// subtitle
			subtitle: "Planned Beneficiaries for Cox's Bazar, Bangladesh, GFD Round " + $route.current.params.report_round + ", Distribution " + $route.current.params.report_distribution,

			// kobo forms ( inside obbject so i can collapse )
			forms: {
				list: [{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Action Against Hunger",
				  "organization_tag" : "aah",
				  "organization" : "AAH",
				  "organization_id" : "5c029988c7eb9d9a2410b095",
					"report_round": '1',
				  "site_id" : "jadimura",
				  "site_name" : "Jadimura",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aWJgXQrLcSMMX4pYax4DkJ',
				  "form_template": "wfp_cxb_gfd_report_aah_jadimura_rd_1",
				  "form_title": "GFD Daily Report: AAH, Jadimura, Round 1",
				  "url":"https://ee.humanitarianresponse.info/x/#BXtmpdNJ"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Action Against Hunger",
				  "organization_tag" : "aah",
				  "organization" : "AAH",
				  "organization_id" : "5c029988c7eb9d9a2410b095",
					"report_round": '2',
				  "site_id" : "jadimura",
				  "site_name" : "Jadimura",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'ay62hNEFBkGyxZ8Siq4SqH',
				  "form_template": "wfp_cxb_gfd_report_aah_jadimura_rd_2",
				  "form_title": "GFD Daily Report: AAH, Jadimura, Round 2",
				  "url":"https://ee.humanitarianresponse.info/x/#hZ9Rh2b1"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Action Against Hunger",
				  "organization_tag" : "aah",
				  "organization" : "AAH",
				  "organization_id" : "5c029988c7eb9d9a2410b095",
					"report_round": '1',
				  "site_id" : "leda_ms",
				  "site_name" : "Leda MS",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aRzwhveXit6cwwhwE3Kyzc',
				  "form_template": "wfp_cxb_gfd_report_aah_leda_ms_rd_1",
				  "form_title": "GFD Daily Report: AAH, Leda MS, Round 1",
				  "url":"https://ee.humanitarianresponse.info/x/#ROisDrb7"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Action Against Hunger",
				  "organization_tag" : "aah",
				  "organization" : "AAH",
				  "organization_id" : "5c029988c7eb9d9a2410b095",
					"report_round": '2',
				  "site_id" : "leda_ms",
				  "site_name" : "Leda MS",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aLbYK4kV3VkFsMGSFM85bj',
				  "form_template": "wfp_cxb_gfd_report_aah_leda_ms_rd_2",
				  "form_title": "GFD Daily Report: AAH, Leda MS, Round 2",
				  "url":"https://ee.humanitarianresponse.info/x/#sO4Tqbw8"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Action Against Hunger",
				  "organization_tag" : "aah",
				  "organization" : "AAH",
				  "organization_id" : "5c029988c7eb9d9a2410b095",
					"report_round": '1',
				  "site_id" : "shamlapur",
				  "site_name" : "Shamlapur",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'a7h88ArTtBueCJehMtHFPR',
				  "form_template": "wfp_cxb_gfd_report_aah_shamlapur_rd_1",
				  "form_title": "GFD Daily Report: AAH, Shamlapur, Round 1",
				  "url":"https://ee.humanitarianresponse.info/x/#b9lGbttX"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Action Against Hunger",
				  "organization_tag" : "aah",
				  "organization" : "AAH",
				  "organization_id" : "5c029988c7eb9d9a2410b095",
					"report_round": '2',
				  "site_id" : "shamlapur",
				  "site_name" : "Shamlapur",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'ac37M3peUwey9Hxtx8UBFY',
				  "form_template": "wfp_cxb_gfd_report_aah_shamlapur_rd_2",
				  "form_title": "GFD Daily Report: AAH, Shamlapur, Round 2",
				  "url":"https://ee.humanitarianresponse.info/x/#gXF1VI55"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Building Resources Across Communities",
				  "organization_tag" : "brac",
				  "organization" : "BRAC",  
				  "organization_id" : "5c029f3f3e7ee3a1245bce61",
					"report_round": '1',
				  "site_id" : "lambashia",
				  "site_name" : "Lambashia",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aimfrsjrv8m7CErhFogupv',
				  "form_template": "wfp_cxb_gfd_report_brac_lambashia_rd_1",
				  "form_title": "GFD Daily Report: BRAC, Lambashia, Round 1",
				  "url":"https://ee.humanitarianresponse.info/x/#pHGaW0wP"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Building Resources Across Communities",
				  "organization_tag" : "brac",
				  "organization" : "BRAC",  
				  "organization_id" : "5c029f3f3e7ee3a1245bce61",
					"report_round": '2',
				  "site_id" : "lambashia",
				  "site_name" : "Lambashia",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aRaDkAD5fGDRgMybqmdnyM',
				  "form_template": "wfp_cxb_gfd_report_brac_lambashia_rd_2",
				  "form_title": "GFD Daily Report: BRAC, Lambashia, Round 2",
				  "url":"https://ee.humanitarianresponse.info/x/#Lbs4728E"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Building Resources Across Communities",
				  "organization_tag" : "brac",
				  "organization" : "BRAC",  
				  "organization_id" : "5c029f3f3e7ee3a1245bce61",
					"report_round": '1',
				  "site_id" : "modhur_chara_1",
				  "site_name" : "Modhur Chara 1",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aBh5rSmMhVBT5dL2mizvvf',
				  "form_template": "wfp_cxb_gfd_report_brac_modhur_chara_1_rd_1",
				  "form_title": "GFD Daily Report: BRAC, Modhur Chara 1, Round 1",
				  "url":"https://ee.humanitarianresponse.info/x/#4j2hle8k"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Building Resources Across Communities",
				  "organization_tag" : "brac",
				  "organization" : "BRAC",  
				  "organization_id" : "5c029f3f3e7ee3a1245bce61",
					"report_round": '2',
				  "site_id" : "modhur_chara_1",
				  "site_name" : "Modhur Chara 1",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aY435WAFYnaidSdkndriJF',
				  "form_template": "wfp_cxb_gfd_report_brac_modhur_chara_1_rd_2",
				  "form_title": "GFD Daily Report: BRAC, Modhur Chara 1, Round 2",
				  "url":"https://ee.humanitarianresponse.info/x/#mqFp5KzU"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Building Resources Across Communities",
				  "organization_tag" : "brac",
				  "organization" : "BRAC",  
				  "organization_id" : "5c029f3f3e7ee3a1245bce61",
					"report_round": '1',
				  "site_id" : "tv_tower",
				  "site_name" : "TV Tower",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aiSUuDK5X6ArbA6ierghw5',
				  "form_template": "wfp_cxb_gfd_report_brac_tv_tower_rd_1",
				  "form_title": "GFD Daily Report: BRAC, TV Tower, Round 1",
				  "url":"https://ee.humanitarianresponse.info/x/#6yXhLHBK"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Building Resources Across Communities",
				  "organization_tag" : "brac",
				  "organization" : "BRAC",  
				  "organization_id" : "5c029f3f3e7ee3a1245bce61",
					"report_round": '2',
				  "site_id" : "tv_tower",
				  "site_name" : "TV Tower",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'a8k8u7tHLd75DoHqYPuNVZ',
				  "form_template": "wfp_cxb_gfd_report_brac_tv_tower_rd_2",
				  "form_title": "GFD Daily Report: BRAC, TV Tower, Round 2",
				  "url":"https://ee.humanitarianresponse.info/x/#uAlxQQnX"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Resource Integration Centre",
				  "organization_tag" : "ric",
				  "organization" : "RIC",
				  "organization_id" : "5c7e6aef5d8f0ad60bbe41b5",
					"report_round": '1',
				  "site_id" : "bagghona",
				  "site_name" : "Bagghona",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aiVnuNVgbocrpCa3vroUA3',
				  "form_template": "wfp_cxb_gfd_report_ric_bagghona_rd_1",
				  "form_title": "GFD Daily Report: RIC, Bagghona, Round 1",
				  "url":"https://ee.humanitarianresponse.info/x/#pchD8ObP"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Resource Integration Centre",
				  "organization_tag" : "ric",
				  "organization" : "RIC",
				  "organization_id" : "5c7e6aef5d8f0ad60bbe41b5",
					"report_round": '2',
				  "site_id" : "bagghona",
				  "site_name" : "Bagghona",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'a4aK7oKNiFc36N9k9GYE5u',
				  "form_template": "wfp_cxb_gfd_report_ric_bagghona_rd_2",
				  "form_title": "GFD Daily Report: RIC, Bagghona, Round 2",
				  "url":"https://ee.humanitarianresponse.info/x/#ozQfPYB1"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Resource Integration Centre",
				  "organization_tag" : "ric",
				  "organization" : "RIC",
				  "organization_id" : "5c7e6aef5d8f0ad60bbe41b5",
					"report_round": '1',
				  "site_id" : "hakimpara",
				  "site_name" : "Hakimpara",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'apHLE7MVXEVkThvnW7mFaw',
				  "form_template": "wfp_cxb_gfd_report_ric_hakimpara_rd_1",
				  "form_title": "GFD Daily Report: RIC, Hakimpara, Round 1",
				  "url":"https://ee.humanitarianresponse.info/x/#pknQuWtz"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Resource Integration Centre",
				  "organization_tag" : "ric",
				  "organization" : "RIC",
				  "organization_id" : "5c7e6aef5d8f0ad60bbe41b5",
					"report_round": '2',
				  "site_id" : "hakimpara",
				  "site_name" : "Hakimpara",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'agEdGJZ9BNBpZ7D9gijhtJ',
				  "form_template": "wfp_cxb_gfd_report_ric_hakimpara_rd_2",
				  "form_title": "GFD Daily Report: RIC, Hakimpara, Round 2",
				  "url":"https://ee.humanitarianresponse.info/x/#9ywjP5gg"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Resource Integration Centre",
				  "organization_tag" : "ric",
				  "organization" : "RIC",
				  "organization_id" : "5c7e6aef5d8f0ad60bbe41b5",
					"report_round": '1',
				  "site_id" : "jamtoli",
				  "site_name" : "Jamtoli",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'ahJauwX7UUomH3fmHoqCGv',
				  "form_template": "wfp_cxb_gfd_report_ric_jamtoli_rd_1",
				  "form_title": "GFD Daily Report: RIC, Jamtoli, Round 1",
				  "url":"https://ee.humanitarianresponse.info/x/#eSws5gkl"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Resource Integration Centre",
				  "organization_tag" : "ric",
				  "organization" : "RIC",
				  "organization_id" : "5c7e6aef5d8f0ad60bbe41b5",
					"report_round": '2',
				  "site_id" : "jamtoli",
				  "site_name" : "Jamtoli",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aaySJgBCwXEteBCwpzWJ7D',
				  "form_template": "wfp_cxb_gfd_report_ric_jamtoli_rd_2",
				  "form_title": "GFD Daily Report: RIC, Jamtoli, Round 2",
				  "url":"https://ee.humanitarianresponse.info/x/#XLUswQff"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Save the Children Federation International",
				  "organization_tag" : "sci",
				  "organization" : "SCI",
				  "organization_id" : "5c02990e3e7ee3a1245bc642",
					"report_round": '1',
				  "site_id" : "burma_para",
				  "site_name" : "Burma Para",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aBt5a9motKDadVoZGLecss',
				  "form_template": "wfp_cxb_gfd_report_sci_burma_para_rd_1",
				  "form_title": "GFD Daily Report: SCI, Burma Para, Round 1",
				  "url":"https://ee.humanitarianresponse.info/x/#XLUswQff"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Save the Children Federation International",
				  "organization_tag" : "sci",
				  "organization" : "SCI",
				  "organization_id" : "5c02990e3e7ee3a1245bc642",
					"report_round": '2',
				  "site_id" : "burma_para",
				  "site_name" : "Burma Para",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'adgtczSdb4CfBgsk2qiyMG',
				  "form_template": "wfp_cxb_gfd_report_sci_burma_para_rd_2",
				  "form_title": "GFD Daily Report: SCI, Burma Para, Round 2",
				  "url":"https://ee.humanitarianresponse.info/x/#PBuVXji2"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Save the Children Federation International",
				  "organization_tag" : "sci",
				  "organization" : "SCI",
				  "organization_id" : "5c02990e3e7ee3a1245bc642",
					"report_round": '1',
				  "site_id" : "camp_4_ext",
				  "site_name" : "Camp 04 Ext",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'a7BiMZx87NetYF3yo9A2ae',
				  "form_template": "wfp_cxb_gfd_report_sci_camp_04_ext_rd_1",
				  "form_title": "GFD Daily Report: SCI, Camp 04 Ext, Round 1",
				  "url":"https://ee.humanitarianresponse.info/x/#tr8tbkOD"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Save the Children Federation International",
				  "organization_tag" : "sci",
				  "organization" : "SCI",
				  "organization_id" : "5c02990e3e7ee3a1245bc642",
					"report_round": '2',
				  "site_id" : "camp_4_ext",
				  "site_name" : "Camp 04 Ext",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'axEHQwuYqpMRkawJXiUSGa',
				  "form_template": "wfp_cxb_gfd_report_sci_camp_04_ext_rd_2",
				  "form_title": "GFD Daily Report: SCI, Camp 04 Ext, Round 2",
				  "url":"https://ee.humanitarianresponse.info/x/#Yu5XOdTl"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Save the Children Federation International",
				  "organization_tag" : "sci",
				  "organization" : "SCI",
				  "organization_id" : "5c02990e3e7ee3a1245bc642",
					"report_round": '1',
				  "site_id" : "camp_17",
				  "site_name" : "Camp 17",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aFBnRSYpDH26MBCiiE8fem',
				  "form_template": "wfp_cxb_gfd_report_sci_camp_17_rd_1",
				  "form_title": "GFD Daily Report: SCI, Camp 17, Round 1",
				  "url":"https://ee.humanitarianresponse.info/x/#dxhyQcY6"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Save the Children Federation International",
				  "organization_tag" : "sci",
				  "organization" : "SCI",
				  "organization_id" : "5c02990e3e7ee3a1245bc642",
					"report_round": '2',
				  "site_id" : "camp_17",
				  "site_name" : "Camp 17",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aSSyHZUfPZMATWJVHqpC7V',
				  "form_template": "wfp_cxb_gfd_report_sci_camp_17_rd_2",
				  "form_title": "GFD Daily Report: SCI, Camp 17, Round 2",
				  "url":"https://ee.humanitarianresponse.info/x/#b1blxGTq"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Save the Children Federation International",
				  "organization_tag" : "sci",
				  "organization" : "SCI",
				  "organization_id" : "5c02990e3e7ee3a1245bc642",
					"report_round": '1',
				  "site_id" : "camp_19",
				  "site_name" : "Camp 19",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'arS6aDKLK55ZCt2mBYM8kf',
				  "form_template": "wfp_cxb_gfd_report_sci_camp_19_rd_1",
				  "form_title": "GFD Daily Report: SCI, Camp 19, Round 1",
				  "url":"https://ee.humanitarianresponse.info/x/#N3x1PaHm"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Save the Children Federation International",
				  "organization_tag" : "sci",
				  "organization" : "SCI",
				  "organization_id" : "5c02990e3e7ee3a1245bc642",
					"report_round": '2',
				  "site_id" : "camp_19",
				  "site_name" : "Camp 19",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aJidGM9Aa5bkKbwDXqzrZ8',
				  "form_template": "wfp_cxb_gfd_report_sci_camp_19_rd_2",
				  "form_title": "GFD Daily Report: SCI, Camp 19, Round 2",
				  "url":"https://ee.humanitarianresponse.info/x/#WLmPehkH"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Save the Children Federation International",
				  "organization_tag" : "sci",
				  "organization" : "SCI",
				  "organization_id" : "5c02990e3e7ee3a1245bc642",
					"report_round": '1',
				  "site_id" : "camp_20_ext",
				  "site_name" : "Camp 20 Ext",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aYmbP3VndJhfSW38W7tHc7',
				  "form_template": "wfp_cxb_gfd_report_sci_camp_20_ext_rd_1",
				  "form_title": "GFD Daily Report: SCI, Camp 20 Ext, Round 1",
				  "url":"https://ee.humanitarianresponse.info/x/#Q8AkBBSi"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Save the Children Federation International",
				  "organization_tag" : "sci",
				  "organization" : "SCI",
				  "organization_id" : "5c02990e3e7ee3a1245bc642",
					"report_round": '2',
				  "site_id" : "camp_20_ext",
				  "site_name" : "Camp 20 Ext",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aW2R4wzzt6JTWCughPkCfE',
				  "form_template": "wfp_cxb_gfd_report_sci_camp_20_ext_rd_2",
				  "form_title": "GFD Daily Report: SCI, Camp 20 Ext, Round 2",
				  "url":"https://ee.humanitarianresponse.info/x/#3XiB0Wb5"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Save the Children Federation International",
				  "organization_tag" : "sci",
				  "organization" : "SCI",
				  "organization_id" : "5c02990e3e7ee3a1245bc642",
					"report_round": '1',
				  "site_id" : "modhur_chara_2",
				  "site_name" : "Modhur Chara 2",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aaVpBgKdjhgWBXbGw2z8fq',
				  "form_template": "wfp_cxb_gfd_report_sci_modhur_chara_2_rd_1",
				  "form_title": "GFD Daily Report: SCI, Modhur Chara 2, Round 1",
				  "url":"https://ee.humanitarianresponse.info/x/#yormyyZw"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Save the Children Federation International",
				  "organization_tag" : "sci",
				  "organization" : "SCI",
				  "organization_id" : "5c02990e3e7ee3a1245bc642",
					"report_round": '2',
				  "site_id" : "modhur_chara_2",
				  "site_name" : "Modhur Chara 2",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aQYd5paqY8Cn2Fks42xaD6',
				  "form_template": "wfp_cxb_gfd_report_sci_modhur_chara_2_rd_2",
				  "form_title": "GFD Daily Report: SCI, Modhur Chara 2, Round 2",
				  "url":"https://ee.humanitarianresponse.info/x/#M5fu0D2I"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Save the Children Federation International",
				  "organization_tag" : "sci",
				  "organization" : "SCI",
				  "organization_id" : "5c02990e3e7ee3a1245bc642",
					"report_round": '1',
				  "site_id" : "modhur_chara_3",
				  "site_name" : "Modhur Chara 3",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'atiE7eF5oDz35W8YAsnckN',
				  "form_template": "wfp_cxb_gfd_report_sci_modhur_chara_3_rd_1",
				  "form_title": "GFD Daily Report: SCI, Modhur Chara 3, Round 1",
				  "url":"https://ee.humanitarianresponse.info/x/#yvZdnfq1"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Save the Children Federation International",
				  "organization_tag" : "sci",
				  "organization" : "SCI",
				  "organization_id" : "5c02990e3e7ee3a1245bc642",
					"report_round": '2',
				  "site_id" : "modhur_chara_3",
				  "site_name" : "Modhur Chara 3",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aXZsDPKoJXnKhdNtE6w5b3',
				  "form_template": "wfp_cxb_gfd_report_sci_modhur_chara_3_rd_2",
				  "form_title": "GFD Daily Report: SCI, Modhur Chara 3, Round 2",
				  "url":"https://ee.humanitarianresponse.info/x/#L8aoaJSi"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Save the Children Federation International",
				  "organization_tag" : "sci",
				  "organization" : "SCI",
				  "organization_id" : "5c02990e3e7ee3a1245bc642",
					"report_round": '1',
				  "site_id" : "modhur_chara_4",
				  "site_name" : "Modhur Chara 4",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aiaoT6uiinorCBNw9wWC3w',
				  "form_template": "wfp_cxb_gfd_report_sci_modhur_chara_4_rd_1",
				  "form_title": "GFD Daily Report: SCI, Modhur Chara 4, Round 1",
				  "url":"https://ee.humanitarianresponse.info/x/#7xopnHWt"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "Save the Children Federation International",
				  "organization_tag" : "sci",
				  "organization" : "SCI",
				  "organization_id" : "5c02990e3e7ee3a1245bc642",
					"report_round": '2',
				  "site_id" : "modhur_chara_4",
				  "site_name" : "Modhur Chara 4",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aoAjvVobUei5uuADGS69kB',
				  "form_template": "wfp_cxb_gfd_report_sci_modhur_chara_4_rd_2",
				  "form_title": "GFD Daily Report: SCI, Modhur Chara 4, Round 2",
				  "url":"https://ee.humanitarianresponse.info/x/#YsHzNFbI"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "World Vision International",
				  "organization_tag" : "wvi",
				  "organization" : "WVI",
				  "organization_id" : "5c029c383e7ee3a1245bce55",	
					"report_round": '1',
				  "site_id" : "balukhali_1",
				  "site_name" : "Balukhali 1",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aVv7aFzF3FwR469xjZL2Xz',
				  "form_template": "wfp_cxb_gfd_report_wvi_balukhali_1_rd_1",
				  "form_title": "GFD Daily Report: WVI, Balukhali 1, Round 1",
				  "url":"https://ee.humanitarianresponse.info/x/#nKQP6bc6"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "World Vision International",
				  "organization_tag" : "wvi",
				  "organization" : "WVI",
				  "organization_id" : "5c029c383e7ee3a1245bce55",	
					"report_round": '2',
				  "site_id" : "balukhali_1",
				  "site_name" : "Balukhali 1",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'apq9jVuaJtYdXw9APccfTq',
				  "form_template": "wfp_cxb_gfd_report_wvi_balukhali_1_rd_2",
				  "form_title": "GFD Daily Report: WVI, Balukhali 1, Round 2",
				  "url":"https://ee.humanitarianresponse.info/x/#sh02G2Vu"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "World Vision International",
				  "organization_tag" : "wvi",
				  "organization" : "WVI",
				  "organization_id" : "5c029c383e7ee3a1245bce55",	
					"report_round": '1',
				  "site_id" : "balukhali_2",
				  "site_name" : "Balukhali 2",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aadePx8BUP2zsu2PXDNvjM',
				  "form_template": "wfp_cxb_gfd_report_wvi_balukhali_2_rd_1",
				  "form_title": "GFD Daily Report: WVI, Balukhali 2, Round 1",
				  "url":"https://ee.humanitarianresponse.info/x/#K8Czeog4"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "World Vision International",
				  "organization_tag" : "wvi",
				  "organization" : "WVI",
				  "organization_id" : "5c029c383e7ee3a1245bce55",	
					"report_round": '2',
				  "site_id" : "balukhali_2",
				  "site_name" : "Balukhali 2",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'apQgwroBCcS7gMei4urxn6',
				  "form_template": "wfp_cxb_gfd_report_wvi_balukhali_2_rd_2",
				  "form_title": "GFD Daily Report: WVI, Balukhali 2, Round 2",
				  "url":"https://ee.humanitarianresponse.info/x/#66PI7xwR"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "World Vision International",
				  "organization_tag" : "wvi",
				  "organization" : "WVI",
				  "organization_id" : "5c029c383e7ee3a1245bce55",	
					"report_round": '1',
				  "site_id" : "mainnergona_1",
				  "site_name" : "Mainnergona 1",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aWkuQNi5KAuLFj7ePJMTCZ',
				  "form_template": "wfp_cxb_gfd_report_wvi_mainnergona_1_rd_1",
				  "form_title": "GFD Daily Report: WVI, Mainnergona 1, Round 1",
				  "url":"https://ee.humanitarianresponse.info/x/#BzYWVGxg"
				},{
				  "admin0pcode" : "CB",
				  "admin0name" : "Cox Bazar",
				  "organization_name" : "World Vision International",
				  "organization_tag" : "wvi",
				  "organization" : "WVI",
				  "organization_id" : "5c029c383e7ee3a1245bce55",	
					"report_round": '2',
				  "site_id" : "mainnergona_1",
				  "site_name" : "Mainnergona 1",
				  "site_type_id" : "food_distribution_point",
				  "site_type_name" : "Food Distribution Point",
				  "assetUid": 'aWBWL85oYmMHXLd3nPdTnB',
				  "form_template": "wfp_cxb_gfd_report_wvi_mainnergona_1_rd_2",
				  "form_title": "GFD Daily Report: WVI, Mainnergona 1, Round 2",
				  "url":"https://ee.humanitarianresponse.info/x/#gbdri0SZ"
				}]
			},

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
				if ( $scope.report.organization_tag === 'wfp' ) {
					$scope.model.header.title.title = 'ALL | ' + $scope.report.title;
				} else {
					$scope.model.header.title.title = $scope.report.organization_tag.toUpperCase() + ' | ' + $scope.report.title;
				}

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
							'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/plan/wfp/all/all/all/all'
						},{
							'title': 'AAH',
							'param': 'organization_tag',
							'active': 'aah',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/plan/aah/all/all/all/all'
						},{
							'title': 'BRAC',
							'param': 'organization_tag',
							'active': 'brac',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/plan/brac/all/all/all/all'
						},{
							'title': 'RIC',
							'param': 'organization_tag',
							'active': 'ric',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/plan/ric/all/all/all/all'
						},{
							'title': 'SCI',
							'param': 'organization_tag',
							'active': 'sci',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/plan/sci/all/all/all/all'
						},{
							'title': 'WVI',
							'param': 'organization_tag',
							'active': 'wvi',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/plan/wvi/all/all/all/all'
						}]
					}]
				
				}

				// filter by round if WFP
				if ( $scope.report.organization_tag === 'wfp' ) {
					var filter = { report_round: $scope.report.report_round }
				} 
				// filter by round and org if !WFP
				if ( $scope.report.organization_tag !== 'wfp' ) {
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
						'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/plan/' + $scope.report.organization_tag + '/all/all/all/all'
					}]
				});

				// get data
				ngmData.get({
					method: 'POST',
					url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getPlannedBeneficiariesIndicator',
					data: {
						indicator: 'menu',
						admin0pcode: $scope.report.user.admin0pcode,
						organization_tag: $scope.report.organization_tag,
						report_round: $scope.report.report_round,
						report_distribution: $scope.report.report_distribution,
						site_id: $scope.report.site_id,
						admin3pcode: $scope.report.admin3pcode,
						admin4pcode: $scope.report.admin4pcode,
						admin5pcode: $scope.report.admin5pcode
					}
				}).then( function( menu ){

					// sort camps
					sitemenu = $filter( 'orderBy' )( menu, 'site_name' );

					// add rows to GFD menu
					angular.forEach( sitemenu, function( d ){
						$scope.model.menu[ $scope.model.menu.length-1 ].rows.push({
							'title': d.site_name,
							'param': 'site_id',
							'active': d.site_id,
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/plan/' + d.organization_tag + '/' + d.site_id + '/all/all/all'
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
							'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/plan/' + $scope.report.organization_tag + '/all/all/all/all'
						}]
					});
	
					// sort camps
					admin3menu = $filter( 'orderBy' )( menu, 'admin3name' );

					// add rows to GFD menu
					angular.forEach( admin3menu, function( d ){
						$scope.model.menu[ $scope.model.menu.length-1 ].rows.push({
							'title': d.admin3name,
							'param': 'admin3pcode',
							'active': d.admin3pcode,
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/plan/' + $scope.report.organization_tag + '/' + $scope.report.site_id + '/' + d.admin3pcode + '/all/all'
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
								'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/plan/' + $scope.report.organization_tag + '/' + $scope.report.site_id + '/' + $scope.report.admin3pcode + '/all/all'
							}]
						});

						// sort blocks
						admin4menu = $filter( 'filter' )( admin3menu, { 'admin3pcode': $scope.report.admin3pcode } );
						admin4menu = $filter( 'orderBy' )( admin4menu, 'admin4name' );

						// add rows to GFD menu
						angular.forEach( admin4menu, function( d ){
							$scope.model.menu[ $scope.model.menu.length-1 ].rows.push({
								'title': d.admin4name,
								'param': 'admin4pcode',
								'active': d.admin4pcode,
								'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
								'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/plan/' + $scope.report.organization_tag + '/' + $scope.report.site_id + '/' + $scope.report.admin3pcode + '/' + d.admin4pcode + '/all'
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
									'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/plan/' + $scope.report.organization_tag + '/' + $scope.report.site_id + '/' + $scope.report.admin3pcode + '/' + $scope.report.admin4pcode + '/all'
								}]
							});

							// sort blocks
							admin5menu = $filter( 'filter' )( admin4menu, { 'admin4pcode': $scope.report.admin4pcode } );
							admin5menu = $filter( 'orderBy' )( admin5menu, 'admin5name' );

							// subtitle
							$scope.model.header.subtitle.title += ', ' + admin5menu[ 0 ].admin4name;

							// add rows to GFD menu
							angular.forEach( admin5menu, function( d ){
								$scope.model.menu[ $scope.model.menu.length-1 ].rows.push({
									'title': d.admin5name,
									'param': 'admin5pcode',
									'active': d.admin5pcode,
									'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
									'href': '/desk/#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/plan/' + $scope.report.organization_tag + '/' + $scope.report.site_id + '/' + $scope.report.admin3pcode + '/' + $scope.report.admin4pcode + '/' + d.admin5pcode
								});
							});

							// subtitle
							if ( $scope.report.admin5pcode !== 'all' ) {
								var subtitle = $filter( 'filter' )( admin5menu, { 'admin5pcode': $scope.report.admin5pcode } );
								$scope.model.header.subtitle.title += ', ' + subtitle[ 0 ].admin5name;
							}

						}

					}

				});
			
			},

			// set downloads
			setDownloads: function() {

				// downlaods
				var downloads = [{
					type: 'csv',
					color: 'teal lighten-3',
					icon: 'group',
					hover: 'Download Duplicates',
					request: {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getPlannedBeneficiariesIndicator',
						data: {
							download: true,
							indicator: 'downloads_duplicates',
							admin0pcode: $scope.report.user.admin0pcode,
							organization_tag: $scope.report.organization_tag,
							report_round: $scope.report.report_round,
							report_distribution: $scope.report.report_distribution,
							site_id: $scope.report.site_id,
							admin3pcode: $scope.report.admin3pcode,
							admin4pcode: $scope.report.admin4pcode,
							admin5pcode: $scope.report.admin5pcode,
							report: $scope.report.organization_tag +'_planned_duplicates_round' + $scope.report.report_round + '_distribution_' + $scope.report.report_distribution + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ),
						}
					},
					metrics: {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/metrics/set',
						data: {
							organization: $scope.report.user.organization,
							username: $scope.report.user.username,
							email: $scope.report.user.email,
							dashboard: 'gfa_gfd_plan_duplicates_' + $scope.report.report_round + '_' + $scope.report.report_distribution,
							theme: 'gfa_gfd_plan_duplicates',
							format: 'csv',
							url: $location.$$path
						}
					}
				},{
					type: 'csv',
					color: 'teal lighten-3',
					icon: 'people_outline',
					hover: 'Download Vulnerable Populations',
					request: {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getPlannedBeneficiariesIndicator',
						data: {
							download: true,
							indicator: 'downloads_vulnerable',
							admin0pcode: $scope.report.user.admin0pcode,
							organization_tag: $scope.report.organization_tag,
							report_round: $scope.report.report_round,
							report_distribution: $scope.report.report_distribution,
							site_id: $scope.report.site_id,
							admin3pcode: $scope.report.admin3pcode,
							admin4pcode: $scope.report.admin4pcode,
							admin5pcode: $scope.report.admin5pcode,
							report: $scope.report.organization_tag +'_planned_vulnerable_popn_round' + $scope.report.report_round + '_distribution_' + $scope.report.report_distribution + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ),
						}
					},
					metrics: {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/metrics/set',
						data: {
							organization: $scope.report.user.organization,
							username: $scope.report.user.username,
							email: $scope.report.user.email,
							dashboard: 'gfa_gfd_plan_vulnerable_popns_' + $scope.report.report_round + '_' + $scope.report.report_distribution,
							theme: 'gfa_gfd_plan_vulnerable_popns',
							format: 'csv',
							url: $location.$$path
						}
					}
				},{
					type: 'csv',
					color: 'teal lighten-3',
					icon: 'store',
					hover: 'Download Planned Food Distribution',
					request: {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getPlannedBeneficiariesIndicator',
						data: {
							download: true,
							indicator: 'downloads_food_distribution',
							admin0pcode: $scope.report.user.admin0pcode,
							organization_tag: $scope.report.organization_tag,
							report_round: $scope.report.report_round,
							report_distribution: $scope.report.report_distribution,
							site_id: $scope.report.site_id,
							admin3pcode: $scope.report.admin3pcode,
							admin4pcode: $scope.report.admin4pcode,
							admin5pcode: $scope.report.admin5pcode,
							report: $scope.report.organization_tag +'_planned_food_distribution_' + $scope.report.report_round + '_distribution_' + $scope.report.report_distribution + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ),
						}
					},
					metrics: {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/metrics/set',
						data: {
							organization: $scope.report.user.organization,
							username: $scope.report.user.username,
							email: $scope.report.user.email,
							dashboard: 'gfa_gfd_plan_food_distribution_' + $scope.report.report_round + '_' + $scope.report.report_distribution,
							theme: 'gfa_gfd_plan_food_distribution',
							format: 'csv',
							url: $location.$$path
						}
					}
				},{
					type: 'csv',
					color: 'teal lighten-3',
					icon: 'person',
					hover: 'Download Planned Beneficiaries',
					request: {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getPlannedBeneficiariesIndicator',
						data: {
							download: true,
							indicator: 'downloads_planned_beneficiaries',
							admin0pcode: $scope.report.user.admin0pcode,
							organization_tag: $scope.report.organization_tag,
							report_round: $scope.report.report_round,
							report_distribution: $scope.report.report_distribution,
							site_id: $scope.report.site_id,
							admin3pcode: $scope.report.admin3pcode,
							admin4pcode: $scope.report.admin4pcode,
							admin5pcode: $scope.report.admin5pcode,
							report: $scope.report.organization_tag +'_planned_beneficiaries_round_' + $scope.report.report_round + '_distribution_' + $scope.report.report_distribution + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ),
						}
					},
					metrics: {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/metrics/set',
						data: {
							organization: $scope.report.user.organization,
							username: $scope.report.user.username,
							email: $scope.report.user.email,
							dashboard: 'gfa_gfd_plan_beneficiaries_' + $scope.report.report_round + '_' + $scope.report.report_distribution,
							theme: 'gfa_gfd_plan_beneficiaries',
							format: 'csv',
							url: $location.$$path
						}
					}
				}];

				// set downloads
				$scope.model.header.download.downloads = downloads;

			},

			// config of page
			setDashboardConfig: function () {

				// get data
				ngmData.get({
					method: 'POST',
					url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getPlannedBeneficiaries',
					data: {
						limit: 1,
						admin0pcode: $scope.report.user.admin0pcode,
						organization_tag: $scope.report.organization_tag,
						report_round: $scope.report.report_round,
						report_distribution: $scope.report.report_distribution,
					}
				
				}).then( function( data ){

					// NO PLANNED BENEFICIARIES

					// if !wfp and !data, show upload only
					if ( $scope.report.organization_tag === 'wfp' && !data.length ) {
						
						// upload
						$scope.model.rows.push({
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										header: 'collection-header blue',
										icon: 'announcement',
										message: 'No Planned Beneficiaries!',
										report_round: $scope.report.report_round,
										report_distribution: $scope.report.report_distribution,
										templateUrl: '/scripts/widgets/ngm-html/template/bgd/gfd/planned.beneficiaries.html',
									}
								}]
							}]
						
						});
					
					} else if ( $scope.report.organization_tag !== 'wfp' && !data.length ) {
						
						// upload
						$scope.model.rows.push({
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'dropzone',
									style: 'padding: 0px;',
									card: 'white grey-text text-darken-2',
									config: {
										parallelUploads: false,
										cardTitle: $scope.report.organization_tag.toUpperCase() + ' Planned Beneficiaries',
										header: 'collection-header blue',
										dictMsg: '<div style="font-weight:400;font-size:1.2rem;">Round ' + $scope.report.report_round + ', Distribution ' + $scope.report.report_distribution + '<br/>Drag & Drop Planned Beneficiaries</div>',
										minimize: {
											open: true,
											toggle: true,
											disabled: true
										},
										url: ngmAuth.LOCATION + '/api/upload-file',
										acceptedFiles: '.xlsx',
										headers: { 'Authorization': 'Bearer ' + ngmUser.get().token },
										successMessage: false,
										process: {
											redirect: 'bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/plan/' + $scope.report.organization_tag + '/all/all/all/all',
											requests: [{
												method: 'POST',
												url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/processPlannedBeneficiaries',
												data: {
													admin0pcode: $scope.report.user.admin0pcode,
													organization_tag: $scope.report.organization_tag,
													report_round: $scope.report.report_round,
													report_distribution: $scope.report.report_distribution,
												}
											},{
												method: 'POST',
												url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/setKoboXlsxForm',
												data: {
													admin0pcode: $scope.report.user.admin0pcode,
													organization_tag: $scope.report.organization_tag,
													report_round: $scope.report.report_round,
													report_distribution: $scope.report.report_distribution,
												}
											},{
												method: 'POST',
												url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/deployKoboXlsxForm',
												data: {
													admin0pcode: $scope.report.user.admin0pcode,
													organization_tag: $scope.report.organization_tag,
													report_round: $scope.report.report_round,
													report_distribution: $scope.report.report_distribution,
												}
											}]
										}
									}
								}]
							}]
						
						});
					
					}

					// !wfp and data.length
					if ( $scope.report.organization_tag !== 'wfp' && data.length ) {
						
						// upload
						$scope.model.rows.push({
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'dropzone',
									style: 'padding: 0px;',
									card: 'white grey-text text-darken-2',
									config: {
										cardTitle: $scope.report.organization_tag === 'wfp' ? 'Planned Beneficiaries' : $scope.report.organization_tag.toUpperCase() + ' Planned Beneficiaries',
										header: 'collection-header blue',
										dictMsg: '<div style="font-weight:400;font-size:1.2rem;">Round ' + $scope.report.report_round + ', Distribution ' + $scope.report.report_distribution + '<br/>Drag & Drop Planned Beneficiaries</div>',
										minimize: {
											open: false,
											toggle: true,
											disabled: false
										},
										url: ngmAuth.LOCATION + '/api/upload-file',
										acceptedFiles: '.xlsx',
										headers: { 'Authorization': 'Bearer ' + ngmUser.get().token },
										successMessage: false,
										process: {
											redirect: 'bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '/plan/' + $scope.report.organization_tag + '/all/all/all/all',
											requests: [{
												method: 'POST',
												url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/processPlannedBeneficiaries',
												data: {
													admin0pcode: $scope.report.user.admin0pcode,
													organization_tag: $scope.report.organization_tag,
													report_round: $scope.report.report_round,
													report_distribution: $scope.report.report_distribution
												}
											},{
												method: 'POST',
												url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/setKoboXlsxForm',
												data: {
													admin0pcode: $scope.report.user.admin0pcode,
													organization_tag: $scope.report.organization_tag,
													report_round: $scope.report.report_round,
													report_distribution: $scope.report.report_distribution
												}
											},{
												method: 'POST',
												url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/deployKoboXlsxForm',
												data: {
													admin0pcode: $scope.report.user.admin0pcode,
													organization_tag: $scope.report.organization_tag,
													report_round: $scope.report.report_round,
													report_distribution: $scope.report.report_distribution
												}
											}]
										}
									}
								}]
							}]
						
						});
					
					}					

					// PLANNED BENEFICIARIES

					// data for round
					if ( data.length ) {

						// report round / distribution
						var form_filter = { report_round: $scope.report.report_round }

						// site id
						if ( $scope.report.organization_tag !== 'wfp' ) {
							form_filter.organization_tag = $scope.report.organization_tag;
						}

						// site id
						if ( $scope.report.site_id !== 'all' ) {
							form_filter.site_id = $scope.report.site_id;
						}

						// form links
						$scope.model.rows.push({
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										forms: $filter( 'filter' )( $scope.report.forms.list, form_filter ),
										header: 'collection-header blue',
										icon: 'inbox',
										message: $scope.report.organization_tag !== 'wfp' ? $scope.report.organization_tag.toUpperCase() + ' Daily Reporting Forms' : 'Daily Reporting Forms',
										minimize: {
											open: false,
											toggle: true,
											disabled: false,
											openCloseCard: function( panel ){
												panel.minimize.open = !panel.minimize.open;
											}
										},
										templateUrl: '/scripts/widgets/ngm-html/template/bgd/gfd/daily.report.forms.html',
									}
								}]
							}]
						
						});

						// default indicators 
						$scope.model.rows.push({
							columns: [{
								styleClass: 's12 m12 l2',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: "Family Size 1-3",
										request: {
											method: 'POST',
											url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getPlannedBeneficiariesIndicator',
											data: {
												indicator: 'family_size_1_3',
												admin0pcode: $scope.report.user.admin0pcode,
												organization_tag: $scope.report.organization_tag,
												report_round: $scope.report.report_round,
												report_distribution: $scope.report.report_distribution,
												site_id: $scope.report.site_id,
												admin3pcode: $scope.report.admin3pcode,
												admin4pcode: $scope.report.admin4pcode,
												admin5pcode: $scope.report.admin5pcode
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
										title: "Family Size 4-7",
										request: {
											method: 'POST',
											url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getPlannedBeneficiariesIndicator',
											data: {
												indicator: 'family_size_4_7',
												admin0pcode: $scope.report.user.admin0pcode,
												organization_tag: $scope.report.organization_tag,
												report_round: $scope.report.report_round,
												report_distribution: $scope.report.report_distribution,
												site_id: $scope.report.site_id,
												admin3pcode: $scope.report.admin3pcode,
												admin4pcode: $scope.report.admin4pcode,
												admin5pcode: $scope.report.admin5pcode
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
										title: "Family Size 8-10",
										request: {
											method: 'POST',
											url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getPlannedBeneficiariesIndicator',
											data: {
												indicator: 'family_size_8_10',
												admin0pcode: $scope.report.user.admin0pcode,
												organization_tag: $scope.report.organization_tag,
												report_round: $scope.report.report_round,
												report_distribution: $scope.report.report_distribution,
												site_id: $scope.report.site_id,
												admin3pcode: $scope.report.admin3pcode,
												admin4pcode: $scope.report.admin4pcode,
												admin5pcode: $scope.report.admin5pcode
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
										title: "Family Size 11+",
										request: {
											method: 'POST',
											url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getPlannedBeneficiariesIndicator',
											data: {
												indicator: 'family_size_11+',
												admin0pcode: $scope.report.user.admin0pcode,
												organization_tag: $scope.report.organization_tag,
												report_round: $scope.report.report_round,
												report_distribution: $scope.report.report_distribution,
												site_id: $scope.report.site_id,
												admin3pcode: $scope.report.admin3pcode,
												admin4pcode: $scope.report.admin4pcode,
												admin5pcode: $scope.report.admin5pcode
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
											url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getPlannedBeneficiariesIndicator',
											data: {
												indicator: 'total',
												admin0pcode: $scope.report.user.admin0pcode,
												organization_tag: $scope.report.organization_tag,
												report_round: $scope.report.report_round,
												report_distribution: $scope.report.report_distribution,
												site_id: $scope.report.site_id,
												admin3pcode: $scope.report.admin3pcode,
												admin4pcode: $scope.report.admin4pcode,
												admin5pcode: $scope.report.admin5pcode
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
											url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getPlannedBeneficiariesIndicator',
											data: {
												indicator: 'rice',
												admin0pcode: $scope.report.user.admin0pcode,
												organization_tag: $scope.report.organization_tag,
												report_round: $scope.report.report_round,
												report_distribution: $scope.report.report_distribution,
												site_id: $scope.report.site_id,
												admin3pcode: $scope.report.admin3pcode,
												admin4pcode: $scope.report.admin4pcode,
												admin5pcode: $scope.report.admin5pcode
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
											url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getPlannedBeneficiariesIndicator',
											data: {
												indicator: 'lentils',
												admin0pcode: $scope.report.user.admin0pcode,
												organization_tag: $scope.report.organization_tag,
												report_round: $scope.report.report_round,
												report_distribution: $scope.report.report_distribution,
												site_id: $scope.report.site_id,
												admin3pcode: $scope.report.admin3pcode,
												admin4pcode: $scope.report.admin4pcode,
												admin5pcode: $scope.report.admin5pcode
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
											url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getPlannedBeneficiariesIndicator',
											data: {
												indicator: 'oil',
												admin0pcode: $scope.report.user.admin0pcode,
												organization_tag: $scope.report.organization_tag,
												report_round: $scope.report.report_round,
												report_distribution: $scope.report.report_distribution,
												site_id: $scope.report.site_id,
												admin3pcode: $scope.report.admin3pcode,
												admin4pcode: $scope.report.admin4pcode,
												admin5pcode: $scope.report.admin5pcode
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
											fractionSize: 3
										},
										request: {
											method: 'POST',
											url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getPlannedBeneficiariesIndicator',
											data: {
												indicator: 'entitlements',
												admin0pcode: $scope.report.user.admin0pcode,
												organization_tag: $scope.report.organization_tag,
												report_round: $scope.report.report_round,
												report_distribution: $scope.report.report_distribution,
												site_id: $scope.report.site_id,
												admin3pcode: $scope.report.admin3pcode,
												admin4pcode: $scope.report.admin4pcode,
												admin5pcode: $scope.report.admin5pcode
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
										headerClass: 'collection-header red lighten-2',
										headerText: 'white-text',
										headerIcon: 'group',
										headerTitle: "Duplicate Beneficiaries (FCN's)",
										site_name: 'site_name',
										gfd_family_size: 'gfd_family_size',
										templateUrl: '/scripts/widgets/ngm-table/templates/bgd/gfd/beneficiaries.table.html',
										tableOptions:{
											count: 10
										},
										request: {
											method: 'POST',
											url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getPlannedBeneficiariesIndicator',
											data: {
												indicator: 'duplicate_beneficiaries_list',
												admin0pcode: $scope.report.user.admin0pcode,
												organization_tag: $scope.report.organization_tag,
												report_round: $scope.report.report_round,
												report_distribution: $scope.report.report_distribution,
												site_id: $scope.report.site_id,
												admin3pcode: $scope.report.admin3pcode,
												admin4pcode: $scope.report.admin4pcode,
												admin5pcode: $scope.report.admin5pcode
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
										headerTitle: "Beneficiaries List",
										site_name: 'site_name',
										gfd_family_size: 'gfd_family_size',
										templateUrl: '/scripts/widgets/ngm-table/templates/bgd/gfd/beneficiaries.table.html',
										tableOptions:{
											count: 30
										},
										request: {
											method: 'POST',
											url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getPlannedBeneficiariesIndicator',
											data: {
												indicator: 'beneficiaries_list',
												admin0pcode: $scope.report.user.admin0pcode,
												organization_tag: $scope.report.organization_tag,
												report_round: $scope.report.report_round,
												report_distribution: $scope.report.report_distribution,
												site_id: $scope.report.site_id,
												admin3pcode: $scope.report.admin3pcode,
												admin4pcode: $scope.report.admin4pcode,
												admin5pcode: $scope.report.admin5pcode
											}
										}
									}
								}]
							}]
						
						});
						
					}		

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

				});

			},

			// init
			init: function() {

				// report dashboard model
				$scope.model = {
					name: 'report_distribution_plan',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m12 l8 report-title truncate',
							style: 'font-size: 3.4rem; color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: $scope.report.title
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle hide-on-small-only',
							title: $scope.report.subtitle
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
									html: '<a class="btn-flat waves-effect waves-teal left hide-on-small-only" href="#/bgd/cxb/gfa/gfd/round/' + $scope.report.report_round + '/distribution/' + $scope.report.report_distribution + '/' + $scope.report.reporting_period + '"><i class="material-icons left">keyboard_return</i>Back to Distribution Round ' + $scope.report.report_distribution + '</a>'
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

			}

		}		
		
		// init
		$scope.report.init();
		
	}]);
