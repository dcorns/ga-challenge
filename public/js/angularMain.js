/**
 * angularMain
 * Created by dcorns on 9/7/15
 * Copyright © 2015 Dale Corns
 */
'use strict';
/**
 * Define the angular module and its controller. Normally some of this stuff would be abstracted out, but because the size of the app is small, we can get away with putting everything in the controller. Our controller always depends on $scope and we are making http request so we also depend on the $http service. So they are passed into or injected into the 'gaController' function.
 */
angular.module('ga', [])
.controller('gaController', function($scope, $http){
    /**
     * $scope sets up the localization of the controllers reach and so all our variables and functions are attached to the $scope object
     */
    $scope.movieList = [];
    $scope.favoritesList = [];
    $scope.detail = {Title: '', Type: '', Year: '', imdbID: ''};
    $scope.searchterm = '';
    /**
     *
     */
    $scope.getResults = function(){
      /**
       * As seen here, making a get request in angular is quite simple. There are different ways of achieving the same thing here but this is my proffered way of doing it. Since $http.get returns a promise. We can assign it to a variable and use the 'then' method in order to proccess the data when it arrives. 'then' is passed 2 functions and arguments. The first one handles a successful request and the second handles unsuccessful requests. The request object is return from the promise. I have assigned it to 'res' throughout this application.
       * @param $scope.searchterm is bound to the input element used for search in the html so there is no need to query the element for the value.
       */
      var remoteResults = $http.get('https://www.omdbapi.com/?s=' + $scope.searchterm);
      remoteResults.then(function(res){//success
          $scope.movieList = res.data.Search;
        }, function(res){//error
          console.error(res.data);
        });
    };

    $scope.addFavorite = function(){
      var addRemoteFavorite = $http.post('/favorites', $scope.detail);
      addRemoteFavorite.then(function(res){//success
        $scope.favoritesList = res.data;
      }, function(res){//error
        console.error(res.data);
      });
    };
    $scope.getFavorites = function(){
      var remoteFavorites = $http.get('/favorites');
      remoteFavorites.then(function(res){//success
        $scope.favoritesList = res.data;
      }, function(res){//error
        console.error(res.data);
      });
    };
    $scope.setDetails = function(e){
      $scope.detail = JSON.parse(e.target.dataset.detail);
    };
  });