// Shop interaction functions

// Check if player is near the shop
function isPlayerNearShop() {
  const shopX = gameState.shopPosition.x;
  const shopY = gameState.shopPosition.y;
  const playerX = gameState.playerPosition.x;
  const playerY = gameState.playerPosition.y;

  const deltaX = Math.abs(playerX - shopX);
  const deltaY = Math.abs(playerY - shopY);

  return deltaX <= 1 && deltaY <= 1;
}

// Interact with shop (open shop modal)
function interactWithShop() {
  if (!isPlayerNearShop()) {
    showMessage("Je bent te ver van de winkel! Loop er naartoe. 🏃‍♂️", "error");
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

  // Add crop seeds based on seasonal availability
  Object.entries(crops).forEach(([cropType, crop]) => {
    const isAvailable = crop.seasons.includes(gameState.season);
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
          Verkoop: €${crop.fruitPrice}
        </div>
      </div>
      <button class="buy-button ${disabledClass}" 
              onclick="buyFromModal('${cropType}')"
              ${!isAvailable || !canAfford ? "disabled" : ""}>
        ${!isAvailable ? "Seizoen" : !canAfford ? "Te duur" : "Koop"}
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
          Versnelt groei van ALLE planten!<br>
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

  // Check if crop is available in current season
  if (!crop.seasons.includes(gameState.season)) {
    showMessage(`${crop.name} zaad is niet beschikbaar in ${gameState.season}! 🚫`, "error");
    return false;
  }

  if (gameState.money >= price) {
    gameState.money -= price;
    gameState.seeds[cropType]++;
    showMessage(`Je hebt ${crop.name} zaad gekocht! 🌱`, "success");
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
    showMessage("🎉 Kas gekocht! Alle planten groeien nu sneller! 🏡", "success");
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
