// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-getting-started-intermediate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('app')
    .controller('ArtistController', ArtistController);

function ArtistController($stateParams, $location, Artist) {
    let ctrl        = this;
    var keywords    = $stateParams.keywords;
    var artistId    = $stateParams.artistId;
    var info        = $stateParams.info;
    var artists;
    var releaseId   = $stateParams.releaseId;
    var recordings;
    var recordingId = $stateParams.recordingId;
    var recording;
    
    ctrl.initState = () => {
        if($location.search().artistId) ctrl.artistId = $location.search().artistId;
        if($stateParams.artistId) ctrl.artistId = $stateParams.artistId;
        if($location.search().info) ctrl.info = $location.search().info;
        if($stateParams.info) ctrl.info = $stateParams.info;
        ctrl.keywords = $stateParams.keywords;

        if($location.search().releaseId) ctrl.releaseId = $location.search().releaseId;
        if($stateParams.releaseId) ctrl.releaseId = $stateParams.releaseId;
        if($location.search().recordingId) ctrl.recordingId = $location.search().recordingId;
        if($stateParams.recordingId) ctrl.recordingId = $stateParams.recordingId;
    }

    ctrl.search = (keywords) => {
        ctrl.initState();
        artistId = ctrl.artistId;
        info     = ctrl.info;
        keywords = ctrl.keywords;
        const params = { keywords };
        Artist.searchArtistByName(params).$promise
	    .then(artists => {
	    	ctrl.artists = artists.artists;
	        })
            .catch(err => {
              console.log(err);
            });
    }

    ctrl.lookupArtist = (info) => {
        ctrl.initState();
        artistId = ctrl.artistId;
        info     = ctrl.info;
        keywords = ctrl.keywords;
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

    ctrl.lookupRelease = (info) => {
        ctrl.initState();
        releaseId = ctrl.releaseId;
        info     = ctrl.info;
        keywords = ctrl.keywords;
        if(!info) info = "recordings";
        if(!releaseId || !info) return;
        
        const params = { releaseId, info };
	Artist.lookupRelease(params).$promise
	    .then(recordings => {
	    	ctrl.recordings = recordings.recordings;
	        })
            .catch(err => {
              console.log(err);
            });
    }

    ctrl.lookupRecording = (info) => {
        ctrl.initState();
        recordingId = ctrl.recordingId;
        info     = '';//ctrl.info;
        keywords = ctrl.keywords;
        //if(!info) info = "artists";
        if(!recordingId) return;
        
        const params = { recordingId, info };
	Artist.lookupRecording(params).$promise
	    .then(recording => {
	    	ctrl.recording = recording.recording;
	        })
            .catch(err => {
              console.log(err);
            });
    }

};

ArtistController.$inject = ['$stateParams','$location','Artist'];
