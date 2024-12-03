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





// Function to dynamically load big cards into the container
function loadBigCards(jsonData) {
  const container = document.querySelector(".container.mt-5"); // The main container

  // Clear the container before adding new big cards
  container.innerHTML = "";

  // Loop through each key in the JSON
  Object.keys(jsonData).forEach((key) => {
      const cardData = jsonData[key];

      // Create a new big card div
      const bigCard = document.createElement("div");
      bigCard.classList.add("big-card");

      // Add the key as the card title
      const title = document.createElement("h3");
      title.textContent = `${key}. ${cardData["Title and author"]}`;
      title.classList.add("mb-3");

      // Create a container for the content (for now, only the first item)
      const contentContainer = document.createElement("div");
      contentContainer.classList.add("card-container");

    // Create the first small card for the first item in the content
    if (cardData["Content"] && cardData["Content"].length > 0) {
      const firstItem = cardData["Content"][0]; // Get the first content item

      // Create a small card
      const smallCard = document.createElement("div");
      smallCard.classList.add("small-card"); // Add a class for styling
      smallCard.textContent = firstItem; // Add the content text

      // Append the small card to the content container
      contentContainer.appendChild(smallCard);
    } else {
      // Fallback if no content is available
      const noContent = document.createElement("p");
      noContent.textContent = "No content available";
      contentContainer.appendChild(noContent);
    }

      // Append the title and content container to the big card
      bigCard.appendChild(title);
      bigCard.appendChild(contentContainer);

      // Append the big card to the main container
      container.appendChild(bigCard);
  });
}

function logVisibleCardKey() {
  const bigCards = document.querySelectorAll(".big-card");

  // Create an IntersectionObserver
  const observer = new IntersectionObserver(
      (entries) => {
          entries.forEach((entry) => {
              if (entry.isIntersecting) {
                  // Log the key when a big card is visible
                  const visibleCardTitle = entry.target.querySelector("h3").textContent;
                  const key = visibleCardTitle.split(".")[0]; // Extract the key from the title
                  console.log(`Visible Card Key: ${key}`);
              }
          });
      },
      {
          root: document.querySelector(".container.mt-5"), // Scrollable container
          threshold: 0.5, // Trigger when 50% of the card is visible
      }
  );

  // Observe each big card
  bigCards.forEach((card) => observer.observe(card));
}

// Fetch JSON dynamically and prepare card data
fetch("config.json")
  .then((response) => response.json())
  .then((config) => {
    const latestFile = config.latest_file; // Get the latest JSON file path
    return fetch(latestFile); // Fetch the actual insights file
  })
  .then((response) => response.json())
  .then((data) => {
    jsonData = data; // Store the entire JSON object

    // Dynamically load big cards into the container
    loadBigCards(jsonData);

    // Attach the observer to log the visible card key
    logVisibleCardKey();
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

