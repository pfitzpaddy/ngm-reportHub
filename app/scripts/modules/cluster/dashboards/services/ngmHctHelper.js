/**
 * @name ngmReportHub.factory:ngmClusterHelper
 * @description
 * # ngmClusterHelper
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmHctHelper', [ '$location', '$q', '$http', '$filter', '$timeout', function( $location, $q, $http, $filter, $timeout ) {

		return {
      getData: function(){
        var data = {
          all: {
            id: 'all',
            title: 'ALL',
            districts: 155,
            white_area_districts: 93,
            idp_districts: 92,
            wa_idp_districts: 30,

            bphs_districts: 104,
            bphs_services: 13326,

            hc_districts: 66,
            hc_services: 97006,

            categories: [ 'Badakhshan', 'Badghis', 'Baghlan', 'Balkh', 'Bamyan', 'Farah', 'Faryab', 'Ghazni', 'Ghor', 'Helmand', 'Herat', 'Jawzjan', 'Kabul', 'Kandahar', 'Kapisa', 'Khost', 'Kunar', 'Kunduz', 'Laghman', 'Logar', 'Nangarhar', 'Nuristan', 'Paktika', 'Paktya', 'Panjsher', 'Parwan', 'Samangan', 'Sar-e-Pul', 'Takhar', 'Uruzgan', 'Wardak', 'Zabul' ],
            bphs_data: [ 126, 182, 444, 303, 31, 219, 826, 283, 179, 4065, 513, 302, 485, 69, 20, 55, 334, 1161, 362, 105, 1353, 20, 77, 519, 158, 23, 6, 83, 307, 507, 149, 60 ],
            hc_data: [ 144, 0, 2326, 1450, 0, 196, 0, 9878, 926, 5597, 0, 0, 10075, 10701, 2666, 0, 1119, 1620, 15255, 3438, 8269, 2496, 6228, 2759, 0, 277, 0, 0, 0, 10973, 613, 0 ]
          },
          badakhshan:{
            id: 'badakhshan',
            title: 'BADAKHSHAN',
            districts: 28,
            white_area_districts: 2,
            idp_districts: 5,
            wa_idp_districts: 0,

            bphs_districts: 5,
            bphs_services: 126,

            hc_districts: 1,
            hc_services: 144,

            categories: [ 'Baharak', 'Eshkashem', 'Fayzabad', 'Shighnan', 'Tagab', 'Wordooj' ],
            bphs_data: [ 13, 7, 100, 5, 0, 1 ],
            hc_data: [0, 0, 0, 0, 144, 0]
          },
          badghis:{
            id: 'badghis',
            title: 'BADGHIS',
            districts: 7,
            white_area_districts: 3,
            idp_districts: 3,
            wa_idp_districts: 1,

            bphs_districts: 2,
            bphs_services: 182,

            hc_districts: 0,
            hc_services: 0,

            categories: [ 'Morghaab', 'Qala-e-Naw'],
            bphs_data: [ 47, 135 ],
            hc_data: [ 0, 0 ]
          },
          baghlan:{
            id: 'baghlan',
            title: 'BAGHLAN',
            districts: 15,
            white_area_districts: 2,
            idp_districts: 2,
            wa_idp_districts: 2,

            bphs_districts: 2,
            bphs_services: 444,
            
            hc_districts: 2,
            hc_services: 2326,

            categories: [ 'Baghlan-e-Jadid', 'Pul-e-Khomri' ],
            bphs_data: [ 78, 366 ],
            hc_data: [ 1548, 778 ]
          },
          balkh:{
            id: 'balkh',
            title: 'BALKH',
            districts: 16,
            white_area_districts: 1,
            idp_districts: 2,
            wa_idp_districts: 0,

            bphs_districts: 2,
            bphs_services: 303,
            
            hc_districts: 1,
            hc_services: 1450,

            categories: [ 'Balkh Mazar-e-Shareef', 'Balkh Sholgarah' ],
            bphs_data: [ 296, 7 ],
            hc_data: [ 0, 1450 ]
          },
          bamyan:{
            id: 'bamyan',
            title: 'BAMYAN',
            districts: 16,
            white_area_districts: 0,
            idp_districts: 1,
            wa_idp_districts: 0,

            bphs_districts: 1,
            bphs_services: 31,

            hc_districts: 0,
            hc_services: 0,

            categories: [ 'Bamyan' ],
            bphs_data: [ 31 ],
            hc_data: [ 0 ]
          },
          daykundi: {
            id: 'daykundi',
            title: 'Daykundi',
            districts: 9,
            white_area_districts: 1,
            idp_districts: 0,
            wa_idp_districts: 0,

            bphs_districts: 0,
            bphs_services: 0,

            hc_districts: 0,
            hc_services: 0,

            categories: [],
            bphs_data: [],
            hc_data: []              
          },
          farah: {
              id: 'farah',
              title: 'Farah',
              districts: 11,
            white_area_districts: 1,
            idp_districts: 1,
            wa_idp_districts: 1,

            bphs_districts: 1,
            bphs_services: 219,

            hc_districts: 1,
            hc_services: 196,

            categories: [ 'Farah' ],
            bphs_data: [ 219 ],
            hc_data: [ 196 ]
          },
          faryab: {
              id: 'faryab',
              title: 'Faryab',
              districts: 14,
            white_area_districts: 3,
            idp_districts: 6,
            wa_idp_districts: 1,

            bphs_districts: 4,
            bphs_services: 826,

            hc_districts: 0,
            hc_services: 0,

            categories:  [ 'Almaar', 'Garzewaan', 'Maimana', 'Qaysaar' ],
            bphs_data: [ 0, 130, 586, 110 ],
            hc_data: [ 0, 0, 0, 0 ]
          },
          ghazni: {
              id: 'ghazni',
              title: 'Ghazni',
              districts: 19,
            white_area_districts: 5,
            idp_districts: 2,
            wa_idp_districts: 1,

            bphs_districts: 3,
            bphs_services: 283,

            hc_districts: 4,
            hc_services: 9878,

            categories: [ 'Dehyak', 'Ghazni', 'Jaghoori', 'Muqur', 'Qarabagh' ],
            bphs_data: [ 0, 261, 6, 0, 16 ],
            hc_data: [ 2856, 1177, 0, 2891, 2954 ]
          },
          ghor: {
              id: 'ghor',
              title: 'Ghor',
              districts: 10,
            white_area_districts: 4,
            idp_districts: 4,
            wa_idp_districts: 2,

            bphs_districts: 3,
            bphs_services: 179,
            
            hc_districts: 4,
            hc_services: 926,

            categories: [ 'Cheghcheraan', 'DoLayna', 'Pasaband', 'Shahrak', 'Taywarah' ],
            bphs_data: [ 162, 0, 0, 3, 14 ],
            hc_data: [ 0, 329, 35, 363, 199 ]
          },
          helmand: {
              id: 'helmand',
              title: 'Helmand',
              districts: 13,
            white_area_districts: 8,
            idp_districts: 2,
            wa_idp_districts: 1,

            bphs_districts: 8,
            bphs_services: 4065,

            hc_districts: 7,
            hc_services: 5597,

            categories: [ 'Garm Seir', 'Kajaki ', 'LashkarGaah', 'Mosaqala ', 'Nad-e-Ali', 'Nahr-e-Seraj', 'Nawa-e-Barekzaye', 'Nawzaad', 'Sangin' ],
            bphs_data: [ 31, 0, 3860, 0, 149, 20, 0, 5, 0 ],
            hc_data: [ 0, 893, 0, 410, 1214, 905, 0, 930, 1245 ]
          },
          herat: {
              id: 'herat',
              title: 'Herat',
              districts: 16,
            white_area_districts: 4,
            idp_districts: 4,
            wa_idp_districts: 1,

            bphs_districts: 6,
            bphs_services: 513,

            hc_districts: 0,
            hc_services: 0,

            categories: [ 'Enjeel', 'Gulran', 'Guzarah', 'Hirat', 'Keshk', 'Shindand' ],
            bphs_data: [ 0, 0, 0, 508, 5, 0 ],
            hc_data: [ 0, 0, 0, 0, 0, 0 ]
          },
          jawzjan: {
              id: 'jawzjan',
              title: 'Jawzjan',
              districts: 11,
            white_area_districts: 1,
            idp_districts: 1,
            wa_idp_districts: 1,

            bphs_districts: 1,
            bphs_services: 302,

            hc_districts: 0,
            hc_services: 0,

            categories: [ 'Sheberghaan' ],
            bphs_data: [ 302 ],
            hc_data: [ 0 ]
          },
          kabul: {
              id: 'kabul',
              title: 'Kabul',
              districts: 37,
            white_area_districts: 2,
            idp_districts: 4,
            wa_idp_districts: 1,

            bphs_districts: 3,
            bphs_services: 485,

            hc_districts: 1,
            hc_services: 10075,

            categories: [ 'Kabul', 'Qara Bagh', 'Suroobi' ],
            bphs_data: [ 474, 2, 9 ],
            hc_data: [ 10075, 0, 0 ]
          },
          kandahar: {
              id: 'kandahar',
              title: 'Kandahar',
              districts: 16,
            white_area_districts: 7,
            idp_districts: 6,
            wa_idp_districts: 4,

            bphs_districts: 9,
            bphs_services: 69,

            hc_districts: 7,
            hc_services: 10701,

            categories: [ 'Arghandaab', 'Arghestaan', 'Damaan', 'Dand', 'Kandahar', 'Maywand', 'Nish', 'Panjwaye', 'Shahwalikot', 'Spinboldak' ],
            bphs_data: [ 0, 0, 0, 1, 0, 54, 0, 0, 14, 0 ],
            hc_data: [ 1016, 1135, 1185, 0, 3354, 1501, 0, 0, 1494, 1016 ]
          },
          kapisa: {
              id: 'kapisa',
              title: 'Kapisa',
              districts: 7,
            white_area_districts: 3,
            idp_districts: 4,
            wa_idp_districts: 1,

            bphs_districts: 2,
            bphs_services: 20,

            hc_districts: 2,
            hc_services: 2666,

            categories: [ 'Mahmood-Raqi', 'Nejrab', 'Tagab' ],
            bphs_data: [ 20, 0, 0 ],
            hc_data: [ 0, 612, 2054 ]
          },
          khost: {
              id: 'khost',
              title: 'Khost',
              districts: 13,
            white_area_districts: 2,
            idp_districts: 1,
            wa_idp_districts: 1,

            bphs_districts: 1,
            bphs_services: 55,
            
            hc_districts: 0,
            hc_services: 0,

            categories: [ 'Khost' ],
            bphs_data: [ 55 ],
            hc_data: [ 0 ]
          },
          kunar: {
              id: 'kunar',
              title: 'Kunar',
              districts: 15,
            white_area_districts: 6,
            idp_districts: 8,
            wa_idp_districts: 4,

            bphs_districts: 7,
            bphs_services: 334,

            hc_districts: 1,
            hc_services: 1119,

            categories: [ 'Asadabad', 'Chapah Darah', 'Dara-e-Paich', 'Khaas Kunar', 'Naari', 'SarKaani ', 'Shegal ' ],
            bphs_data: [ 322, 1, 9, 0, 2, 0, 0 ],
            hc_data: [ 1119, 0, 0, 0, 0, 0, 0 ]
          },
          kunduz: {
              id: 'kunduz',
              title: 'Kunduz',
              districts: 7,
            white_area_districts: 2,
            idp_districts: 3,
            wa_idp_districts: 1,

            bphs_districts: 3,
            bphs_services: 1161,

            hc_districts: 4,
            hc_services: 1620,

            categories: [ 'Chardarah', 'Khanabad', 'Kunduz', 'Qala-e-Zal' ],
            bphs_data: [ 0, 68, 1059, 34 ],
            hc_data: [ 40, 32, 1504, 44 ]
          },
          laghman: {
              id: 'laghman',
              title: 'Laghman',
              districts: 5,
            white_area_districts: 3,
            idp_districts: 1,
            wa_idp_districts: 0,
            
            bphs_districts: 1,
            bphs_services: 362,

            hc_districts: 4,
            hc_services: 15255,

            categories: [ 'Alingar', 'Alishang', 'Dawlatshah', 'Mehtarlam' ],
            bphs_data: [ 0, 0, 0, 362 ],
            hc_data: [ 2157, 2922, 2202, 7974 ]
          },
          logar: {
              id: 'logar',
              title: 'Logar',
              districts: 7,
            white_area_districts: 5,
            idp_districts: 2,
            wa_idp_districts: 2,

            bphs_districts: 4,
            bphs_services: 105,

            hc_districts: 4,
            hc_services: 3438,

            categories: [ 'Barakibarak', 'Charkh', 'Mohammadagha', 'Pul-e-Alam' ],
            bphs_data: [ 47, 0, 0, 58 ],
            hc_data: [ 1588, 453, 589, 808 ]
          },
          nangarhar: {
            id: 'nangarhar',
            title: 'NANGARHAR',
            districts: 22,
            white_area_districts: 8,
            idp_districts: 8,
            wa_idp_districts: 2,

            bphs_districts: 13,
            bphs_services: 1353,

            hc_districts: 6,
            hc_services: 8269,

            categories: [ 'Bat-e-Kot', 'Behsud', 'Chaparhar', 'Deh Bala', 'Hesarak', 'Jalalabad', 'Lal Poor', 'Mohmand Darah', 'Pacheer Wagaam', 'Rodat', 'Shinwar', 'Shirzad', 'Sorkh Road' ],
            bphs_data: [ 1, 0, 0, 12, 23, 1056, 0, 3, 42, 8, 193, 15, 0 ],
            hc_data: [ 290, 109, 0, 0, 0, 7335, 0, 107, 0, 291, 137, 0, 0 ]
          },
          // nimroz: {
          //     id: 'nimroz',
          //     title: 'Nimroz',
          //     districts: 5,
          //   white_area_districts: 0,
          //   idp_districts: 0,
          //   wa_idp_districts: 0,

          //   bphs_districts: 0,
          //   bphs_services: 0,
          //   hc_districts: 0,
          //   hc_services: 0,
          //   categories: [],
          //   bphs_data: [],
          //   hc_data: []
          // },
          nuristan: {
              id: 'nuristan',
              title: 'Nuristan',
              districts: 8,
            white_area_districts: 2,
            idp_districts: 1,
            wa_idp_districts: 0,

            bphs_districts: 2,
            bphs_services: 20,
            
            hc_districts: 2,
            hc_services: 2496,

            categories: [ 'Kamdesh', 'Waygal' ],
            bphs_data: [ 20, 0 ],
            hc_data: [ 1095, 1401 ]
          },
          paktika: {
              id: 'paktika',
              title: 'Paktika',
              districts: 19,
            white_area_districts: 1,
            idp_districts: 1,
            wa_idp_districts: 0,

            bphs_districts: 1,
            bphs_services: 77,

            hc_districts: 1,
            hc_services: 6228,

            categories: [ 'Sharan' ],
            bphs_data: [ 77 ],
            hc_data: [ 6228 ]
          },
          paktya: {
              id: 'paktya',
              title: 'Paktya',
              districts: 11,
            white_area_districts: 7,
            idp_districts: 1,
            wa_idp_districts: 1,

            bphs_districts: 3,
            bphs_services: 519,

            hc_districts: 5,
            hc_services: 2759,

            categories: [ 'Alikhel', 'Chamkani', 'Dand wa Patan', 'Gardez', 'Janikhel', 'Samkanay' ],
            bphs_data: [ 6, 0, 0, 438, 0, 75 ],
            hc_data: [ 1132, 376, 657, 531, 63, 0 ]
          },
          panjsher: {
              id: 'panjsher',
              title: 'Panjsher',
              districts: 7,
            white_area_districts: 0,
            idp_districts: 4,
            wa_idp_districts: 0,

            bphs_districts: 2,
            bphs_services: 158,

            hc_districts: 0,
            hc_services: 0,

            categories: [ 'Onaba', 'Rokha' ],
            bphs_data: [ 158, 0 ],
            hc_data: [ 0, 0 ]
          },
          parwan: {
              id: 'parwan',
              title: 'Parwan',
              districts: 10,
            white_area_districts: 1,
            idp_districts: 1,
            wa_idp_districts: 0,

            bphs_districts: 2,
            bphs_services: 23,
            
            hc_districts: 1,
            hc_services: 277,

            categories: [ 'Chaharekar', 'Ghorband' ],
            bphs_data: [ 23, 0 ],
            hc_data: [ 0, 277 ]
          },
          samangan: {
              id: 'samangan',
              title: 'Samangan',
              districts: 7,
            white_area_districts: 0,
            idp_districts: 2,
            wa_idp_districts: 0,

            bphs_districts: 2,
            bphs_services: 6,

            hc_districts: 0,
            hc_services: 0,

            categories: [ 'Aybak', 'Dara-e-Soof Bala' ],
            bphs_data: [ 5, 1 ],
            hc_data: [ 0, 0 ]
          },
          'sar-e-pul': {
              id: 'sar-e-pul',
              title: 'Sar-e-Pul',
              districts: 7,
            white_area_districts: 0,
            idp_districts: 1,
            wa_idp_districts: 0,

            bphs_districts: 1,
            bphs_services: 83,

            hc_districts: 0,
            hc_services: 0,

            categories: [ 'Sar-e-Pul' ],
            bphs_data: [ 83 ],
            hc_data: [ 0 ]
          },
          takhar: {
              id: 'takhar',
              title: 'Takhar',
              districts: 17,
            white_area_districts: 0,
            idp_districts: 4,
            wa_idp_districts: 0,

            bphs_districts: 2,
            bphs_services: 307,

            hc_districts: 0,
            hc_services: 0,

            categories: [ 'Rustaaq', 'Taloqan' ],
            bphs_data: [ 7, 300 ],
            hc_data: [ 0, 0 ]
          },
          uruzgan:{
              id: 'uruzgan',
              title: 'Uruzgan',
              districts: 5,
            white_area_districts: 5,
            idp_districts: 1,
            wa_idp_districts: 1,

            bphs_districts: 4,
            bphs_services: 507,

            hc_districts: 5,
            hc_services: 10973,

            categories: [ 'Chorah', 'Dehrawud', 'Khasuruzgan', 'Shaheed Hasaas', 'Tirinkot' ],
            bphs_data: [ 40, 67, 0, 0, 400 ],
            hc_data: [ 1623, 2838, 989, 2147, 3376 ]
          },
          wardak: {
              id: 'wardak',
              title: 'Wardak',
              districts: 9,
            white_area_districts: 3,
            idp_districts: 1,
            wa_idp_districts: 0,

            bphs_districts: 3,
            bphs_services: 149,

            hc_districts: 2,
            hc_services: 613,

            categories: [ 'Chak-e-Wardak', 'Maydanshahr', 'Saydabad' ],
            bphs_data: [ 65, 52, 32 ],
            hc_data: [ 0, 427, 186 ]
          },
          zabul: {
              id: 'zabul',
              title: 'Zabul',
              districts: 11,
            white_area_districts: 1,
            idp_districts: 5,
            wa_idp_districts: 1,

            bphs_districts: 2,
            bphs_services: 60,

            hc_districts: 0,
            hc_services: 0,

            categories: [ 'Qalat', 'Shah Joy' ],
            bphs_data: [ 55, 5 ],
            hc_data: [ 0, 0 ]
          }
        }

        return data;
      }
		};

	}]);
