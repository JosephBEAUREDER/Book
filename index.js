const cardContainer = document.getElementById("card-container");
const addCardBtn = document.getElementById("add-card-btn");
const removeCardBtn = document.getElementById("remove-card-btn");
const loadKeyBtn = document.getElementById("load-key-btn"); // Button to load user-specified key

let jsonData = {}; // Store the entire JSON data
let cardData = []; // Array to store card data for dynamic addition
let removedCards = []; // Array to store removed cards
let cardCount = 0; // Keep track of how many cards have been added

let currentKey = "1"; // Default to section "1"

// Function to update the JSON key display
function updateJsonKeyDisplay(key) {
    const jsonKeyDisplay = document.getElementById("json-key-display");
    jsonKeyDisplay.textContent = `Item: ${key}`;
  const keyInput = document.getElementById("key-input");
  keyInput.placeholder = `${key}`; // Set the placeholder to the new key value
}

// Update the display when the page loads
updateJsonKeyDisplay(currentKey);

// Fetch JSON and prepare card data
fetch("test.json")
  .then((response) => response.json())
  .then((data) => {
    jsonData = data; // Store the entire JSON object
    loadCardData(currentKey); // Load the first key's data
    // Automatically add the first card of the first section
    if (cardData.length > 0) {
      const [title, text] = cardData.shift();
      createCard(title, text);
    }
  })
  .catch((error) => console.error("Error loading JSON:", error));

// Load card data for a specific key using a for loop
function loadCardData(key) {
  if (jsonData[key]) {
    cardData = [];
    for (let [title, text] of Object.entries(jsonData[key])) {
      cardData.push([title, text]);
    }
    updateJsonKeyDisplay(key); // Update the display
  } else {
    alert("No more sections to display!");
  }
}

// Add a card dynamically when the "+" button is clicked
addCardBtn.addEventListener("click", () => {
  if (removedCards.length > 0) {
    // Reuse a removed card if available
    const [title, text] = removedCards.pop();
    createCard(title, text);
  } else if (cardData.length > 0) {
    // Otherwise, use the next card from the remaining data
    const [title, text] = cardData.shift();
    createCard(title, text);
  } else {
    // Move to the next key when no more cards in the current key
    const nextKey = (parseInt(currentKey) + 1).toString(); // Calculate next key as a string
    if (jsonData[nextKey]) {
      currentKey = nextKey;
      loadCardData(currentKey);
      resetCards(); // Reset cards when moving to the next section
      // Automatically add the first card of the new section
      if (cardData.length > 0) {
        const [title, text] = cardData.shift();
        createCard(title, text);
      }
    } else {
      alert("No more cards to display!");
    }
  }
});

// Remove the last card when the "-" button is clicked
removeCardBtn.addEventListener("click", () => {
  const cards = cardContainer.getElementsByClassName("card");
  if (cards.length > 0) {
    const lastCard = cards[cards.length - 1]; // Get the last card
    const title = lastCard.querySelector(".card-title").textContent;
    const text = lastCard.querySelector(".card-text").textContent;

    removedCards.push([title, text]); // Save the removed card's data
    lastCard.remove(); // Remove the last card
    cardCount--; // Decrement the card count
  } else {
    // If no cards left, go back to the previous section if possible
    const previousKey = (parseInt(currentKey) - 1).toString();
    if (previousKey >= "1" && jsonData[previousKey]) {
      currentKey = previousKey;
      loadCardData(currentKey);
      resetCards(); // Reset cards when moving to the previous section
      // Automatically add all cards from the previous section
      for (let [title, text] of cardData) {
        createCard(title, text);
      }
    } else {
      alert("No cards to remove!");
    }
  }
});

// Function to create and add a card to the container
function createCard(title, text) {
  const newCard = document.createElement("div");
  newCard.className = "card";
  newCard.style.zIndex = cardCount; // Ensure stacking order
  newCard.style.top = `${cardCount * 20}px`; // Adjust position for bigger overlap
  newCard.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${title}</h5>
      <p class="card-text">${text}</p>
    </div>
  `;

  cardContainer.appendChild(newCard); // Add the card to the container
  cardCount++; // Increment card count for stacking
}

// Function to reset all cards
function resetCards() {
  cardContainer.innerHTML = "";
  cardCount = 0;
  removedCards = [];
}


const keyInput = document.getElementById("key-input"); // Text input for user to specify key

// Load a user-specified key when the Enter key is pressed
keyInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") { // Check if the pressed key is "Enter"
    const userKey = keyInput.value.trim();
    if (jsonData[userKey]) {
      currentKey = userKey;
      loadCardData(currentKey);
      resetCards(); // Reset cards before loading the new key
      // Automatically add the first card of the specified section
      if (cardData.length > 0) {
        const [title, text] = cardData.shift();
        createCard(title, text);
      }
    } else {
      alert("Invalid key! Please enter a valid key.");
    }
  }
});




//////////////// SWIPE GESTURE ////////////////

let touchStartX = 0; // Store the starting X position of the touch/mouse
let touchEndX = 0; // Store the ending X position of the touch/mouse

// Touch Events
document.body.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].screenX; // Get the X coordinate when the touch starts
});

document.body.addEventListener('touchend', (event) => {
  touchEndX = event.changedTouches[0].screenX; // Get the X coordinate when the touch ends
  handleSwipeGesture(); // Handle the swipe action based on the coordinates
});

// Mouse Events for Swipe Simulation
document.body.addEventListener('mousedown', (event) => {
  touchStartX = event.screenX; // Get the X coordinate when mouse click starts
});

document.body.addEventListener('mouseup', (event) => {
  touchEndX = event.screenX; // Get the X coordinate when mouse click ends
  handleSwipeGesture(); // Handle the swipe action based on the coordinates
});

// Function to determine swipe direction and take action
function handleSwipeGesture() {
  const swipeThreshold = 50; // Minimum distance to be considered a swipe

  if (touchEndX < touchStartX - swipeThreshold) {
    // Swipe Left Detected
    console.log('Swiped Left');
    // Add your action here for swipe left (e.g., navigate to the previous card)
  }

  if (touchEndX > touchStartX + swipeThreshold) {
    // Swipe Right Detected
    console.log('Swiped Right');
    // Add your action here for swipe right (e.g., navigate to the next card)
  }
}
