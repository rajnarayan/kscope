'use strict';




  var Gracenote = require("node-gracenote");
  var clientId  = "864237780-FF3616097A52880965697A0A4ADC1DA3";
  var clientTag = "FF3616097A52880965697A0A4ADC1DA3";
  var userId    = null;
  var userId    = "51044503332816635-F643EB286C619F0C4869D42B3EA29C8E";
  var GN = new Gracenote(clientId,clientTag,userId);


      GN.register(function(err, uid) {
	      // store this somewhere for the next session
	      console.log("Gracenote user ID: " + uid);
	      //              cb(null, uid);

      });      
//      GN.searchArtist("The Doors", function(err, result) {
//          console.log(err);
//          console.log("Artist:");
//          console.log(result);
//      });
//      GN.searchAlbum("The Doors", "The Doors", function(err, result) {
//          console.log(err);
//          console.log("Album:");
//          console.log(result);
//      });
	      var song = "The End";
      GN.searchTrack("", "", "The End", function(err, result) {
          console.log(err);
          console.log("Track:");
          console.log(result);
//          cb(null, result);
      });

