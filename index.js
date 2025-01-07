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
  const container = document.querySelector(".main-container"); // The main container

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

let visibleKey = null; // Declare visibleKey at a higher scope

// Function to get and update the key of the visible big card
function getVisibleCardKey() {
  const bigCards = document.querySelectorAll(".big-card");

  // Create an IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const visibleCardTitle = entry.target.querySelector("h3").textContent;
          visibleKey = visibleCardTitle.split(".")[0]; // Update the global visibleKey
          console.log("Visible Card Key: ", visibleKey); // Log for debugging
        }
      });
    },
    {
      root: document.querySelector(".main-container"), // Scrollable container
      threshold: 0.5, // Trigger when 50% of the card is visible
    }
  );

  // Observe each big card
  bigCards.forEach((card) => observer.observe(card));
}

// Call this function once to start observing
getVisibleCardKey();

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
    getVisibleCardKey();
  })
  .catch((error) => console.error("Error loading JSON:", error));



// Add a card dynamically when the "+" button is clicked
addCardBtn.addEventListener("click", () => {
  if (!visibleKey) {
    console.error("No visible card found");
    return;
  }

  // Get the content for the key
  const cardData = jsonData[visibleKey];
  const contentItems = cardData["Content"];

  // Get the corresponding big card
  const bigCard = document.querySelector(`.big-card:nth-child(${visibleKey})`);
  const cardContainer = bigCard.querySelector(".card-container");

  // Determine the number of existing small cards
  const existingCards = cardContainer.querySelectorAll(".small-card").length;

  // Add the next small card if available
  if (existingCards < contentItems.length) {
    const nextContent = contentItems[existingCards]; // Get the next content item

    // Create a small card
    const smallCard = document.createElement("div");
    smallCard.classList.add("small-card");
    smallCard.textContent = nextContent;

    // Set the stacking order based on the index
    smallCard.style.setProperty("--index", existingCards);

    // Append the small card to the card container
    cardContainer.appendChild(smallCard);
  } else {
    console.log("No more content to add for this key.");
  }
});



removeCardBtn.addEventListener("click", () => {
  if (!visibleKey) {
    console.error("No visible card found");
    return;
  }

  // Get the corresponding big card
  const bigCard = document.querySelector(`.big-card:nth-child(${visibleKey})`);
  if (!bigCard) {
    console.error("No big card found for the visible key:", visibleKey);
    return;
  }

  const cardContainer = bigCard.querySelector(".card-container");

  // Get all existing small cards in the container
  const existingCards = cardContainer.querySelectorAll(".small-card");

  // Remove the last small card if available
  if (existingCards.length > 1) {
    const lastCard = existingCards[existingCards.length - 1]; // Get the last small card
    cardContainer.removeChild(lastCard); // Remove the last card
  } else {
    console.log("No small cards to remove for this key.");
  }
});






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

