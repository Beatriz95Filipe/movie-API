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

//create movie card
function createMovieCard(movie) {
  return `<div class="col-lg-4 movie_card">
      <div class="card-body">
        <h5 class="card-title">${movie.name}</h5>
        <p class="card-text">${movie.brandId.name}, ${movie.typeId.name}</p>
        <p class="card-text">$${movie.price}</p>
        <p class="card-text"><small>${movie.description}</small></p>
        <button class="btn btn-danger delete-btn" data-id="${movie._id}">Delete</button>
      </div>
  </div>`;
}

function handleFilterBtnClick() {
  const typeId = document.getElementById("type").value;
  const brandId = document.getElementById("brand").value;

  const queryParams = new URLSearchParams({
    typeId,
    brandId,
  }).toString();

  const url = `http://localhost:1337/api/devices/?${queryParams}`;

  const accessToken = localStorage.getItem("accessToken");
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${accessToken}`);

  fetch(url, { headers })
    .then((response) => response.json())
    .then((data) => {
      const productContainer = document.querySelector(".product-list");
      productContainer.innerHTML = "";

      data.forEach((product) => {
        const productElement = createProductElement(product);
        productContainer.insertAdjacentHTML("beforeend", productElement);
      });
      const deletedBtns = document.querySelectorAll(".delete-btn");

      deletedBtns.forEach((deletedBtn) => {
        deletedBtn.addEventListener("click", handleDeleteProduct);
      });
    })
    .catch((error) => console.error("Error fetching products:", error));
}
function handleDeleteProduct(event) {
  const productId = event.target.dataset.id;
  const accessToken = localStorage.getItem("accessToken");

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${accessToken}`);

  fetch(`http://localhost:1337/api/devices/${productId}`, {
    method: "DELETE",
    headers: headers,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error deleting product");
      }
      return response.json();
    })
    .then(() => {
      event.target.parentElement.parentElement.parentElement.remove();
    })
    .catch((error) => console.error("Error delete product:", error));
}

handleFilterBtnClick();

// Login function
async function login(email, password) {
  try {
    // Clear any previous user information from localStorage
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    const response = await fetch("http://localhost:1337/auth/login", {
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
