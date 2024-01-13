function isLoggedIn() {
  console.log(sessionStorage.getItem("token"));
  return sessionStorage.getItem("token") !== null;
}

function login() {
  console.log("login");
  window.location.href = "/auth/login.html";
}
function register() {
  console.log("register");
  window.location.href = "/auth/register.html";
}

function logout() {
  console.log("logout");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("friends");
  sessionStorage.removeItem("games");
  window.location.href = "/";
  authContainer();
}

function authContainer() {
  const authDiv = document.getElementById("auth");
  if (!authDiv) {
    return;
  }

  // Clear the auth container
  authDiv.innerHTML = "";

  // Create the row
  let rowDiv = document.createElement("div");
  rowDiv.classList.add("row", "justify-content-center", "g-2"); // g-2 for gap

  // Function to create a column and append a button
  function createButtonColumn(button) {
    let colDiv = document.createElement("div");
    colDiv.classList.add("col-auto"); // Use col-auto for automatic sizing based on the content
    colDiv.appendChild(button);
    rowDiv.appendChild(colDiv);
  }

  let btnLogin = document.createElement("button");
  btnLogin.setAttribute("id", "login");
  btnLogin.classList.add("btn", "btn-primary");
  btnLogin.textContent = "Login";
  btnLogin.onclick = login;

  let btnRegister = document.createElement("button");
  btnRegister.setAttribute("id", "register");
  btnRegister.classList.add("btn", "btn-primary");
  btnRegister.textContent = "Register";
  btnRegister.onclick = register;

  let btnLogout = document.createElement("button");
  btnLogout.setAttribute("id", "logout");
  btnLogout.classList.add("btn", "btn-danger");
  btnLogout.textContent = "Logout";
  btnLogout.onclick = logout;

  if (isLoggedIn()) {
    authDiv.appendChild(
        document.createTextNode("Logged in as: " + JSON.parse(sessionStorage.getItem("token")).name + " ")
    );
    createButtonColumn(btnLogout);
  } else {
    createButtonColumn(btnLogin);
    createButtonColumn(btnRegister);
  }

  // Append the row to the auth container
  authDiv.appendChild(rowDiv);
}


function hasToBeLoggedIn() {
  if (!isLoggedIn()) {
    window.location.href = "/auth/login.html";
  }
}

window.onload = function () {
  authContainer();
};
