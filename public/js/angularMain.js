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
    $scope.getResults = function(){
      var searchTerm = document.getElementById('search-term').value;
      ajaxGet('https://www.omdbapi.com/?s=' + searchTerm, function(err, data){
        if(err){
          console.error(err);
        }
        else{
          movSrch.data = data.Search;
          buildApiReturnView(movSrch.data);
        }
      });
    };
    $scope.addFavorite = function(){
      console.dir(movSrch.data[e.target.dataset.idx]);
      ajaxPost('/favorites', movSrch.data[e.target.dataset.idx], function(err, data){
        if(err){
          console.error(err);
          alert('There was a problem saving favorite');
          return;
        }
        movSrch.favorites = data;
        alert('Favorite Saved');
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
  });