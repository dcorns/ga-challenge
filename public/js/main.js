/**
 * main.js
 * Created by dcorns on 9/3/15
 * Copyright © 2015 Dale Corns
 * Front end for Movie List Example Application
 * @param {Object} movSrch
 */

'use strict';
//Create Global Object
/**
 * @global
 * @type {{movieList: string, favoritesList: string, movieTable: string}}
 */
var movSrch = {
  movieList:'ul for movie search return list',
  favoritesList: 'ul for movie favorites',
  movieTable: 'movie details'
};

/**
 * Build the DOM
 * @global movSrch.movieList
 * @global movSrch.favoritesList
 * @global movSrch.movieTable
 */
function buildMain(){
  var body = document.getElementsByTagName('body')[0],
//create static elements
    main = document.createElement('main'),
    movieData = document.createElement('article'),
    listSection = document.createElement('section'),
    detailSection = document.createElement('section'),
    favoritesSection = document.createElement('section'),
    favoritesBtn = document.createElement('button'),
    frm = document.createElement('form'),
    srch = document.createElement('input'),
    btn = document.createElement('button'),
    addFavoriteBtn = document.createElement('button');
//create global static elements
  movSrch.movieList = document.createElement('ul');
  movSrch.favoritesList = document.createElement('ul');
  movSrch.movieTable = document.createElement('table');
//set static element properties and attributes
  srch.setAttribute('type', 'text');
  srch.setAttribute('id', 'search-term');
  btn.setAttribute('type', 'button');
  btn.textContent = 'SEARCH';
  btn.setAttribute('id', 'btnSearch');
  frm.setAttribute('action', '');
  addFavoriteBtn.setAttribute('id', 'addFavoriteBtn');
  addFavoriteBtn.textContent = 'Add To Favorites';
  movSrch.movieTable.setAttribute('caption', 'Movie Details');
  favoritesBtn.setAttribute('id', 'favoritesBtn');
  favoritesBtn.textContent = 'View Favorites';
//combine static elements to create static page
  favoritesSection.appendChild(favoritesBtn);
  main.appendChild(favoritesSection);
  frm.appendChild(srch);
  frm.appendChild(btn);
  main.appendChild(frm);
  body.appendChild(main);
  main.appendChild(movieData);
  movieData.appendChild(listSection);
  movieData.appendChild(detailSection);
  listSection.appendChild(movSrch.movieList);
  detailSection.appendChild(movSrch.movieTable);
  favoritesSection.appendChild(addFavoriteBtn);
  favoritesSection.appendChild(movSrch.favoritesList);
}
/**
 * Builds a list of titles using data and attaches click event handler that calls details to each list item
 * @param data
 * @global movSrch.movieList
 */
function buildApiReturnView(data){
  movSrch.movieList.innerHTML = '';
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
    movSrch.movieList.appendChild(movieItem);
  });
}
/**
 * Builds a table of details using data
 * @param data
 * @global movSrch.movieTable
 */
function makeDetails(data){
  movSrch.movieTable.innerHTML = '';
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
  movSrch.movieTable.appendChild(titleRow);
  typeH.innerHTML = 'TYPE: ';
  typeD.innerHTML = data.type;
  typeRow.appendChild(typeH);
  typeRow.appendChild(typeD);
  movSrch.movieTable.appendChild(typeRow);
  yearH.innerHTML = 'YEAR: ';
  yearD.innerHTML = data.year;
  yearRow.appendChild(yearH);
  yearRow.appendChild(yearD);
  movSrch.movieTable.appendChild(yearRow);
  imdbIdH.innerHTML = 'IMDBID: ';
  imdbIdD.innerHTML = data.imdbid;
  imdbIdRow.appendChild(imdbIdH);
  imdbIdRow.appendChild(imdbIdD);
  movSrch.movieTable.appendChild(imdbIdRow);
}
/**
 * Builds a list of titles using data and attaches click event handler that calls details to each list item
 * @param data
 * @global movSrch.favoritesList
 */
function buildFavorites(data){
  movSrch.favoritesList.innerHTML = '';
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
    movSrch.favoritesList.appendChild(movieItem);
  });
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//DOM actions+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/**
 * Add event listeners to static DOM elements
 */
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
/**
 * Performs an ajax get request
 * @param url
 * @param cb callback
 * @param token optional for use when using authentication
 */
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
/**
 * Performs an ajax post request
 * @param url
 * @param jsonData
 * @param cb callback
 * @param token optional for use when using authentication
 */
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
/**
 * Request a movie list from the open movie data base api and storing it in movSrch.data
 * @global movSrch.data array of details objects
 */
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
/**
 * Event handler for adding data from target title to favorites on the server side
 * @param e event object
 * @global movSrch.data array of details objects
 */
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
/**
 * Makes a get request to /favorites and uses the result to populate movSrch.favorites and sends the data to buildFavorites
 * @global movSrch.favorites
 */
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
//Run the application
buildMain();
buildActions();