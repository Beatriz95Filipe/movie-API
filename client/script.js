import MovieController from "../controllers/MovieController.js";

//get filter options from movies specifics
function populateFiltersOptions() {
  const genreSelect = document.getElementById("genre");
  const yearSelect = document.getElementById("year");
  const directorSelect = document.getElementById("director");

  fetch("http://localhost:5775/api/genres")
    .then((response) => response.json())
    .then((result) => {
      genreSelect.innerHTML = '<option value="all">All genres</option>';

      result.forEach((genre) => {
        typeSelect.insertAdjacentHTML(
          "beforeend",
          `<option value="${genre._id}">${genre.name}</option>`,
        );
      });
    })
    .catch((error) => console.log("Error genres: ", error));

  fetch("http://localhost:5775/api/years")
    .then((response) => response.json())
    .then((result) => {
      yearSelect.innerHTML = '<option value="all">All Realease Dates</option>';

      result.forEach((year) => {
        yearSelect.insertAdjacentHTML(
          "beforeend",
          `<option value="${year._id}">${year.name}</option>`,
        );
      });
    })
    .catch((error) => console.log("Error years: ", error));

    fetch("http://localhost:5775/api/directors")
    .then((response) => response.json())
    .then((result) => {
      directorSelect.innerHTML = '<option value="all">All Film Directors</option>';

      result.forEach((director) => {
        directorSelect.insertAdjacentHTML(
          "beforeend",
          `<option value="${director._id}">${director.name}</option>`,
        );
      });
    })
    .catch((error) => console.log("Error film directors: ", error));
}

populateFiltersOptions();


//search bar
const createSearchBar = async () => {
  let movies = await fetch("http://localhost:5775/api/movies");
  console.log(movies);

  let movieTitle = movies.map((movie) => movie.title.toLowerCase());
  let movieDirector = movies.map((movie) => movie.filmDirector.toLowerCase());

  let searchMoviesInput = document.getElementById("searchMoviesInput");
  let searchResultsContainer = document.getElementById("searchResults");

  searchMoviesInput.onkeyup = (searchInput) => {
      let searchedMovie = searchInput.target.value.toLowerCase();
      let matchingMovies = [];

      for (let i = 0; i < movies.length; i++) {
          if (movieTitle[i].includes(searchedMovie) || movieDirector[i].includes(searchedMovie)) {
            matchingMovies.push(movies[i]);
          }
      }
      displaySearchResults(matchingMovies, searchedMovie);
  }
}

const displaySearchResults = (matchingMovies, searchedMovie) => {
  let searchMoviesInput = document.getElementById("searchMoviesInput");

  let searchResultsContainer = document.getElementById("searchResults");
  searchResultsContainer.innerHTML = "";

  if (matchingMovies.length === 0) {
    searchResultsContainer.innerHTML +=
      `<div class="searchResultItem">
        <p>It seems we can't find what you are looking for...</p>
      </div>`;
  } else if (searchedMovie.length === 0) {
    searchResultsContainer.innerHTML +=
      `<div class="searchResultItem"></div>`;
  } else {
    matchingMovies.forEach((movie) => {
      searchResultsContainer.innerHTML +=
          `<div class="searchResultItem">
              <p>${movie.title}</p>
              <img src="${movie.posterUrl}">
          </div>`;
      });
  }
}

createSearchBar();

//create movie card
function createMovieCard(movie) {
  return `<div class="col-lg-4 movie_card">
      <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
        <p class="card-text">${movie.releaseDate}, ${movie.filmDirector}</p>
        <p class="card-text">${movie.genres}</p>
        <a class="card-img" href="${movie.trailerLink}">
            <img src="${movie.posterUrl}" alt="movie-poster">
        </a>
        <button class="btn delete-btn" data-id="${movie._id}">Delete</button>
      </div>
  </div>`;
}

//filter btn
function handleFilterBtnClick() {
  const genreId = document.getElementById("genre").value;
  const yearsId = document.getElementById("year").value;
  const directorId = document.getElementById("director").value;

  const queryParams = new URLSearchParams({
    genreId,
    yearsId,
    directorId,
  }).toString();

  const url = `http://localhost:5775/api/movies/?${queryParams}`;

  const accessToken = localStorage.getItem("accessToken");
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${accessToken}`);

  fetch(url, { headers })
    .then((response) => response.json())
    .then((data) => {
      const moviesContainer = document.querySelector(".movies_container");
      moviesContainer.innerHTML = "";

      data.forEach((movie) => {
        const movieElement = createMovieCard(movie);
        moviesContainer.insertAdjacentHTML("beforeend", movieElement);
      });
      const deletedBtns = document.querySelectorAll(".delete-btn");

      deletedBtns.forEach((deletedBtn) => {
        deletedBtn.addEventListener("click", handleDeleteMovie);
      });
    })
    .catch((error) => console.error("Error fetching products:", error));
}

//delete movie btn
function handleDeleteMovie(event) {
  const movieId = event.target.dataset.id;
  const accessToken = localStorage.getItem("accessToken");

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${accessToken}`);

  fetch(`http://localhost:5775/api/movies/${movieId}`, {
    method: "DELETE",
    headers: headers,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error deleting movie");
      }
      return response.json();
    })
    .then(() => {
      event.target.parentElement.parentElement.parentElement.remove();
    })
    .catch((error) => console.error("Error deleting movie:", error));
}

handleFilterBtnClick();

// Login function
async function login(email, password) {
  try {
    // Clear any previous user information from localStorage
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    const response = await fetch("http://localhost:5775/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      alert("Login failed"); // Show alert for failed login
      const loginModal = document.getElementById("loginModal");
      var modal = bootstrap.Modal.getInstance(loginModal);
      modal.hide();
    } else {
      const data = await response.json();

      if (data.accessToken && data.user) {
        const { accessToken, user } = data;

        // Store the access token
        localStorage.setItem("accessToken", accessToken);

        // Store user information in localStorage
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userEmail", user.email);

        // Update the user profile in the navigation bar
        handleLoginSuccess();
        // Hide the login modal

        const loginModal = document.getElementById("loginModal");
        var modal = bootstrap.Modal.getInstance(loginModal);
        modal.hide();
      }
    }
  } catch (error) {
    console.error(error);
  }
}
// Handling the login form submission
const loginForm = document.getElementById("loginForm"); // Add this ID to your login form
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await login(email, password);
    console.log("Logged in successfully");
  } catch (error) {
    console.error("Login failed:", error);
  }
});

// After successful login
function handleLoginSuccess() {
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");

  const userProfile = document.getElementById("userProfile");
  userProfile.innerHTML = `${userName} <a href="#" id="logoutLink">Logout</a>`;

  // Add a click event listener to the logout link
  const logoutLink = document.getElementById("logoutLink");
  logoutLink.addEventListener("click", handleLogout);

  // Hide the login button
  const loginContainer = document.getElementById("loginContainer");
  loginContainer.style.display = "none";
}

// Logout handler
function handleLogout() {
  // Clear user data and update the navigation bar
  localStorage.removeItem("accessToken");
  const userProfile = document.getElementById("userProfile");
  userProfile.innerHTML = ""; // Clear the user profile element

  const loginContainer = document.getElementById("loginContainer");
  loginContainer.style.display = "block";
}

const filterBtn = document.getElementById("filterBtn");
filterBtn.addEventListener("click", handleFilterBtnClick);

function checkLoggedInStatus() {
  const accessToken = localStorage.getItem("accessToken");
  const loginContainer = document.getElementById("loginContainer");
  const userProfile = document.getElementById("userProfile");

  if (accessToken) {
    // User is logged in
    loginContainer.style.display = "none";

    const userName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("userRole");
    userProfile.innerHTML = `${userName} <a href="#" id="logoutLink">Logout</a>`;

    // Add a click event listener to the logout link
    const logoutLink = document.getElementById("logoutLink");
    logoutLink.addEventListener("click", handleLogout);
  } else {
    // User is not logged in
    userProfile.innerHTML = ""; // Clear the user profile element
    loginContainer.style.display = "block";
  }
}

// Call the function to check the initial status
checkLoggedInStatus();
