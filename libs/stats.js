var async = require('async');

function Stats(){
	this.name = 'Stats';

}

// calculate transactions per country
Stats.prototype.calculateCountryTransactions = function(){
	async.waterfall(
	    [
	        function(callback) {
	            var country_list = [];

	            //get logs from redism on groups of 10
	            redis_client1.llen('logs', function(err, len) {
	            	// emit the total numbers of messages in queue
	            	io.sockets.emit('queue-size', len);

					if(len >= 10){
						// if we have at least 10 logs available, take each log and count transactions per country
						redis_client1.LRANGE("logs","0","9",function(err,log){
					        log.forEach(function (message, i) {
					        	obj = JSON.parse(message);
					            var number = Stats.prototype.countCountryOccurence(country_list, obj.originatingCountry);

					            // if the transaction number is greater than 0, we remove it from list and add again with incremented number
					            if(number > 0){
					            	country_list = Stats.prototype.removeItem(country_list, obj.originatingCountry);
					            }
					            	
				        		country_list.push({
					            	country: obj.originatingCountry,
					            	count: number+1
					            });

				        		// remove the processed log
					        	redis_client1.lrem('logs', -2, message, function(err) {
								});
					        });
					   		
					   		// if we have what to show, we emit to socket
					       	if(country_list.length > 0) {
					       		io.sockets.emit('new-transaction', JSON.stringify(country_list));
					       	}	
					    })
					}
				});
	            callback(null, country_list);
	        }
	    ],
	    function (err, country_list) {
	    }
	);

}

//count occurence for a given item 
Stats.prototype.countCountryOccurence = function(dataArray, item){
	var count = 0;
	if(dataArray.length == 0) return count;
	for (var i=0; i < dataArray.length; i++){
		if(dataArray[i].country == item){
			count = count + dataArray[i].count;
		}
	}
	return count;
}

//remove item by value
Stats.prototype.removeItem = function(dataArray, item){
	for (var i=0; i < dataArray.length; i++){
		if(dataArray[i].country == item){
			dataArray.splice(i,1);
			return dataArray;
		}

	}
	return dataArray;
}

module.exports = Stats;