const body = document.getElementsByTagName("body");

//LOGIN, REGISTER and LOGOUT
document.addEventListener("DOMContentLoaded", () => {
  createSearchBar();

  const userProfile = document.getElementById("userProfile");
  const loginBtn = document.getElementById("loginBtn");
  const loginModal = document.getElementById("loginModal");
  const closeBtn = document.querySelector(".close");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const toggleForms = document.getElementById("toggleForms");
  const registerAccount = document.getElementById("register");

  let isLoggedIn = false;

  //show login modal
  const showLoginModal = () => {
    loginModal.style.display = "block";
  };
  loginBtn.addEventListener("click", showLoginModal);

  //close login modal
  const closeLoginModal = () => {
    loginModal.style.display = "none";
  };
  closeBtn.addEventListener("click", closeLoginModal);

  //toggle between login and register
  toggleForms.addEventListener("click", (event) => {
    event.preventDefault();
    loginForm.style.display = isLoggedIn ? "block" : "none";
    registerForm.style.display = isLoggedIn ? "none" : "block";
    registerAccount.style.display = isLoggedIn ? "block" : "none";
    isLoggedIn = !isLoggedIn;
  });

  //register
  const registerUser = async () => {
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPass").value;

    try {
      const response = await fetch("http://localhost:5775/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      closeLoginModal();
      alert(`Hi ${name}, welcome to our community!`);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    registerUser();
  });

  //login
  const loginUser = async () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPass").value;

    try {
      const response = await fetch("http://localhost:5775/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      //console.log("data ", data);
      localStorage.setItem("accessToken", data.accessToken);

      // Check if user is ADMIN
      const isAdmin = data.user.roles.includes("64f8e7589f2a3c538298b6f4");
      localStorage.setItem("isAdmin", isAdmin);
      console.log(isAdmin);

      const userName = data.user.name;
      userProfile.innerHTML = `
      <span>${userName}</span>
      <button type="submit" class="logout_btn" id="logoutBtn">Logout</button>`;

      console.log("userName ", userName);
      isLoggedIn = true;
      closeLoginModal();
      checkLoggedInStatus();
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("login click");
    loginUser();
  });

  // Function to check if the user is logged in
  const checkLoggedInStatus = () => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      userProfile.style.display = "block";
      loginBtn.style.display = "none";
    } else {
      userProfile.style.display = "none";
      loginBtn.style.display = "block";
    }
  };

  //logout
  const logoutUser = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("isAdmin");
    isLoggedIn = false;
    checkLoggedInStatus();
    console.log("logout");
  };
  document.body.addEventListener("click", (event) => {
    if (event.target && event.target.matches(".logout_btn")) {
      event.preventDefault();
      logoutUser();
      location.reload();
    }
  });

  //check initial login status
  checkLoggedInStatus();
});

//MOVIES

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
      <a href="./moviepage.html?id=${movie._id}" target="_blank">
        <p class="card-title">${movie.title}</p>
      </a>
      <p class="card-text">${onlyYear}, ${movie.filmDirector.join(', ')}</p>
      <p class="card-text">${movie.genres.join(', ')}</p>
    </div>
    <div class="card-img">
      <img src="${movie.posterUrl}" alt="movie-poster">
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