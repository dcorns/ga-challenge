/**
 * main.js
 * Created by dcorns on 9/3/15
 * Copyright © 2015 Dale Corns
 */
'use strict';
//Create Global Object
var movSrch = {};
//DOM Rendering functions++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function buildForm(parent){
  var frm = document.createElement('form'),
      srch = document.createElement('input'),
      btn = document.createElement('button');
  srch.setAttribute('type', 'text');
  srch.setAttribute('id', 'search-term');
  btn.setAttribute('type', 'button');
  btn.textContent = 'SEARCH';
  btn.setAttribute('id', 'btnSearch');
  frm.setAttribute('action', '');
  frm.appendChild(srch);
  frm.appendChild(btn);
  parent.appendChild(frm);
}

function buildApiReturnView(data){
  movieList.innerHTML = '';
  var movieItem;
  data.forEach(function(item, idx){
    movieItem = document.createElement('li');
    movieItem.setAttribute('data-idx', idx);
    movieItem.setAttribute('data-title', item.Title);
    movieItem.setAttribute('data-type', item.Type);
    movieItem.setAttribute('data-year', item.Year);
    movieItem.setAttribute('data-imdbid', item.imdbID);
    movieItem.innerHTML = item['Title'];
    movieItem.addEventListener('click', function(e){
      makeDetails(e.target.dataset);
    });
    movieList.appendChild(movieItem);
  });
}

function makeDetails(data){
  movieTable.innerHTML = '';
  addFavoriteBtn.setAttribute('data-idx', data.idx);
  var titleRow = document.createElement('row'),
      typeRow = document.createElement('row'),
      yearRow = document.createElement('row'),
      imdbIdRow = document.createElement('row'),
      titleH = document.createElement('th'),
      titleD = document.createElement('td'),
      typeH = document.createElement('th'),
      typeD = document.createElement('td'),
      yearH = document.createElement('th'),
      yearD = document.createElement('td'),
      imdbIdH = document.createElement('th'),
      imdbIdD = document.createElement('td');
  titleH.innerHTML = 'TITLE: ';
  titleD.innerHTML = data.title;
  titleRow.appendChild(titleH);
  titleRow.appendChild(titleD);
  movieTable.appendChild(titleRow);
  typeH.innerHTML = 'TYPE: ';
  typeD.innerHTML = data.type;
  typeRow.appendChild(typeH);
  typeRow.appendChild(typeD);
  movieTable.appendChild(typeRow);
  yearH.innerHTML = 'YEAR: ';
  yearD.innerHTML = data.year;
  yearRow.appendChild(yearH);
  yearRow.appendChild(yearD);
  movieTable.appendChild(yearRow);
  imdbIdH.innerHTML = 'IMDBID: ';
  imdbIdD.innerHTML = data.imdbid;
  imdbIdRow.appendChild(imdbIdH);
  imdbIdRow.appendChild(imdbIdD);
  movieTable.appendChild(imdbIdRow);
}

function buildFavorites(data){
  favoritesList.innerHTML = '';
  var movieItem;
  data.forEach(function(item, idx){
    movieItem = document.createElement('li');
    movieItem.setAttribute('data-idx', idx);
    movieItem.setAttribute('data-title', item.Title);
    movieItem.setAttribute('data-type', item.Type);
    movieItem.setAttribute('data-year', item.Year);
    movieItem.setAttribute('data-imdbid', item.imdbID);
    movieItem.innerHTML = item['Title'];
    movieItem.addEventListener('click', function(e){
      makeDetails(e.target.dataset);
    });
    favoritesList.appendChild(movieItem);
  });
}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//DOM actions+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function buildActions(){
  document.getElementById('btnSearch').addEventListener('click', function(){
    getResults();
  });
  document.getElementById('search-term').addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      getResults();
    }
  });
  document.getElementById('addFavoriteBtn').addEventListener('click', function(e){
    addFavorite(e);
  });
  document.getElementById('favoritesBtn').addEventListener('click', function(){
    getFavorites();
  });
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//support methods++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var ajaxGet = function(url, cb, token){
  var ajaxReq = new XMLHttpRequest();
  ajaxReq.addEventListener('load', function(){
    if(ajaxReq.status === 200  || ajaxReq.status === 304) cb(null, JSON.parse(ajaxReq.responseText));
    else cb(ajaxReq.response, null);
  });
  ajaxReq.addEventListener('error', function(data){
    console.dir(ajaxReq);
    console.dir(data);
    cb({XMLHttpRequestError: 'A fatal error occurred, see console for more information'}, null);
  });
  ajaxReq.open('GET', url, true);
//Authentication section-------------------------------------------
//Must open before setting request header, so this order is required
  if(token){
    ajaxReq.setRequestHeader('Authorization', token);
  }
  //---------------------------------------------------------------
  ajaxReq.send();
};

var ajaxPost = function(url, jsonData, cb, token){
  var ajaxReq = new XMLHttpRequest();
  ajaxReq.addEventListener('load', function(){
    if(ajaxReq.status === 200) cb(null, JSON.parse(ajaxReq.responseText));
    else cb(JSON.parse(ajaxReq.response), null);
  });
  ajaxReq.addEventListener('error', function(data){
    console.dir(ajaxReq);
    console.dir(data);
    cb({XMLHttpRequestError: 'A fatal error occurred, see console for more information'}, null);
  });

//Must open before setting request header, so this order is required
  ajaxReq.open('POST', url, true);
  ajaxReq.setRequestHeader('Content-Type', 'application/json');
  if(token){
    ajaxReq.setRequestHeader('Authorization', token);
  }
  ajaxReq.send(JSON.stringify(jsonData));
};
//Make request to API
function getResults(){
  var searchTerm = document.getElementById('search-term').value;
  ajaxGet('http://www.omdbapi.com/?s=' + searchTerm, function(err, data){
    if(err){
      console.error(err);
    }
    else{
      movSrch.data = data.Search;
      buildApiReturnView(movSrch.data);
    }
  });
}

function addFavorite(e){
  console.dir(movSrch.data[e.target.dataset.idx]);
  ajaxPost('http://localhost:3000/favorites', movSrch.data[e.target.dataset.idx], function(err, data){
    if(err){
      console.error(err);
      alert('There was a problem saving favorite');
      return;
    }
    movSrch.favorites = data;
    alert('Favorite Saved');
  });
}

function getFavorites(){
  ajaxGet('http://localhost:3000/favorites', function(err, data){
    if(err){
      console.error(err);
    }
    else{
      movSrch.favorites = data;
      buildFavorites(movSrch.favorites);
    }
  });
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Build+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var body = document.getElementsByTagName('body')[0],
    main = document.createElement('main'),
    movieData = document.createElement('article'),
    listSection = document.createElement('section'),
    detailSection = document.createElement('section'),
    favoritesSection = document.createElement('section'),
    favoritesList = document.createElement('ul'),
    favoritesBtn = document.createElement('button'),
    movieList = document.createElement('ul'),
    movieTable = document.createElement('table'),
    addFavoriteBtn = document.createElement('button');


addFavoriteBtn.setAttribute('id', 'addFavoriteBtn');
addFavoriteBtn.textContent = 'Add To Favorites';
movieTable.setAttribute('caption', 'Movie Details');
favoritesBtn.setAttribute('id', 'favoritesBtn');
favoritesBtn.textContent = 'View Favorites';

favoritesSection.appendChild(favoritesBtn);
main.appendChild(favoritesSection);
buildForm(main);
body.appendChild(main);
main.appendChild(movieData);
movieData.appendChild(listSection);
movieData.appendChild(detailSection);
listSection.appendChild(movieList);
detailSection.appendChild(movieTable);
favoritesSection.appendChild(addFavoriteBtn);
favoritesSection.appendChild(favoritesList);
buildActions();