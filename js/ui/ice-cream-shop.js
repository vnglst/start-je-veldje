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
      '<div style="margin-top: 10px; font-size: 0.9em; color: #888;">💡 Combineer verschillende vruchten voor waardevolle recepten!</div>' +
      "</div>";
    return;
  }

  // Group ice cream by rarity for display
  const groupedIceCream = {
    basic: [],
    rare: [],
    epic: [],
    legendary: [],
    mythical: [],
  };

  Object.entries(gameState.iceCream).forEach(([iceCreamType, count]) => {
    if (count <= 0) return;

    const iceCream = iceCreams[iceCreamType];
    if (!iceCream) return;

    const rarity = iceCream.rarity || "basic";
    groupedIceCream[rarity].push({ iceCreamType, iceCream, count });
  });

  // Rarity display configuration
  const rarityConfig = {
    basic: { name: "🥄 Basis IJs", color: "#666", bgColor: "#f9f9f9" },
    rare: { name: "⭐ Zeldzaam IJs", color: "#4169E1", bgColor: "#f0f4ff" },
    epic: { name: "💎 Episch IJs", color: "#8A2BE2", bgColor: "#f8f0ff" },
    legendary: { name: "🏆 Legendarisch IJs", color: "#FF8C00", bgColor: "#fff8f0" },
    mythical: { name: "✨ Mythisch IJs", color: "#DC143C", bgColor: "#fff0f0" },
  };

  // Display ice cream by rarity
  Object.entries(groupedIceCream).forEach(([rarity, iceCreamList]) => {
    if (iceCreamList.length === 0) return;

    const config = rarityConfig[rarity];

    // Add rarity header
    const rarityHeader = document.createElement("div");
    rarityHeader.className = "rarity-header";
    rarityHeader.style.cssText = `
      background: ${config.bgColor};
      color: ${config.color};
      padding: 10px;
      margin: 10px 0 5px 0;
      border-left: 4px solid ${config.color};
      font-weight: bold;
      border-radius: 4px;
    `;
    rarityHeader.textContent = config.name;
    shopContainer.appendChild(rarityHeader);

    // Add ice cream items in this rarity
    iceCreamList.forEach(({ iceCreamType, iceCream, count }) => {
      const shopItem = document.createElement("div");
      shopItem.className = "shop-item";
      shopItem.style.cssText = `
        border-left: 3px solid ${config.color};
        background: ${config.bgColor};
      `;

      shopItem.innerHTML = `
        <div class="shop-icon" style="font-size: 1.5em;">${iceCream.emoji}</div>
        <div class="shop-details">
          <div class="shop-name" style="color: ${config.color}; font-weight: bold;">
            ${iceCream.name}
          </div>
          <div class="shop-description">Voorraad: ${count} stuks</div>
          <div class="shop-price">€${iceCream.sellPrice} per stuk</div>
          <div class="shop-total" style="color: #2e8b57; font-size: 0.9em; font-weight: bold;">
            Totaal: €${iceCream.sellPrice * count}
          </div>
          ${
            iceCream.description
              ? `<div style="font-size: 0.8em; color: #666; font-style: italic; margin-top: 5px;">${iceCream.description}</div>`
              : ""
          }
        </div>
        <div class="shop-actions">
          <button class="sell-one-button" onclick="sellIceCreamToShop('${iceCreamType}', 1)"
                  style="background: ${config.color};">
            Verkoop 1x
          </button>
          ${
            count > 1
              ? `
          <button class="sell-all-button" onclick="sellIceCreamToShop('${iceCreamType}', ${count})" 
                  style="margin-top: 5px; background: ${config.color}; opacity: 0.8;">
            Verkoop Alles
          </button>
          `
              : ""
          }
        </div>
      `;
      shopContainer.appendChild(shopItem);
    });
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
