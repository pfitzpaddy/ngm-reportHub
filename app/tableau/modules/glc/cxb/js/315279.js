(function($){
	$(function(){		

		var myConnector = tableau.makeConnector();

		myConnector.getSchema = function ( schemaCallback ) {

			// cols
			var cols = [{
					id: 'id',
					dataType: tableau.dataTypeEnum.string
			}, {
					id: 'organization',
					dataType: tableau.dataTypeEnum.string
			}];

			var tableSchema = {
					id: '315279',
					alias: 'Temperature-controlled storage capacity assessment',
					columns: cols
			};

			// callback
			schemaCallback( [tableSchema] );

		};

		myConnector.getData = function ( table, doneCallback ) {
			
			// params
			var username = 'a';
			var password= 'b';
			var formId = '315279';

			// ajax
			$.ajaxSetup({
				headers : {
					'Authorization': 'Basic ' + btoa( username + ':' + password),
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
					'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Custom-Header',
					'Access-Control-Allow-Credentials': 'true'
				}
			});
			$.getJSON( 'https://kc.humanitarianresponse.info/api/v1/data/'+ formId + '?format=json', function( resp ) {
				var feat = resp.features,
						tableData = [];

				// Iterate over the JSON object
				for (var i = 0, len = feat.length; i < len; i++) {
						tableData.push({
								'id': feat[i]['_id'],
								'organization': feat[i]['Organization_Name']
						});
				}

				table.appendRows( tableData );
				doneCallback();
			});

		};

		// register connector
		tableau.registerConnector( myConnector );

	}); // end of document ready
})(jQuery); // end of jQuery name space
