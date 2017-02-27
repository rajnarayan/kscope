'use strict';

var util        = require('util');

var google = require('googleapis');
var API_KEY = 'AIzaSyAA75xUV5Rxhtd5Zxo5Vw7Nc7IKKCOq_N8'; // specify your API key here
var service = google.youtube('v3');
service.search.list({
     key: API_KEY,
     order: 'relevance',
     part: 'id,snippet',
     q: 'The End by the Doors'
 }, function(err, response) {
    	  if (err) {
    	      console.log('The API returned an error: ' + err);
    	  }
          if (response) {
              console.log(util.inspect(response, false, null));
          }
    });
