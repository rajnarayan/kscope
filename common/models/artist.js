'use strict';

module.exports = function(Artist) {

  //MusicBrainz API
  var NB    = require('nodebrainz');
  var nb    = new NB({userAgent:'kscope/0.1 ( http://localhost )'});
	    

//  var GA    = require('../../server/googleapi.js');
//  var ga    = new GA();
  var util  = require('util');

  //Google API
  var google = require('googleapis');
  var GOOGLE_API_KEY = 'AIzaSyAA75xUV5Rxhtd5Zxo5Vw7Nc7IKKCOq_N8'; // specify your API key here
  var googleService = google.youtube('v3');

  //Gracenote API
  var Gracenote = require("node-gracenote");
  var clientId  = "864237780-FF3616097A52880965697A0A4ADC1DA3";
  var clientTag = "FF3616097A52880965697A0A4ADC1DA3";
  var userId    = null;
  var userId    = "51044503332816635-F643EB286C619F0C4869D42B3EA29C8E";
  var GN = new Gracenote(clientId,clientTag,userId);

  //MusixMatch API
  var lyr = require('lyrics-fetcher');

  var wh = require('webhoseio/webhoseio.js');
  var webhoseio = wh.config({token: '921fa2e6-ad2c-4d93-82ac-842d041399b7'});

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
      var params;
      if (artist)
          params = {recording: song, artist: artist, country:'US'};
      else
          params = {recording: song, country:'US'};

      nb.search('recording', params, function(err, response){
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
      var query;
      if (artist) 
          query = song + " by " + artist;
      else
          query = song;

      googleService.search.list({
         key: GOOGLE_API_KEY,
         order: 'relevance',
         part: 'id,snippet',
         q: query
       }, function(err, response) {
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

  Artist.searchVideosByAAndS = function(song, artist, cb) {

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
	      cb(null, null)
		  //              cb(null, response);
              return;
          }
    	});
  };

  Artist.searchAlbum = function(song, album, artist, cb) {

      if (song == null && album == null && artist == null) {
          console.log("No search term");
          cb(null, null);
          return;
      }
//      GN.register(function(err, uid) {
//	      // store this somewhere for the next session
//	      console.log("Gracenote user ID: " + uid);
//	      //              cb(null, uid);
//      });      
      GN.searchTrack(artist, album, song, function(err, result) {
	  if (err) {
              console.log(err);
              cb(null, null);
              return;
	  }
          console.log(result);
          cb(null, result);
      });
  };


  Artist.getLyrics = function(song, artist, cb) {

      if (song == null && artist == null) {
          console.log("No search term");
          cb(null, null);
          return;
      }
 
      lyr.fetch(artist, song, function (err, lyrics) {
	  if (err) {
              console.log(err);
              cb(null, null);
              return;
	  }
          console.log(lyrics);
          cb(null, lyrics);
      });
  };

  Artist.searchNewsByArtist = function(artist, cb) {

      if (artist == null) {
          console.log("No search term");
          cb(null, null);
          return;
      }
 
    var query = artist + " thread.title:(" + artist + ") language:(english) thread.country:US (site_type:news)"
    webhoseio.query('filterWebData', {q: query, size:10})
    .then(output => {
	    console.log(output['totalResults']);
	    // 15565094
	    console.log(output['posts'].length);
	    // 10
	    console.log(output['posts'][0]['language']);
	    // english
	    console.log(output['posts'][0]["title"]);
	    // Putting quotes around dictionary keys in JS
            cb(null, output);
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
    'searchAlbum', {
      http: {
        path: '/searchAlbum',
        verb: 'post',
      },
     accepts: [
	        { arg: 'song', type: 'string'},
	        { arg: 'album', type: 'string'},
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
    'getLyrics', {
      http: {
        path: '/getLyrics',
        verb: 'post',
      },
     accepts: [
	        { arg: 'song', type: 'string'},
	        { arg: 'artist', type: 'string'}
	      ],
     returns: [
	        { arg: 'lyrics', type: 'object'}
              ]
         });

  Artist.remoteMethod(
    'searchNewsByArtist', {
      http: {
        path: '/searchNewsByArtist',
        verb: 'post',
      },
     accepts: [
	        { arg: 'artist', type: 'string'}
	      ],
     returns: [
	        { arg: 'news', type: 'object'}
              ]
         });

};
