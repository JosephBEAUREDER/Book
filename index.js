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
fetch("insights.json")
  .then((response) => response.json())
  .then((data) => {
    jsonData = data; // Store the entire JSON object

    // Get the keys sorted to ensure consistent order
    const keys = Object.keys(jsonData).sort((a, b) => parseInt(a) - parseInt(b));
    let currentKeyIndex = 0; // Track the current key index
    let cardData = []; // Holds content for the current key

    // Function to load data for a specific key
    function loadCardData(key) {
      if (jsonData[key]) {
        const content = jsonData[key]["Content"];
        cardData = [...content]; // Copy the content into cardData
        resetCards(); // Reset the card display
        if (cardData.length > 0) {
          const text = cardData.shift();
          createCard(text);
        }
        updateJsonKeyDisplay(key); // Update the display (e.g., UI element showing current key)
      } else {
        alert("No more sections to display!");
      }
    }

    // Function to reset all cards
    function resetCards() {
      while (cardContainer.firstChild) {
        cardContainer.removeChild(cardContainer.firstChild);
      }
      cardCount = 0;
      removedCards = [];
    }

    // Add a card dynamically when the "+" button is clicked
    addCardBtn.addEventListener("click", () => {
      if (removedCards.length > 0) {
        // Reuse a removed card if available
        const text = removedCards.pop();
        createCard(text);
      } else if (cardData.length > 0) {
        // Otherwise, use the next card from the remaining data
        const text = cardData.shift();
        createCard(text);
      } else {
        // Move to the next key when no more cards in the current key
        currentKeyIndex++;
        if (currentKeyIndex < keys.length) {
          const nextKey = keys[currentKeyIndex];
          loadCardData(nextKey);
        } else {
          alert("No more cards to display!");
          resetCards(); // Ensure cards are cleared when everything is done
        }
      }
    });

    // Load the first key initially
    if (keys.length > 0) {
      loadCardData(keys[currentKeyIndex]);
    }
  })
  .catch((error) => console.error("Error loading JSON:", error));

// Remove the last card when the "-" button is clicked
removeCardBtn.addEventListener("click", () => {
  const cards = cardContainer.getElementsByClassName("card");
  
  if (cards.length > 0) {
    // Remove the last card if there are cards in the container
    const lastCard = cards[cards.length - 1]; // Get the last card
    const text = lastCard.querySelector(".card-text").textContent; // Get the text content only

    removedCards.push(text); // Save the removed card's text
    lastCard.remove(); // Remove the last card
    cardCount--; // Decrement the card count
  } else {
    // No cards left, go to the previous section if possible
    if (currentKeyIndex > 0) {
      currentKeyIndex--; // Decrement the current key index
      const previousKey = keys[currentKeyIndex]; // Get the previous key
      resetCards(); // Clear current cards
      loadCardData(previousKey); // Load cards for the previous key

      // Add all cards from the previous section
      cardData.forEach((text) => {
        createCard(text);
      });
    } else {
      alert("No cards to remove!");
    }
  }
});

// Load card data for a specific key using a for loop
function loadCardData(key) {
  if (jsonData[key]) {
    cardData = [];
    const content = jsonData[key]["Content"]; // Extract the content array
    for (let text of content) {
      cardData.push(text); // Add only the text to cardData
    }
    updateJsonKeyDisplay(key); // Update the display
  } else {
    alert("No more sections to display!");
  }
}

// Reset all cards
function resetCards() {
  while (cardContainer.firstChild) {
    cardContainer.removeChild(cardContainer.firstChild);
  }
  cardCount = 0;
  removedCards = [];
}

// Load the first key initially
if (keys.length > 0) {
  loadCardData(keys[currentKeyIndex]);
}



// Function to create and add a card to the container
function createCard(text) {
  const newCard = document.createElement("div");
  newCard.className = "card";
  newCard.style.zIndex = cardCount; // Ensure stacking order
  newCard.style.top = `${cardCount * 20}px`; // Adjust position for bigger overlap
  newCard.innerHTML = `
    <div class="card-body">
      <p class="card-text">${text}</p>
    </div>
  `;

  cardContainer.appendChild(newCard); // Add the card to the container
  cardCount++; // Increment card count for stacking
}

// Function to reset all cards
function resetCards() {
  // Remove all cards from the container
  while (cardContainer.firstChild) {
    cardContainer.removeChild(cardContainer.firstChild);
  }
  // Reset card count but DO NOT clear removedCards globally
  cardCount = 0;
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


