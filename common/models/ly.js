var lyr = require('lyrics-fetcher');
 
lyr.fetch('Tove Lo', 'My Gun', function (err, lyrics) {
	console.log(err || lyrics);
    });

//
//var mm = require('metalminer');
// 
//// To see which properties are necessary in metaInfo, see below 
//var metaInfo = {
//    title: 'Holiday',
//    artist: 'Madonna',
//    album: ''
//};
// 
////mm.getBandInfo(metaInfo, function (err, data) {
////	console.log(err || data);
////    });
//
//
//mm.getLyrics(metaInfo, function (err, data) {
//	console.log(err || data);
//    });