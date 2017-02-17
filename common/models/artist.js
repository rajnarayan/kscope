'use strict';

module.exports = function(Artist) {

  var NB  = require('nodebrainz');
  var nb  = new NB({userAgent:'kscope/0.1 ( http://localhost )'});

  Artist.status = function(cb) {
    var currentDate = new Date();
    var currentHour = currentDate.getHours();
    var OPEN_HOUR = 6;
    var CLOSE_HOUR = 20;
    console.log('Current hour is %d', currentHour);
    var response;
    if (currentHour > OPEN_HOUR && currentHour < CLOSE_HOUR) {
      response = 'We are open for business.';
    } else {
      response = 'Sorry, we are closed. Open daily from 6am to 8pm.';
    }
    cb(null, response);
  };


  Artist.searchArtistByName = function(keywords, cb) {

      if (keywords == null) {
          console.log("No search term");
          cb(null, null);
          return;
      }

    var resp;
    nb.search('artist', {artist: keywords, country:'US'}, function(err, response){
        resp = response; 
        console.log(resp);
        cb(null, resp);
    });
  };

  Artist.lookupArtist = function(artistId, info, cb) {

      if (artistId == null) {
          console.log("No artist defined");
          cb(null, null);
          return;
      }

      var resp;
      var inc = {inc:info}
      nb.artist(artistId, inc, function(err, response){
        resp = response; 
        console.log(resp);
        cb(null, resp);
	  });
  };

  Artist.remoteMethod(
    'status', {
      http: {
        path: '/status',
        verb: 'get',
      },
      returns: {
        arg: 'status',
        type: 'string',
      },
    }
  );

  Artist.remoteMethod(
    'searchArtistByName', {
      http: {
        path: '/searchArtistByName',
        verb: 'post',
      },
     accepts: [
	        { arg: 'keywords', type: 'string'}
	      ],
     returns: [
	        { arg: 'artists', type: 'object'}
              ]
         });

  Artist.remoteMethod(
    'lookupArtist', {
      http: {
        path: '/lookupArtist',
        verb: 'post',
      },
     accepts: [
	        { arg: 'artistId', type: 'string'},
	        { arg: 'info', type: 'string'}
	      ],
     returns: [
	        { arg: 'artists', type: 'object'}
              ]
         });


};
