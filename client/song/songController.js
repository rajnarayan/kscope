// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-getting-started-intermediate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('song', [])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
      $urlRouterProvider) {
    $stateProvider
      .state('song', {
        url: '/song?artist?song',
        templateUrl: 'song/song.html',
        controller: 'SongController',
        controllerAs: 'ctrl'
        })
      }]);

angular
  .module('song')
    .controller('SongController', SongController);


function SongController($stateParams, $location, Artist) {
    let ctrl        = this;

    var artist;
    var song;
    
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
};

SongController.$inject = ['$stateParams','$location','Artist'];
