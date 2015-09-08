##Movie List Demonstration Application
This application uses node express backend and a vanilla JavaScript front end to allow users to search for movies using the [OMDBapi](http://www.omdbapi.com/). They are presented with an input box to enter a search string and after pressing enter or the search button they are presented a list of movie titles matching the criteria. The movie titles are clickable and when clicked will return the details of the chosen title in a table. The user can also add a movie to favorites when its details are displayed by clicking the 'Add To Favorites' button. The user's favorites are persisted on the backend via a json file. By clicking the 'View Favorites' button, the user can display a list of their favorite titles and vies the details by clicking on the title. This is a single user application in that it does not manage more than one favorite list. Regarding the favorites list, once an item is added, it can not be removed. These deficiencies are not an over site, but are part of the design specification or or user story.
####See the application live
[ga-movie-list](https://ga-movie-list.herokuapp.com/)

    
###Three branches are included in this repo
####master - code chosen to be permanent through out
####js-only - this is a vanilla JavaScript implementation of the application and currently the only one deployed to heroku
####angular - as the title suggest this is an angular implementation of the application