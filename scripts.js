// Got help from Claude in order to create/use the service-worker for caching properly.
// Registering the service worker for caching.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(function (registration) {
        console.log(
          "Service Worker registered successfully:",
          registration.scope,
        );
      })
      .catch(function (error) {
        console.log("Service Worker registration failed:", error);
      });
  });
}

// Sets the userName cookie.
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
  console.log("Cookie string set:", document.cookie);
}

// Gets the userName cookie.
function getCookie(name) {
  console.log("getCookie called for:", name);
  console.log("All cookies:", document.cookie);

  let cookieName = name + "=";
  let cookieArray = document.cookie.split(";");
  console.log("Cookie array:", cookieArray);
  for (let i = 0; i < cookieArray.length; i++) {
    let c = cookieArray[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(cookieName) == 0) {
      let value = c.substring(cookieName.length, c.length);
      console.log("Found cookie value:", value);
      return c.substring(cookieName.length, c.length);
    }
  }
  console.log("Cookie note found, returning null");
  return null;
}

// Checks for userName cookie.
let userName = getCookie("userName");
console.log("Retrieved userName from cookie:", userName);
console.log("All cookies:", document.cookie);

// If statement to look for a userName cookie. If no cookie exists, prompts user for name and checks if it's valid. If cookie exists, welcomes back user.
if (!userName) {
  // Prompt for getting user's name if the userName cookie doesn't exist.
  userName = prompt("Please enter your name:");

  if (userName !== null && userName !== "") {
    const greeting = "Hello, " + userName + "!";
    alert(greeting);
    setCookie("userName", userName, 30);
    console.log("Cookie set. All cookies now:", document.cookie);
  } else {
    alert("You did not enter a valid name.");
  }
} else {
  alert("Welcome back, " + userName + "!");
}

// Function that displays the user's name (if entered in the prompt).
function userNameDisplay(userName) {
  let userNameArea = document.querySelector("#user-name-display");
  if (userName == null || userName == "") {
    let noUserNameMessage = document.createElement("p");
    noUserNameMessage.textContent = "Welcome, unknown user.";
    userNameArea.appendChild(noUserNameMessage);
    return;
  } else {
    let validUserNameMessage = document.createElement("p");
    validUserNameMessage.textContent = `Welcome, ${userName}!`;
    userNameArea.appendChild(validUserNameMessage);
  }
}

// Calls the userNameDisplay function with the user name entered (or not entered) in the initial prompt.
userNameDisplay(userName);

// Cookie consent banner logic.
document.addEventListener("DOMContentLoaded", function () {
  // Checks to see if the user has already given consent (stored in LocalStorage).
  const consentGiven = localStorage.getItem("cookieConsent");
  const banner = document.getElementById("cookie-consent-banner");
  if (!consentGiven) {
    banner.style.display = "block";
  }
  document.getElementById("accept-cookies").addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "true");
    banner.style.display = "none";
  });
  document.getElementById("decline-cookies").addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "false");
    banner.style.display = "none";
  });
});

// Sets initial items in cart to empty.
let itemsInCart = [];
let savedCart = localStorage.getItem("shoppingCart");
if (savedCart) {
  itemsInCart = JSON.parse(savedCart);
}

// Function to display items in cart.
function displayItems(array) {
  let listToAddTo = document.querySelector("#cart");
  listToAddTo.innerHTML = "";
  //   Saving items to local storage.
  localStorage.setItem("shoppingCart", JSON.stringify(array));
  //   Message to display when cart is empty.
  if (array.length === 0) {
    let emptyCartMessage = document.createElement("p");
    emptyCartMessage.textContent = "Your cart is empty.";
    listToAddTo.appendChild(emptyCartMessage);
    totalPriceCalc();
    return;
  }
  //   If cart isn't empty, then this displays the items in the cart.
  else {
    for (let i = 0; i < array.length; i++) {
      let cartItem = document.createElement("li");
      cartItem.textContent = `${array[i].name} - ${array[i].price}`;
      listToAddTo.appendChild(cartItem);
      let closeX = document.createElement("span");
      closeX.textContent = " \u00D7";
      closeX.classList.add("close");
      cartItem.appendChild(closeX);
      // Adding an event listener to each X button that will call the deleteItem function of its index value.
      closeX.addEventListener("click", function () {
        deleteItem(i);
      });
    }
    totalPriceCalc();
  }
}

// Displays initial/saved items in cart.
displayItems(itemsInCart);

// Function to add items to shopping cart.
function addItem(itemName, itemPrice, priceValue) {
  itemsInCart.push({
    name: itemName,
    price: itemPrice,
    priceNum: priceValue,
  });
  displayItems(itemsInCart);
}

// Adding event listeners to each "Add to cart" button, which calls the "addItem" function once clicked.
document.querySelectorAll(".add-to-cart").forEach(function (button) {
  button.addEventListener("click", function () {
    let productBox = button.closest(".product-box");
    let productName = productBox.querySelector("h2").textContent;
    let productPrice = productBox.querySelector("p").textContent;
    // Pulling out the value of the item from the price string in the paragraph element so that I can add prices for the total.
    let priceValue = parseFloat(
      productPrice.replace("$", "").replace(" USD", ""),
    );
    addItem(productName, productPrice, priceValue);
  });
});

// Function to delete selected item from shopping cart once its "x" button is clicked.
function deleteItem(i) {
  itemsInCart.splice(i, 1);
  displayItems(itemsInCart);
}

// Function to clear all items from cart.
function clearCart() {
  itemsInCart = [];
  displayItems(itemsInCart);
}

// Adding event listener to "Clear cart" button, which calls the "clearCart" function once clicked.
document.querySelector("#clear-cart").addEventListener("click", clearCart);

// Function to display the total price of items in the cart.
function totalPriceCalc() {
  let total = 0;
  for (let i = 0; i < itemsInCart.length; i++) {
    total += itemsInCart[i].priceNum;
  }
  let totalPrice = document.getElementById("total-price");
  totalPrice.textContent = `Total price: $${total.toFixed(2)} USD`;
}

// Sets font style of page based on user's selection in dropdown menu.
document.getElementById("font-select").addEventListener("change", function () {
  let fontSelection = this.value;
  document.body.style.fontFamily = fontSelection;
  sessionStorage.setItem("preferredFont", fontSelection);
});

// Loads the page with the selected font.
window.addEventListener("load", function () {
  let savedFont = sessionStorage.getItem("preferredFont");
  if (savedFont) {
    document.body.style.fontFamily = savedFont;
    document.getElementById("font-select").value = savedFont;
  }
});

// Function to delete a cookie.
function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// Function to reset all user preferences.
function resetPreferences() {
  localStorage.clear();
  sessionStorage.clear();
  deleteCookie("userName");
  itemsInCart = [];
  displayItems(itemsInCart);
  alert("All preferences have been reset.");
  location.reload();
}

// Event listener for preference reset button.
document
  .getElementById("clear-preferences")
  .addEventListener("click", resetPreferences);
