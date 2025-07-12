// Ice cream shop interaction functions

// Check if player is near the ice cream shop
function isPlayerNearIceCreamShop() {
  const iceCreamShopX = gameState.iceCreamShopPosition.x;
  const iceCreamShopY = gameState.iceCreamShopPosition.y;
  const playerX = gameState.playerPosition.x;
  const playerY = gameState.playerPosition.y;

  const deltaX = Math.abs(playerX - iceCreamShopX);
  const deltaY = Math.abs(playerY - iceCreamShopY);

  return deltaX <= 1 && deltaY <= 1;
}

// Interact with ice cream shop (open shop modal)
function interactWithIceCreamShop() {
  if (!isPlayerNearIceCreamShop()) {
    showMessage("Je bent te ver van de ijswinkel! Loop er naartoe. 🏃‍♂️", "error");
    return;
  }

  openIceCreamShopModal();
}

// Open ice cream shop modal/dialog
function openIceCreamShopModal() {
  // Create modal overlay
  const modal = document.createElement("div");
  modal.className = "ice-cream-shop-modal";
  modal.innerHTML = `
    <div class="ice-cream-shop-modal-content">
      <div class="ice-cream-shop-modal-header">
        <div>
          <h2>🍦 IJswinkel</h2>
          <div style="font-size: 0.8em; opacity: 0.8; margin-top: 5px;">
            Koop heerlijk ijs om je geluk te verhogen!
          </div>
        </div>
        <button class="close-button" onclick="closeIceCreamShopModal()">✖️</button>
      </div>
      <div class="ice-cream-shop-modal-body">
        <div class="shop-items" id="iceCreamShopItems">
          <!-- Ice cream items will be populated here -->
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  updateIceCreamShopModal();
  addIceCreamShopKeyListeners();
}

// Close ice cream shop modal
function closeIceCreamShopModal() {
  const modal = document.querySelector(".ice-cream-shop-modal");
  if (modal) {
    modal.remove();
  }
  document.removeEventListener("keydown", handleIceCreamShopEscKey);
}

// Update ice cream shop modal content
function updateIceCreamShopModal() {
  const shopContainer = document.getElementById("iceCreamShopItems");
  if (!shopContainer) return;

  shopContainer.innerHTML = "";

  // Add buyable ice cream items
  Object.entries(iceCreams).forEach(([iceCreamType, iceCream]) => {
    // Only show items that can be bought (not craftable ones)
    if (iceCream.canCraft) return;

    const canAfford = gameState.money >= iceCream.price;
    const disabledClass = canAfford ? "" : " disabled";

    const shopItem = document.createElement("div");
    shopItem.className = `shop-item${disabledClass}`;
    shopItem.innerHTML = `
      <div class="shop-icon">${iceCream.emoji}</div>
      <div class="shop-details">
        <div class="shop-name">${iceCream.name}</div>
        <div class="shop-description">${iceCream.description}</div>
        <div class="shop-happiness" style="color: #ff69b4; font-size: 0.9em;">
          +${iceCream.happiness} Geluk ❤️
        </div>
        <div class="shop-price">€${iceCream.price}</div>
      </div>
      <div class="shop-actions">
        <button class="buy-button" onclick="buyIceCreamFromShop('${iceCreamType}')" ${!canAfford ? "disabled" : ""}>
          Koop
        </button>
      </div>
    `;
    shopContainer.appendChild(shopItem);
  });
}

// Buy ice cream from shop
function buyIceCreamFromShop(iceCreamType) {
  const iceCream = iceCreams[iceCreamType];
  if (!iceCream) return;

  if (gameState.money < iceCream.price) {
    showMessage("Je hebt niet genoeg geld! 💸", "error");
    return;
  }

  gameState.money -= iceCream.price;
  if (!gameState.iceCream[iceCreamType]) {
    gameState.iceCream[iceCreamType] = 0;
  }
  gameState.iceCream[iceCreamType]++;

  // Add happiness
  if (!gameState.happiness) {
    gameState.happiness = 0;
  }
  gameState.happiness += iceCream.happiness;

  showMessage(`Je hebt ${iceCream.name} gekocht! +${iceCream.happiness} Geluk! ❤️🍦`, "success");

  updateUI();
  saveGame();
  updateIceCreamShopModal(); // Refresh the modal display
}

// Handle ESC key for closing ice cream shop
function handleIceCreamShopEscKey(event) {
  if (event.key === "Escape") {
    closeIceCreamShopModal();
  }
}

// Add ESC key listener when ice cream shop opens
function addIceCreamShopKeyListeners() {
  document.addEventListener("keydown", handleIceCreamShopEscKey);
}
