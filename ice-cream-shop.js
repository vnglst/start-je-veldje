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
            Verkoop je zelfgemaakte ijs hier!
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

  // Show all ice cream in inventory for selling
  const hasIceCream = Object.entries(gameState.iceCream).some(([type, count]) => count > 0);

  if (!hasIceCream) {
    shopContainer.innerHTML =
      '<div style="text-align: center; color: #666; padding: 40px; line-height: 1.6;">' +
      '<div style="font-size: 2em; margin-bottom: 15px;">🏭</div>' +
      '<div style="font-weight: bold; margin-bottom: 10px;">Geen ijs om te verkopen!</div>' +
      "<div>Ga naar de IJsmachine om ijs te maken van je fruit.</div>" +
      "</div>";
    return;
  }

  Object.entries(gameState.iceCream).forEach(([iceCreamType, count]) => {
    if (count <= 0) return;

    const iceCream = iceCreams[iceCreamType];
    if (!iceCream) return;

    const shopItem = document.createElement("div");
    shopItem.className = "shop-item";
    shopItem.innerHTML = `
      <div class="shop-icon">${iceCream.emoji}</div>
      <div class="shop-details">
        <div class="shop-name">${iceCream.name}</div>
        <div class="shop-description">Voorraad: ${count} stuks</div>
        <div class="shop-price">€${iceCream.sellPrice} per stuk</div>
        <div class="shop-total" style="color: #2e8b57; font-size: 0.9em;">
          Totaal: €${iceCream.sellPrice * count}
        </div>
      </div>
      <div class="shop-actions">
        <button class="sell-one-button" onclick="sellIceCreamToShop('${iceCreamType}', 1)">
          Verkoop 1x
        </button>
        ${
          count > 1
            ? `
        <button class="sell-all-button" onclick="sellIceCreamToShop('${iceCreamType}', ${count})" 
                style="margin-top: 5px; background: #2e8b57;">
          Verkoop Alles
        </button>
        `
            : ""
        }
      </div>
    `;
    shopContainer.appendChild(shopItem);
  });
}

// Sell ice cream to shop
function sellIceCreamToShop(iceCreamType, amount) {
  const iceCream = iceCreams[iceCreamType];
  if (!iceCream) return;

  if (!gameState.iceCream[iceCreamType] || gameState.iceCream[iceCreamType] < amount) {
    showMessage("Je hebt niet genoeg ijs om te verkopen! 🍦", "error");
    return;
  }

  const totalPrice = iceCream.sellPrice * amount;

  // Remove ice cream from inventory
  gameState.iceCream[iceCreamType] -= amount;

  // Add money
  gameState.money += totalPrice;

  const itemText = amount === 1 ? iceCream.name : `${amount}x ${iceCream.name}`;
  showMessage(`Je hebt ${itemText} verkocht voor €${totalPrice}! 💰🍦`, "success");

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
