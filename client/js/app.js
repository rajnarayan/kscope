// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-getting-started-intermediate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('app', [
    'ui.router',
    'lbServices'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
      $urlRouterProvider) {
    $stateProvider
      .state('search', {
        url: '/search?keywords',
        templateUrl: 'views/search.html',
        controller: 'ArtistController',
        controllerAs: 'ctrl'
      })
      .state('search.releases', {
        url: '/releases?artistId?info',
        templateUrl: 'views/releases.html',
        controller: 'ArtistController',
        controllerAs: 'ctrl'
      })
      .state('search.works', {
        url: '/works?artistId?info',
        templateUrl: 'views/works.html',
        controller: 'ArtistController',
        controllerAs: 'ctrl'
      })
      .state('search.recordings', {
        url: '/recordings?artistId?info',
        templateUrl: 'views/recordings.html',
        controller: 'ArtistController',
        controllerAs: 'ctrl'
      })
      .state('search.release', {
        url: '/release?artistId?releaseId?info',
        templateUrl: 'views/release.html',
        controller: 'ArtistController',
        controllerAs: 'ctrl'
      })
      .state('search.recording', {
        url: '/recording?artistId?releaseId?recordingId?info',
        templateUrl: 'views/recording.html',
        controller: 'ArtistController',
        controllerAs: 'ctrl'
      })
      .state('song', {
        url: '/song?artist?song',
        templateUrl: 'views/song.html',
        controller: 'ArtistController',
        controllerAs: 'ctrl'
      })
      .state('add-review', {
        url: '/add-review',
        templateUrl: 'views/review-form.html',
        controller: 'AddReviewController',
        authenticate: true
      })
      .state('all-reviews', {
        url: '/all-reviews',
        templateUrl: 'views/all-reviews.html',
        controller: 'AllReviewsController'
      })
      .state('edit-review', {
        url: '/edit-review/:id',
        templateUrl: 'views/review-form.html',
        controller: 'EditReviewController',
        authenticate: true
      })
      .state('delete-review', {
        url: '/delete-review/:id',
        controller: 'DeleteReviewController',
        authenticate: true
      })
      .state('forbidden', {
        url: '/forbidden',
        templateUrl: 'views/forbidden.html',
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'AuthLoginController'
      })
      .state('logout', {
        url: '/logout',
        controller: 'AuthLogoutController'
      })
      .state('my-reviews', {
        url: '/my-reviews',
        templateUrl: 'views/my-reviews.html',
        controller: 'MyReviewsController',
        authenticate: true
      })
      .state('sign-up', {
        url: '/sign-up',
        templateUrl: 'views/sign-up-form.html',
        controller: 'SignUpController',
      })
      .state('sign-up-success', {
        url: '/sign-up/success',
        templateUrl: 'views/sign-up-success.html'
      });
    $urlRouterProvider.otherwise('song');
  }])
  .run(['$rootScope', '$state', 'LoopBackAuth', 'AuthService', function($rootScope, $state, LoopBackAuth, AuthService) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
      // redirect to login page if not logged in
      if (toState.authenticate && !LoopBackAuth.accessTokenId) {
        event.preventDefault(); //prevent current page from loading

        // Maintain returnTo state in $rootScope that is used
        // by authService.login to redirect to after successful login.
        // http://www.jonahnisenson.com/angular-js-ui-router-redirect-after-login-to-requested-url/
        $rootScope.returnTo = {
          state: toState,
          params: toParams
        };

        $state.go('forbidden');
      }
    });

    // Get data from localstorage after pagerefresh
    // and load user data into rootscope.
    if (LoopBackAuth.accessTokenId && !$rootScope.currentUser) {
      AuthService.refresh(LoopBackAuth.accessTokenId);
    }
  }]);
