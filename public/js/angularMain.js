/**
 * angularMain
 * Created by dcorns on 9/7/15
 * Copyright © 2015 Dale Corns
 */
'use strict';

angular.module('ga', [])
.controller('gaController', function($scope, $http){
    $scope.movieList = [];
    $scope.favoritesList = [];
    $scope.detail = {Title: '', Type: '', Year: '', imdbID: ''};
    $scope.searchterm = '';
    $scope.getResults = function(){
     var remoteResults = $http.get('https://www.omdbapi.com/?s=' + $scope.searchterm);
      remoteResults.then(function(res){//success
          $scope.movieList = res.data.Search;
        }, function(){//error
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