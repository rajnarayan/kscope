  var NB  = require('nodebrainz');
  var nb  = new NB({userAgent:'kscope/0.1 ( http://localhost )'});
  var recordingId = '6bd6362f-3578-3c23-a9d0-b3b56693e27f';
  var info = {};
  var inc = {inc:info}
//      nb.recording(recordingId, inc, function(err, response){
//        resp = response; 
//        console.log(resp);
//        cb(null, resp);
//      });


    var resp;
    var song = 'Like a Virgin';
    console.log('song:' + song);
    nb.search('recording', {recording: song, artist: '', country:'US'}, function(err, response){
        resp = response; 
        console.log("artists:");
       
        console.log(resp);
	//        cb(null, resp);
    });
