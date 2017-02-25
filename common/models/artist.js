'use strict';

module.exports = function(Artist) {

  var NB    = require('nodebrainz');
  var nb    = new NB({userAgent:'kscope/0.1 ( http://localhost )'});
	    
  var GA    = require('../../server/googleapi.js');
  var ga    = new GA();
  var util  = require('util');

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

  Artist.lookupRelease = function(releaseId, info, cb) {

      if (releaseId == null) {
          console.log("No release defined");
          cb(null, null);
          return;
      }

      var resp;
      var inc = {inc:info}
      nb.release(releaseId, inc, function(err, response){
        resp = response; 
        console.log(resp);
        cb(null, resp);
	  });
  };

  Artist.lookupRecording = function(recordingId, info, cb) {

      if (recordingId == null) {
          console.log("No recording defined");
          cb(null, null);
          return;
      }

      var resp;
      var inc = {inc:info}
      nb.recording(recordingId, inc, function(err, response){
        resp = response; 
        console.log(resp);
        cb(null, resp);
	  });
  };

  Artist.searchSongByName = function(song, artist, cb) {

      if (song == null) {
          console.log("No search term");
          cb(null, null);
          return;
      }

    var resp;
      nb.search('recording', {recording: song, artist: artist, country:'US'}, function(err, response){
        resp = response; 
        console.log(resp);
        cb(null, resp);
    });
  };

  Artist.searchArtistBySong = function(song, cb) {

      if (song == null) {
          console.log("No search term");
          cb(null, null);
          return;
      }

    var resp;
      nb.search('recording', {recording: song, country:'US'}, function(err, response){
        resp = response; 
        console.log(resp);
        cb(null, resp);
    });
  };

  Artist.searchVideosByArtistAndSong = function(song, artist, cb) {

      if (song == null) {
          console.log("No search term");
          cb(null, null);
          return;
      }

    var resp;
    var query = song + " by " + artist;
    ga.youtubeSearch(query, function(err, response) {
    	  if (err) {
    	      console.log('The API returned an error: ' + err);
              cb(null, null);
              return;
    	  }
          if (response) {
              console.log(util.inspect(response, false, null));
              cb(null, response);
              return;
          }
    	});
  };

  Artist.googleAuth = function(code, cb) {

      if (code == null) {
          console.log("No google auth code");
          cb(null, null);
          return;
      }

      ga.getToken(code, function(err, tokens) {
    	  if (err) {
    	      console.log('The API returned an error: ' + err);
              cb(null, null);
              return;
    	  }
          if (response) {
              console.log(util.inspect(response, false, null));
              cb(null, tokens);
              return;
          }
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

  Artist.remoteMethod(
    'lookupRelease', {
      http: {
        path: '/lookupRelease',
        verb: 'post',
      },
     accepts: [
	        { arg: 'releaseId', type: 'string'},
	        { arg: 'info', type: 'string'}
	      ],
     returns: [
	       { arg: 'recordings', type: 'object'}
              ]
         });

  Artist.remoteMethod(
    'lookupRecording', {
      http: {
        path: '/lookupRecording',
        verb: 'post',
      },
     accepts: [
	        { arg: 'recordingId', type: 'string'},
	        { arg: 'info', type: 'string'}
	      ],
     returns: [
	        { arg: 'recording', type: 'object'}
              ]
         });

  Artist.remoteMethod(
    'searchSongByName', {
      http: {
        path: '/searchSongByName',
        verb: 'post',
      },
     accepts: [
	        { arg: 'song', type: 'string'},
	        { arg: 'artist', type: 'string'}
	      ],
     returns: [
	        { arg: 'songs', type: 'object'}
              ]
         });


  Artist.remoteMethod(
    'searchArtistBySong', {
      http: {
        path: '/searchArtistBySong',
        verb: 'post',
      },
     accepts: [
	        { arg: 'song', type: 'string'}
	      ],
     returns: [
	        { arg: 'artists', type: 'object'}
              ]
         });

  Artist.remoteMethod(
    'searchVideosByArtistAndSong', {
      http: {
        path: '/searchVideosByArtistAndSong',
        verb: 'post',
      },
     accepts: [
	        { arg: 'song', type: 'string'},
	        { arg: 'artist', type: 'string'}
	      ],
     returns: [
	        { arg: 'videos', type: 'object'}
              ]
         });

  Artist.remoteMethod(
    'googleAuth', {
      http: {
        path: '/googleAuth',
        verb: 'post',
      },
     accepts: [
	        { arg: 'code', type: 'string'}
	      ],
     returns: [
	        { arg: 'authToken', type: 'string'}
              ]
         });
};
