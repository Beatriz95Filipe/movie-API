# Project Name
Movie-API

## Description

This project is an API to power a website that allows users to discover and watch movie trailers. The website aims to provide a user-friendly interface where users can explore various movie trailers, view movie details, and rate movies.

## SERVER

On the Server side, you have a Model-View-Controller structure where you can find separate folders for controllers, services, models, middleware and routes.

. Authentication & Authorization
To access certain features like rating movies, users need to register and log into the website.
The API as a role-based access control, allowing Admin Users to manage movies and users, by performing CRUD operations.
These validations use middlewares to check whether the user is logged in and/or has the necessary role to perform certain actions. USer authentication uses JSON Web Tokens for middleware validations.

. Users & Roles
UserModel defines an User with the following fields: name, email, password and roles. Users can register or login.
Roles can be assigned to users in order to define what each user can do in the website:
ADMIN can perform CRUD operations.
USER can view and rate movies.

. Movies & Rating
MovieModel defines a Movie with the following fields: title, realease date, trailer link, poster (an image that is stored in a static folder on the server), genres. This info will be assigned to each created movie in order to show movies on the client side.
RatingModel represents a Rating (to a specific movie) given by a logged in User. It is defined by the following fields: movie (reference to the specific movie being rated), user (reference to the user that is rating), rating number on a scale from 1 to 5, comment left by the user.

## ENDPOINTS

MOVIE ROUTER:
* GET api/movies - fetch all movies
* GET api/movies/:id - fetch movie info for a specific movie
* GET api/genres - fetch genres from all movies
* GET api/years - fetch release dates from all movies
* GET api/directors - fetch film directors from all movies
* POST api/movies - ADMIN ONLY - create a movie
* PUT api/movies/:id - ADMIN ONLY - update a specific movie
* DELETE api/movies/:id - ADMIN ONLY - delete a specific movie
* POST api/ratings - AUTHENTICATED USER - rate a movie (movie id is given by clicked movie url params)
* GET api/ratings - fetch all ratings
* GET api/ratings/:movieId - fetch ratings for a specific movie
* DELETE api/ratings/:ratingId - ADMIN ONLY - delete a specific rate

AUTH ROUTER:
* POST auth/roles - ADMIN ONLY - create role
* DELETE auth/roles/:id - ADMIN ONLY - delete a specific role
* POST auth/register - VALIDATIONS - register user
* POST auth/login - VALIDATIONS - login user
(password hashing ans salting for secure storage)
* GET auth/ - AUTHENTICATED USER - get all users
* GET auth/user/:id - AUTHENTICATED USER - get logged in user info

### Technologies in Use

TypeScript,
Express.js,
MongoDB,
JWT,
Bcrypt,
CORS

### Database

In order for you to be able to create your own database more quickly, I created a series of documents in the "database" folder (inside server)with elements for you to create movies, users and roles:
* movieDatabase.txt
* rolesDatabase.txt
* usersDatabase.txt - at the end of this file you will find the passwords defined in each user's registration

## CLIENT

On the Client side you'll notice that not everything was implemented. If you login with an ADMIN user, you'll see certain features to perform CRUD operations but they won't be working because I have not yet created the functions that allow them to communicate with the server side.

HOMEPAGE: users can find movies in two ways: title searching in the searchbar / filter searching with select options; users can access to a specific movie by clicking in the movie title.
MOVIE PAGE: users can click on the poster image to open a new tab with the trailer video; users can view rating score and total number of ratings; only logged in users can post a rate; only ADMIN users can see "edit" and "delete" buttons in order to perform CRUD operations.

