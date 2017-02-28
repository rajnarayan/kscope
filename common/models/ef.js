var eventful = require('eventful-node');
var key = "n5T82hpn6Vtg6D2v";
var client = new eventful.Client(key);
 
client.searchEvents({ keywords: 'Britney Spears' }, function(err, data){
 
	if(err){
  
	    return console.error(err);
  
	}
  
	console.log('Recieved ' + data.search.total_items + ' events');
  
	console.log('Event listings: ');
        console.log(data.search);
  
	//print the title of each event 
	for(var i in data.search.events.event){
  
	    console.log(data.search.events.event[i]);
  
	}
 
    });