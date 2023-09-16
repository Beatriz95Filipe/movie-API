const body = document.getElementsByTagName("body");

//get filter options from movies specifics
function populateFiltersOptions() {
  const genreSelect = document.getElementById("genre");
  const yearSelect = document.getElementById("year");
  const directorSelect = document.getElementById("director");

  fetch("http://localhost:5775/api/genres")
    .then((response) => response.json())
    .then((result) => {
      //console.log("Genres:", result);
      genreSelect.innerHTML = '<option value="all">All genres</option>';

      result.forEach((genre) => {
        genreSelect.insertAdjacentHTML(
          "beforeend",
          `<option value="${genre}">${genre}</option>`,
        );
      });
    })
    .catch((error) => console.log("Error genres: ", error));

  fetch("http://localhost:5775/api/years")
    .then((response) => response.json())
    .then((result) => {
      //console.log("Years:", result);
      yearSelect.innerHTML = '<option value="all">All Realease Dates</option>';

      result.forEach((year) => {
        const onlyYear = parseInt(year.slice(0, 4));
        yearSelect.insertAdjacentHTML(
          "beforeend",
          `<option value="${onlyYear}">${onlyYear}</option>`,
        );
      });
    })
    .catch((error) => console.log("Error years: ", error));

  fetch("http://localhost:5775/api/directors")
  .then((response) => response.json())
  .then((result) => {
    //console.log("Directors:", result);
    directorSelect.innerHTML = '<option value="all">All Film Directors</option>';

    result.forEach((director) => {
      directorSelect.insertAdjacentHTML(
        "beforeend",
        `<option value="${director}">${director}</option>`,
      );
    });
  })
  .catch((error) => console.log("Error film directors: ", error));

  handleFilterBtnClick();
}

populateFiltersOptions();

//create moviecard
function createMovieCard(movie){
  const onlyYear = parseInt(movie.releaseDate.slice(0, 4));
  return `
  <div class="col-lg-4 movie_card_thumbnail">
    <div class="card-body">
      <a href="./moviepage.html?id=${movie._id}">
        <p class="card-title">${movie.title}</p>
      </a>
      <p class="card-text">${onlyYear}, ${movie.filmDirector.join(', ')}</p>
      <p class="card-text">${movie.genres.join(', ')}</p>
    </div>
    <div class="card-img">
      <img src="${movie.posterUrl}" alt="movie-poster">
    </div>
    <div class="admin_crud">
      <button class="btn edit_btn" data-id="${movie._id}">Edit</button>
      <button class="btn delete_btn" data-id="${movie._id}">Delete</button>
    </div>
  </div>`;
}

let genres = "";
let year = "";
let director = "";

//event listener to filter btn
const filterBtn = document.getElementById("filterBtn");
filterBtn.addEventListener("click", handleFilterBtnClick);

function handleFilterBtnClick() {
  const genres = document.getElementById("genre").value;
  const year = document.getElementById("year").value;
  const director = document.getElementById("director").value;

  console.log("Genre:", genres);
  console.log("Year:", year);
  console.log("Director:", director);

  const queryParams = new URLSearchParams({
    genres,
    year,
    director
  }).toString();
  console.log("params:", queryParams);

  const url = `http://localhost:5775/api/movies?${queryParams}`;
  console.log(url);

  const moviesContainer = document.getElementById("movies_container");
  moviesContainer.innerHTML = "";

  fetch(url)
  .then((response) => response.json())
  .then((data) => {
    const moviesArray = data.movies.movies;
    console.log(moviesArray);
    if(moviesArray.length == 0) {
      productContainer.innerHTML = "<p style='text-align:center'>No products found... :(</p>"
    };
    moviesArray.forEach((movie) => {
      const movieCard = createMovieCard(movie);
      moviesContainer.innerHTML += movieCard;
    });
  })
  .catch((error) => console.error("Error fetching movies: ", error));

      // const deletedBtns = document.querySelectorAll(".delete-btn");
      // deletedBtns.forEach((deletedBtn) => {
      //     deletedBtn.addEventListener("click", handleDeleteProduct);
      // });
}

//pagination
const pagesSelect = document.getElementById("pages");
pagesSelect.addEventListener("change", handlePageNavigation);

//handle page navigation when select changes
function handlePageNavigation() {
  const selectedPage = parseInt(pagesSelect.value);
  const queryParams = new URLSearchParams({
      page: selectedPage,
      genres,
      year,
      director,
  }).toString();
  const url = `http://localhost:5775/api/movies?${queryParams}`;

  fetch(url)
      .then((response) => response.json())
      .then((data) => {
          const moviesArray = data.movies.movies;
          const moviesContainer = document.getElementById("movies_container");
          moviesContainer.innerHTML = ""; // Clear the existing movie cards
          moviesArray.forEach((movie) => {
              const movieCard = createMovieCard(movie);
              moviesContainer.innerHTML += movieCard;
          });
      })
      .catch((error) => console.error("Error fetching movies: ", error));
}

document.addEventListener("DOMContentLoaded", () => {
  createSearchBar();
});

//search bar
async function createSearchBar() {
  try{
    const response = await fetch("http://localhost:5775/api/movies?fetchAll=true");
    if(!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const movieData = await response.json();
    console.log(movieData);

    const moviesArray = movieData.movies.movies;
    console.log("movies array ", moviesArray);

    let searchMoviesInput = document.getElementById("searchMoviesInput");
    let searchResultsContainer = document.getElementById("searchResults");

    searchMoviesInput.onkeyup = (searchInput) => {
        let searchedMovie = searchInput.target.value.toLowerCase();
        let matchingMovies = moviesArray.filter((movie) => {
          let movieTitleMatch = movie.title.toLowerCase().includes(searchedMovie);
          let movieDirectorMatch = movie.filmDirector.join(', ').toLowerCase().includes(searchedMovie);
          //console.log(movieTitleMatch, movieDirectorMatch);
          return movieTitleMatch || movieDirectorMatch;
        });

        if (searchedMovie === "") {
          searchResultsContainer.innerHTML = "";
        } else {
          displaySearchResults(matchingMovies, searchedMovie);
        }
    }

    const displaySearchResults = (matchingMovies, searchedMovie) => {
      searchResultsContainer.innerHTML = "";

      if (matchingMovies.length === 0 && searchedMovie.length > 0) {
        searchResultsContainer.innerHTML +=
          `<div class="searchResultItem">
            <p>It seems we can't find what you are looking for...</p>
          </div>`;
      } else {
        matchingMovies.forEach((movie) => {
          searchResultsContainer.innerHTML +=
            `<div class="searchResultItem">
              <a class="card-img" href="./moviepage.html?id=${movie._id}">
                <p>${movie.title}</p>
              </a>
            </div>`;
          });
      }
    }
  } catch (error) {
    console.log(error);
  }
}


const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");

//event listener to open modal
loginBtn.onclick = () => {
  loginModal.style.display = "block";
}

const closeModal = document.querySelector(".close");

//event listener to close modal
closeModal.onclick = () => {
  loginModal.style.display = "none";
}

//toggle between login and register
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginButton = document.getElementById("loginBtn");
const registerButton = document.getElementById("registerBtn");
const toggleForms = document.getElementById("toggleForms");

function toggleLogin() {
  if(loginForm.style.display === "block"){
    loginForm.style.display = "none";
    registerForm.style.display = "block";
  } else {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
  }
}

toggleForms.addEventListener("click", function(event) {
  event.preventDefault();
  toggleLogin();
});

//show login first
loginForm.style.display = "block";
registerForm.style.display = "none";


//change movie page title
// function handleMovieTitle() {

// }

// //filter btn
// function handleFilterBtnClick() {
//   const genreId = document.getElementById("genre").value;
//   const yearsId = document.getElementById("year").value;
//   const directorId = document.getElementById("director").value;

//   const queryParams = new URLSearchParams({
//     genreId,
//     yearsId,
//     directorId,
//   }).toString();

//   const url = `http://localhost:5775/api/movies/?${queryParams}`;

//   const accessToken = localStorage.getItem("accessToken");
//   const headers = new Headers();
//   headers.append("Authorization", `Bearer ${accessToken}`);

//   fetch(url, { headers })
//     .then((response) => response.json())
//     .then((data) => {
//       const moviesContainer = document.querySelector(".movies_container");
//       moviesContainer.innerHTML = "";

//       data.forEach((movie) => {
//         const movieElement = createMovieCard(movie);
//         moviesContainer.insertAdjacentHTML("beforeend", movieElement);
//       });
//       const deletedBtns = document.querySelectorAll(".delete-btn");

//       deletedBtns.forEach((deletedBtn) => {
//         deletedBtn.addEventListener("click", handleDeleteMovie);
//       });
//     })
//     .catch((error) => console.error("Error fetching products:", error));
// }

// //delete movie btn
// function handleDeleteMovie(event) {
//   const movieId = event.target.dataset.id;
//   const accessToken = localStorage.getItem("accessToken");

//   const headers = new Headers();
//   headers.append("Authorization", `Bearer ${accessToken}`);

//   fetch(`http://localhost:5775/api/movies/${movieId}`, {
//     method: "DELETE",
//     headers: headers,
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Error deleting movie");
//       }
//       return response.json();
//     })
//     .then(() => {
//       event.target.parentElement.parentElement.parentElement.remove();
//     })
//     .catch((error) => console.error("Error deleting movie:", error));
// }

// handleFilterBtnClick();

// //login & register modal
// var modal = document.getElementById("loginModal");
// var loginBtn = document.getElementById("loginBtn");
// var closeBtn = document.getElementsByClassName("close")[0];

// loginBtn.onclick = () => {
//   modal.style.display = "block";
// }

// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// }


// //event listener to register
// registerButton.onclick = () => {
//   loginForm.style.display = "none";
//   registerForm.style.display = "block";
// }


// // Login function
// async function login(email, password) {
//   try {
//     // Clear any previous user information from localStorage
//     localStorage.removeItem("userName");
//     localStorage.removeItem("userEmail");
//     const response = await fetch("http://localhost:5775/auth/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, password }),
//     });

//     if (!response.ok) {
//       alert("Login failed"); // Show alert for failed login
//       const loginModal = document.getElementById("loginModal");
//       loginModal.hide();
//     } else {
//       const data = await response.json();

//       if (data.accessToken && data.user) {
//         const { accessToken, user } = data;

//         // Store the access token
//         localStorage.setItem("accessToken", accessToken);

//         // Store user information in localStorage
//         localStorage.setItem("userName", user.name);
//         localStorage.setItem("userEmail", user.email);

//         // Update the user profile in the navigation bar
//         handleLoginSuccess();

//         // Hide the login modal
//         const loginModal = document.getElementById("loginModal");
//         loginModal.hide();
//       }
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }
// // Handling the login form submission
// const loginForm = document.getElementById("loginForm"); // Add this ID to your login form
// loginForm.addEventListener("submit", async (event) => {
//   event.preventDefault();

//   const email = document.getElementById("email").value;
//   const password = document.getElementById("password").value;

//   try {
//     await login(email, password);
//     console.log("Logged in successfully");
//   } catch (error) {
//     console.error("Login failed:", error);
//   }
// });

// // After successful login
// function handleLoginSuccess() {
//   const userName = localStorage.getItem("userName");
//   const userEmail = localStorage.getItem("userEmail");

//   const userProfile = document.getElementById("userProfile");
//   userProfile.innerHTML = `${userName} <a href="#" id="logoutLink">Logout</a>`;

//   // Add a click event listener to the logout link
//   const logoutLink = document.getElementById("logoutLink");
//   logoutLink.addEventListener("click", handleLogout);

//   // Hide the login button
//   const loginContainer = document.getElementById("loginContainer");
//   loginContainer.style.display = "none";
// }

// // Logout handler
// function handleLogout() {
//   // Clear user data and update the navigation bar
//   localStorage.removeItem("accessToken");
//   const userProfile = document.getElementById("userProfile");
//   userProfile.innerHTML = ""; // Clear the user profile element

//   const loginContainer = document.getElementById("loginContainer");
//   loginContainer.style.display = "block";
// }

// const filterBtn = document.getElementById("filterBtn");
// filterBtn.addEventListener("click", handleFilterBtnClick);

// function checkLoggedInStatus() {
//   const accessToken = localStorage.getItem("accessToken");
//   const loginContainer = document.getElementById("loginContainer");
//   const userProfile = document.getElementById("userProfile");

//   if (accessToken) {
//     // User is logged in
//     loginContainer.style.display = "none";

//     const userName = localStorage.getItem("userName");
//     const userRole = localStorage.getItem("userRole");
//     userProfile.innerHTML = `${userName} <a href="#" id="logoutLink">Logout</a>`;

//     // Add a click event listener to the logout link
//     const logoutLink = document.getElementById("logoutLink");
//     logoutLink.addEventListener("click", handleLogout);
//   } else {
//     // User is not logged in
//     userProfile.innerHTML = ""; // Clear the user profile element
//     loginContainer.style.display = "block";
//   }
// }

// // Call the function to check the initial status
// checkLoggedInStatus();

