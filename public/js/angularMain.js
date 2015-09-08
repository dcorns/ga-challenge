/**
 * angularMain
 * Created by dcorns on 9/7/15
 * Copyright © 2015 Dale Corns
 */
'use strict';

angular.module('gaApp', [])
.controller('gaController', function($scope){
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
      ajaxGet('/favorites', function(err, data){//http://localhost:3000
        if(err){
          console.error(err);
        }
        else{
          movSrch.favorites = data;
          buildFavorites(movSrch.favorites);
        }
      });
    };
  });