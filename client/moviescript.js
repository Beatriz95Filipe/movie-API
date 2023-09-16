const body = document.getElementsByTagName("body");

//LOGIN, REGISTER and LOGOUT
document.addEventListener("DOMContentLoaded", () => {
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
    const crudButtons = document.getElementById("userProfile");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (accessToken) {
      if(isAdmin){
        crudButtons.style.display = "block";
      } else {
        crudButtons.style.display = "none";
      }
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

const movieCardInfo = document.getElementById("movie_card_info");
movieCardInfo.innerHTML = "";

//create clicked moviecard
async function createClickedMovieCard(){
  let movie = await getMovie(clickedMovie);
  console.log(movie);
  const onlyYear = parseInt(movie.releaseDate.slice(0, 4));
  console.log(movie.trailerLink);

  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const showCrudBtns = isAdmin ? "block" : "none";

  movieCardInfo.innerHTML = `
    <div class="movie-img">
      <a href="${movie.trailerLink}" target="_blank">
        <img src="${movie.posterUrl}" alt="movie-poster">
      </a>
    </div>
    <div class="movie-info">
      <h2>${movie.title}</h2>
      <h3>${onlyYear}, ${movie.filmDirector.join(', ')}</h3>
      <h3>${movie.genres.join(', ')}</h3>
      <div class="admin_crud" id="admin_crud" style="display: ${showCrudBtns};">
        <button class="btn edit_btn" data-id="${movie._id}">Edit</button>
        <button class="btn delete_btn" data-id="${movie._id}">Delete</button>
      </div>
    </div>`;
}

createClickedMovieCard();


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


