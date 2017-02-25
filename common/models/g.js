'use strict';

var GA = require('../../server/googleapi.js');
var ga = new GA();
var util        = require('util');

ga.youtubeSearch("Like a Virgin by Madonna", function(err, response) {
    	  if (err) {
    	      console.log('The API returned an error: ' + err);
    	  }
          if (response) {
              console.log(util.inspect(response, false, null));
          }
    });
