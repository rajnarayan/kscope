// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-getting-started-intermediate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('app')
    .controller('ArtistController', ArtistController);

function ArtistController($stateParams, $location, Artist) {
    let ctrl     = this;
    var keywords = $stateParams.keywords;
    var artistId = $stateParams.artistId;
    var info     = $stateParams.info;
    var artists;
    
    ctrl.keywords = $stateParams.keywords;
    ctrl.artistId = $stateParams.artistId;
    ctrl.info     = $stateParams.info;

    ctrl.search = (keywords) => {
        artistId = ctrl.artistId = $location.search().artistId;
        info     = ctrl.info     = $location.search().info;
        keywords = ctrl.keywords = $stateParams.keywords;
        const params = { keywords };
        Artist.searchArtistByName(params).$promise
	    .then(artists => {
	    	ctrl.artists = artists.artists;
	        })
            .catch(err => {
              console.log(err);
            });
    }

    ctrl.lookup = (info) => {
        artistId = ctrl.artistId = $stateParams.artistId;
        info     = ctrl.info     = $stateParams.info;
        keywords = ctrl.keywords = $stateParams.keywords;
	//        artistId = "79239441-bfd5-4981-a70c-55c3f15c1287";
        if(!info) info = "releases";
        if(!artistId || !info) return;
        
        const params = { artistId, info };
	Artist.lookupArtist(params).$promise
	    .then(artists => {
	    	ctrl.artists = artists.artists;
	        })
            .catch(err => {
              console.log(err);
            });
    }
};

ArtistController.$inject = ['$stateParams','$location','Artist'];
