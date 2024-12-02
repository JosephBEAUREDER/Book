const cardContainer = document.getElementById("card-container");
const addCardBtn = document.getElementById("add-card-btn");
const removeCardBtn = document.getElementById("remove-card-btn");
const loadKeyBtn = document.getElementById("load-key-btn"); // Button to load user-specified key

let jsonData = {}; // Store the entire JSON data
let cardData = []; // Array to store card data for dynamic addition
let removedCards = []; // Array to store removed cards
let cardCount = 0; // Keep track of how many cards have been added

let currentKey = "1"; // Default to section "1"
let currentKeyIndex = 0; // Track the current key index
let keys = []; // Keys of the JSON data


// Function to create a card
function createCard(text) {
  const card = document.createElement("div");
  card.className = "card";
  card.textContent = text;
  cardContainer.appendChild(card);
  cardCount++;
}

// Function to load data for a specific key
function loadCardData(key) {
  if (jsonData[key]) {
    const keyData = jsonData[key];
    console.log(key);
    const content = keyData["Content"];
    cardData = [...content]; // Copy the content into cardData
    resetCards(); // Reset the card display
    if (cardData.length > 0) {
      const text = cardData.shift();
      createCard(text);
    }
    updateInsightTitle(keyData); // Pass the key object to update the display
    // updateInputSection(key); // Pass the key object to update the input field
  } else {
    alert("No more sections to display!");
  }
}



// Fetch JSON and prepare card data
fetch("insights.json")
  .then((response) => response.json())
  .then((data) => {
    jsonData = data; // Store the entire JSON object

    // Get the keys sorted to ensure consistent order
    keys = Object.keys(jsonData).sort((a, b) => parseInt(a) - parseInt(b));
    currentKeyIndex = 0; // Track the current key index

    // Load the first key initially
    if (keys.length > 0) {
      loadCardData(keys[currentKeyIndex]);
    }
  })
  .catch((error) => console.error("Error loading JSON:", error));



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



// Remove the last card when the "-" button is clicked
removeCardBtn.addEventListener("click", () => {
  const cards = cardContainer.getElementsByClassName("card");
  
  if (cards.length > 0) {
    // Remove the last card if there are cards in the container
    const lastCard = cards[cards.length - 1]; // Get the last card
    const text = lastCard.textContent; // Get the text content only

    removedCards.push(text); // Save the removed card's text
    lastCard.remove(); // Remove the last card
    cardCount--; // Decrement the card count

    if (cardCount === 0 && currentKeyIndex > 0) {
      // No cards left, move to the previous key if available
      currentKeyIndex--; // Decrement the current key index
      const previousKey = keys[currentKeyIndex]; // Get the previous key
      loadCardData(previousKey); // Load cards for the previous key
    }
  } else {
    alert("No cards to remove!");
  }
});


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



// const keyInput = document.getElementById("scroll-picker"); // Text input for user to specify key

// Function to update the JSON key display
function updateInsightTitle(keyData) {
  const InsightTitle = document.getElementById("json-key-display");
  const titleAndAuthor = keyData["Title and author"];
  InsightTitle.textContent = titleAndAuthor;
}

// function updateInputSection(key) {
//   const keyInput = document.getElementById("scroll-picker");
//   keyInput.placeholder = key; // Set the placeholder to the Title and Author
// }







///////////// SCROLL-PICKER //////////////

document.addEventListener("DOMContentLoaded", function () {
  const scrollPicker = document.getElementById("scroll-picker");
  const ul = scrollPicker.querySelector("ul");
  let selectedValue = 1; // Default value

  // Clear existing list (if needed)
  ul.innerHTML = "";

  // Generate options dynamically (1 to 20)
  for (let i = 1; i <= 20; i++) {
      const li = document.createElement("li");
      li.textContent = i;
      li.addEventListener("click", function () {
        selectedValue = i; // Update the selected value
        scrollPicker.setAttribute("data-selected", i); // Store the selected value
        console.log("Selected value:", li.textContent); // Log the content of the clicked <li>
        scrollPicker.classList.remove("expanded"); // Collapse the picker
        loadCardData(i);
    });
      ul.appendChild(li);
  }

  // Set default value
  scrollPicker.setAttribute("data-selected", selectedValue);

  // Expand the picker on click
  scrollPicker.addEventListener("click", function (event) {

    if (scrollPicker.classList.contains("expanded")) {
        console.log("Already expanded");
        scrollPicker.classList.remove("expanded"); // Collapse if already expanded
    } else {
        console.log("Expanding picker");
        scrollPicker.classList.add("expanded"); // Expand if not expanded
    }
});

  // Collapse the picker when clicking outside
  document.addEventListener("click", function (event) {
      if (!scrollPicker.contains(event.target)) {
          scrollPicker.classList.remove("expanded");
      }
  });
});

