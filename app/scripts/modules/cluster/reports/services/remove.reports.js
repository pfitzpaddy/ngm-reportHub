db.getCollection('report').find({_id:ObjectId('5d6b26248bbb2d564aa0c424')});
db.getCollection('report').remove({_id:ObjectId('5d6b26248bbb2d564aa0c424')});

db.getCollection('report').find({ report_month:8, report_year:2019 }).forEach(function(d){
	var location = db.getCollection('location').find({report_id: d._id.valueOf() });
	print( location.length() );
	// if( !location.length() ) {
		// print( d._id.valueOf() );
		// db.getCollection('report').remove({ _id:ObjectId( d._id.valueOf() )});
	// }
});


ssh -i ngm.prod.pem ubuntu@52.59.200.197
mongo
use ngmHealthCluster
db.getCollection('report').remove({_id:ObjectId('5d6b26248bbb2d564aa0c3fe')});
exit
exit