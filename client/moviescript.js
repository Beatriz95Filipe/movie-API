const body = document.getElementsByTagName("body");

const movieUrlParams = new URLSearchParams (window.location.search);
const clickedMovie = movieUrlParams.get("id");
console.log(clickedMovie);

async function getMovie(clickedMovie) {
  try {
    const response = await fetch("http://localhost:5775/api/movies/"+clickedMovie);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const movieInfo = await response.json();
    console.log("movieinfo ", movieInfo);
    return movieInfo;
  } catch (error) {
    console.error("Error fetching movie data:", error);
  }
}

const moviesCard = document.getElementById("movie_card");
moviesCard.innerHTML = "";

//create clicked moviecard
async function createClickedMovieCard(){
  let movie = await getMovie(clickedMovie);
  console.log(movie);
  const onlyYear = parseInt(movie.releaseDate.slice(0, 4));
  console.log(movie.trailerLink);
  moviesCard.innerHTML = `
  <div class="col-lg-4 movie_card_trailer">
    <a class="card-img" href="${movie.trailerLink}">
      <img src="${movie.posterUrl}" alt="movie-poster">
    </a>
  </div>
  <div class="col-lg-8 movie_card_info">
    <h2>${movie.title}</h2>
    <h3>${onlyYear}, ${movie.filmDirector.join(', ')}</h3>
    <h3>${movie.genres.join(', ')}</h3>
  </div>`;
}

createClickedMovieCard();


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

