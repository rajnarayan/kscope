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
      .state('song.videos', {
        url: '/videos',
        templateUrl: 'song/videos.html',
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
    var song;
    var videos;
    
    ctrl.initState = () => {
        if($location.search().artist) ctrl.artist = $location.search().artist;
        if($stateParams.song) ctrl.song = $stateParams.song;
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
