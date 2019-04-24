(function($){
	$(function(){

		var myConnector = tableau.makeConnector();

		myConnector.getSchema = function ( schemaCallback ) {

			// cols
	    var cols = [{
	        id: 'id',
	        dataType: tableau.dataTypeEnum.string
	    }, {
	        id: 'mag',
	        alias: 'magnitude',
	        dataType: tableau.dataTypeEnum.float
	    }, {
	        id: 'title',
	        alias: 'title',
	        dataType: tableau.dataTypeEnum.string
	    }, {
	        id: 'location',
	        dataType: tableau.dataTypeEnum.geometry
	    }];

	    var tableSchema = {
	        id: 'earthquakes',
	        alias: 'Earthquakes with magnitude greater than 4.5 in the last seven days',
	        columns: cols
	    };

	    // callback
	    schemaCallback( [tableSchema] );

		};

		myConnector.getData = function ( table, doneCallback ) {
	    $.getJSON( 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson', function( resp ) {
	        var feat = resp.features,
	            tableData = [];

	        // Iterate over the JSON object
	        for (var i = 0, len = feat.length; i < len; i++) {
	            tableData.push({
	                'id': feat[i].id,
	                'mag': feat[i].properties.mag,
	                'title': feat[i].properties.title,
	                'location': feat[i].geometry
	            });
	        }

	        table.appendRows( tableData );
	        doneCallback();
	    });
		};

		tableau.registerConnector( myConnector );

	}); // end of document ready
})(jQuery); // end of jQuery name space
