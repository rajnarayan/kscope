// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-getting-started-intermediate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('song', [])
   .config(["$sceDelegateProvider", function($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
	'self',
        "*://www.youtube.com/embed/**"
        ]);
   }])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
      $urlRouterProvider) {
    $stateProvider
      .state('song', {
        url: '/song?artist?song',
        templateUrl: 'song/song.html',
        controller: 'SongController',
        controllerAs: 'ctrl'
        })
      .state('song.songs', {
        url: '/songs',
        templateUrl: 'song/songs.html',
        controller: 'SongController',
        controllerAs: 'ctrl'
        })
      .state('song.lyrics', {
        url: '/lyrics',
        templateUrl: 'song/lyrics.html',
        controller: 'SongController',
        controllerAs: 'ctrl'
        })
      .state('song.videos', {
        url: '/videos',
        templateUrl: 'song/videos.html',
        controller: 'SongController',
        controllerAs: 'ctrl'
         })
      .state('song.album', {
        url: '/album?album',
        templateUrl: 'song/album.html',
        controller: 'SongController',
        controllerAs: 'ctrl'
         })
      .state('oauth', {
        url: '/google_oauth?callback',
	templateUrl: 'views/google_oauth.html',
        controller: 'SongController',
        controllerAs: 'ctrl'
      })
      $urlRouterProvider.otherwise('songs');
	}]);

angular
  .module('song')
    .controller('SongController', SongController);


function SongController($stateParams, $location, Artist) {
    let ctrl        = this;

    var artist;
    var album;
    var song;
    var lyrics;
    var videos;
  
    var authToken;
        
    ctrl.getToken = () => {
        var code = $location.search().code;
        const params = { code };
	Artist.googleAuth(params).$promise
	    .then(authToken => {
	    	ctrl.authToken = authToken.authToken;
	        })
            .catch(err => {
              console.log(err);
            });
    }

    ctrl.initState = () => {
        if($stateParams.artist) ctrl.artist = $stateParams.artist;
        if($stateParams.album) ctrl.album = $stateParams.album;
        if($stateParams.song) ctrl.song = $stateParams.song;
        if($location.search().artist) ctrl.artist = $location.search().artist;
        if($location.search().album) ctrl.album = $location.search().album;
        if($location.search().song) ctrl.song = $location.search().song;
    }

    ctrl.searchSong = (keywords) => {
        ctrl.initState();
        song   = ctrl.song;
        artist = ctrl.artist;
        
        const params = { song, artist };
	Artist.searchSongByName(params).$promise
	    .then(songs => {
	    	ctrl.songs = songs.songs;
	        })
            .catch(err => {
              console.log(err);
            });

	//	if (song && artist) ctrl.getLyrics();
    }

    ctrl.getLyrics = () => {
        ctrl.initState();
        song   = ctrl.song;
        artist = ctrl.artist;
        
        const params = { song, artist };
	Artist.getLyrics(params).$promise
	    .then(lyrics => {
	    	ctrl.lyrics = lyrics.lyrics;
	        })
            .catch(err => {
              console.log(err);
            });
    }

    ctrl.searchAlbum = () => {
        ctrl.initState();
        song   = "";
        album  = ctrl.album;
        artist = ctrl.artist;
        
        const params = { song, album, artist };
	Artist.searchAlbum(params).$promise
	    .then(songs => {
	    	ctrl.songs = songs.songs;
	        })
            .catch(err => {
              console.log(err);
            });
    }

    ctrl.getArtistBySong = (song) => {
        ctrl.initState();
        song   = ctrl.song;
        
        const params = { song };
	Artist.searchArtistBySong(params).$promise
	    .then(artists => {
	    	ctrl.artists = artists.artists;
	        })
            .catch(err => {
              console.log(err);
            });
    }

    ctrl.lookupVideos = (song, artist) => {
        ctrl.initState();
        song   = ctrl.song;
        artist = ctrl.artist;
        
        const params = { song, artist };
	Artist.searchVideosByArtistAndSong(params).$promise
	    .then(videos => {
	    	ctrl.videos = videos.videos;
                if (ctrl.videos)
                   ctrl.videos.items.forEach(function(video){
		    video.url = "https://www.youtube.com/embed/" + video.id.videoId;
		    });
	        })
            .catch(err => {
              console.log(err);
            });
    }
    ctrl.getYoutubeUrl = (videoId) => {
        return "https://www.youtube.com/embed/" + videoId;
    }

};

SongController.$inject = ['$stateParams','$location','Artist'];
