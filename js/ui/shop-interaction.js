// Shop interaction functions

// Check of de winkel open is (9:00-18:00)
function isShopOpen() {
  return gameState.hour >= 9 && gameState.hour < 18;
}

// Interact with shop (open shop modal)
function interactWithShop() {
  const shopX = gameState.shopPosition.x;
  const shopY = gameState.shopPosition.y;
  const playerX = gameState.playerPosition.x;
  const playerY = gameState.playerPosition.y;
  if (!(playerX === shopX && playerY === shopY)) {
    showMessage("Je moet precies op de winkel staan om naar binnen te gaan! �", "error");
    return;
  }

  // Check of de winkel open is
  if (!isShopOpen()) {
    const currentTime = `${gameState.hour.toString().padStart(2, "0")}:${gameState.minute.toString().padStart(2, "0")}`;
    showMessage(`De winkel is nog gesloten! 🏪 Openingstijden: 9:00-18:00 (Nu: ${currentTime})`, "error");
    return;
  }

  openShopModal();
}

// Open shop modal/dialog
function openShopModal() {
  // Create modal overlay
  const modal = document.createElement("div");
  modal.className = "shop-modal";
  modal.innerHTML = `
    <div class="shop-modal-content">
      <div class="shop-modal-header">
        <div>
          <h2>🏪 Welkom in de Winkel!</h2>
          <div style="font-size: 0.8em; opacity: 0.8; margin-top: 5px;">
            ✖️ Klik X | ESC toets | Klik buiten winkel om te sluiten
          </div>
        </div>
        <button class="close-button" onclick="closeShopModal()">✖️</button>
      </div>
      <div class="shop-modal-body">
        <div class="shop-grid" id="shopModalGrid">
          <!-- Shop items will be generated here -->
        </div>
        <div class="player-money">
          💰 Je geld: €<span id="modalMoney">${gameState.money}</span>
        </div>
        <div class="shop-footer">
          <button class="button close-shop-button" onclick="closeShopModal()">
            🚪 Winkel Verlaten
          </button>
          <div class="shop-instructions">
            Druk ESC of klik buiten de winkel om te sluiten
          </div>
        </div>
      </div>
    </div>
  `;

  // Close modal when clicking outside
  modal.onclick = function (event) {
    if (event.target === modal) {
      closeShopModal();
    }
  };

  document.body.appendChild(modal);
  updateShopModal();
  addShopKeyListeners(); // Add ESC key listener

  // Show welcome message
  showMessage("Winkel geopend! 🏪 Koop zaden voor je boerderij.", "success");
}

// Close shop modal
function closeShopModal() {
  const modal = document.querySelector(".shop-modal");
  if (modal) {
    modal.remove();
  }
  // Remove ESC key listener
  document.removeEventListener("keydown", handleShopEscKey);

  // Show goodbye message
  showMessage("Winkel verlaten! Veel succes met je boerderij! 🌱", "success");
}

// Update shop modal content
function updateShopModal() {
  const shopGrid = document.getElementById("shopModalGrid");
  const moneyDisplay = document.getElementById("modalMoney");

  if (!shopGrid || !moneyDisplay) return;

  shopGrid.innerHTML = "";
  moneyDisplay.textContent = gameState.money;

  // Add crop seeds based on seasonal availability and location
  Object.entries(crops).forEach(([cropType, crop]) => {
    let isAvailable = false;
    let availabilityText = "";

    if (crop.greenhouseOnly) {
      // Greenhouse-only crops
      isAvailable = gameState.greenhouse;
      availabilityText = isAvailable ? "Kas beschikbaar" : "Kas vereist";
    } else {
      // Regular crops
      isAvailable = crop.seasons.includes(gameState.season);
      availabilityText = isAvailable ? `${gameState.season} seizoen` : "Verkeerd seizoen";
    }

    const canAfford = gameState.money >= crop.seedPrice;
    const disabledClass = isAvailable && canAfford ? "" : " disabled";

    const shopItem = document.createElement("div");
    shopItem.className = `shop-modal-item${disabledClass}`;
    shopItem.innerHTML = `
      <div class="item-icon">${crop.emoji}</div>
      <div class="item-details">
        <div class="item-name">${crop.name} Zaad</div>
        <div class="item-price">€${crop.seedPrice}</div>
        <div class="item-info-text">
          Groei: ${crop.growthTime} dagen<br>
          Verkoop: €${crop.fruitPrice}<br>
          <small style="color: ${isAvailable ? "#4a6741" : "#8b4513"};">
            ${availabilityText}${crop.greenhouseOnly ? " 🏡" : ""}
          </small>
        </div>
      </div>
      <button class="buy-button ${disabledClass}" 
              onclick="buyFromModal('${cropType}')"
              ${!isAvailable || !canAfford ? "disabled" : ""}>
        ${!isAvailable ? (crop.greenhouseOnly ? "Kas" : "Seizoen") : !canAfford ? "Te duur" : "Koop"}
      </button>
    `;
    shopGrid.appendChild(shopItem);
  });

  // Add greenhouse if not already owned
  if (!gameState.greenhouse) {
    const canAffordGreenhouse = gameState.money >= 1000;
    const disabledClass = canAffordGreenhouse ? "" : " disabled";

    const greenhouseItem = document.createElement("div");
    greenhouseItem.className = `shop-modal-item greenhouse-item${disabledClass}`;
    greenhouseItem.innerHTML = `
      <div class="item-icon">🏡</div>
      <div class="item-details">
        <div class="item-name">Kas</div>
        <div class="item-price">€1000</div>
        <div class="item-info-text">
          Aparte ruimte voor speciale gewassen!<br>
          Toegang tot exotische vruchten<br>
          Eenmalige aankoop
        </div>
      </div>
      <button class="buy-button ${disabledClass}" 
              onclick="buyGreenhouse()"
              ${!canAffordGreenhouse ? "disabled" : ""}>
        ${!canAffordGreenhouse ? "Te duur" : "Koop"}
      </button>
    `;
    shopGrid.appendChild(greenhouseItem);
  }
}

// Buy item from modal shop
function buyFromModal(cropType) {
  const success = buySeeds(cropType);
  if (success !== false) {
    updateShopModal(); // Refresh the modal display
  }
}

// Enhanced buySeeds function that returns success status
function buySeeds(cropType) {
  const crop = crops[cropType];
  const price = crop.seedPrice;

  // Check availability based on crop type
  let isAvailable = false;
  if (crop.greenhouseOnly) {
    // Greenhouse-only crops require greenhouse to be built
    isAvailable = gameState.greenhouse;
    if (!isAvailable) {
      showMessage(`${crop.name} zaad is alleen beschikbaar als je een kas hebt! Koop eerst een kas. 🏡`, "error");
      return false;
    }
  } else {
    // Regular crops require correct season
    isAvailable = crop.seasons.includes(gameState.season);
    if (!isAvailable) {
      showMessage(`${crop.name} zaad is niet beschikbaar in ${gameState.season}! 🚫`, "error");
      return false;
    }
  }

  if (gameState.money >= price) {
    gameState.money -= price;
    gameState.seeds[cropType]++;
    const location = crop.greenhouseOnly ? "voor in de kas" : "voor je boerderij";
    showMessage(`Je hebt ${crop.name} zaad gekocht ${location}! 🌱`, "success");
    updateUI();
    saveGame();
    return true;
  } else {
    showMessage("Je hebt niet genoeg geld! 💸", "error");
    return false;
  }
}

// Buy greenhouse function
function buyGreenhouse() {
  const price = 1000;

  if (gameState.greenhouse) {
    showMessage("Je hebt al een kas! 🏡", "error");
    return false;
  }

  if (gameState.money >= price) {
    gameState.money -= price;
    gameState.greenhouse = true;
    showMessage(
      "🎉 Kas gekocht! Je kunt nu exotische gewassen planten! Ga naar de kas om binnen te gaan! 🏡",
      "success"
    );
    updateUI();
    saveGame();
    updateShopModal(); // Refresh the modal to hide greenhouse
    return true;
  } else {
    showMessage("Je hebt niet genoeg geld! Je hebt €1000 nodig. 💸", "error");
    return false;
  }
}

// Handle ESC key for closing shop
function handleShopEscKey(event) {
  if (event.key === "Escape") {
    closeShopModal();
  }
}

// Add ESC key listener when shop opens
function addShopKeyListeners() {
  document.addEventListener("keydown", handleShopEscKey);
}
