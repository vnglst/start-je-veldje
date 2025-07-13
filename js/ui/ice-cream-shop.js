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

// Interact with ice cream shop (enter/exit or open shop modal)
function interactWithIceCreamShop() {
  // Als we in de ijssalon zijn, kunnen we altijd naar buiten
  if (gameState.inIceCreamShop) {
    // Verlaat ijssalon
    gameState.inIceCreamShop = false;
    gameState.playerPosition = { x: 7, y: 4 }; // Positie naast ijssalon uitgang
    showMessage("Je verlaat de ijssalon en gaat terug naar je boerderij! 🚜", "success");
    
    // Speel deur geluid bij ijssalon uitgaan
    if (window.speelDeurGeluid) {
      speelDeurGeluid();
    }
    
    updateGameMap();
    updateUI();
    saveGame();
    return;
  }

  // Als we buiten zijn, check of we dichtbij genoeg zijn om binnen te gaan
  if (!isPlayerNearIceCreamShop()) {
    const iceCreamShopX = gameState.iceCreamShopPosition.x;
    const iceCreamShopY = gameState.iceCreamShopPosition.y;
    const playerX = gameState.playerPosition.x;
    const playerY = gameState.playerPosition.y;
    showMessage(`Je bent te ver van de ijswinkel! Loop er naartoe. 🏃‍♂️ (Speler: ${playerX},${playerY} | IJswinkel: ${iceCreamShopX},${iceCreamShopY})`, "error");
    return;
  }

  // Ga ijssalon binnen
  gameState.inIceCreamShop = true;
  gameState.playerPosition = { x: 1, y: 5 }; // Positie binnen ijssalon (bij ingang)
  
  // Reset customer queue ALTIJD als er bugs zijn (tijdelijke fix)
  console.log("Customer queue length:", gameState.customerQueue.length);
  console.log("Resetting customer queue and customers - debug fix");
  gameState.customerQueue = [];
  gameState.customers = [];
  gameState.customerSpawnTimer = 0;
  
  showMessage("Welkom in je ijssalon! 🍦 Hier kun je je zelfgemaakte ijs verkopen!", "success");
  
  // Spawn eerste klant als de klanten lijst leeg is
  if (gameState.customers.length === 0 && window.spawnCustomer) {
    setTimeout(() => {
      spawnCustomer();
      showMessage("Je eerste klant komt binnen! 😊", "success");
    }, 1000); // 1 seconde vertraging
  }
  
  // Speel deur geluid bij ijssalon ingaan
  if (window.speelDeurGeluid) {
    speelDeurGeluid();
  }
  
  updateGameMap();
  updateUI();
  saveGame();
}

// Open ice cream shop modal/dialog
function openIceCreamShopModal() {
  // Check of er een klant is om te bedienen
  const currentCustomer = window.getCurrentCustomer ? getCurrentCustomer() : null;
  console.log("openIceCreamShopModal - currentCustomer:", currentCustomer);
  console.log("gameState.customerQueue length:", gameState.customerQueue.length);
  if (gameState.customerQueue.length > 0) {
    console.log("Eerste klant in queue - state:", gameState.customerQueue[0].state);
    console.log("Eerste klant in queue - position:", gameState.customerQueue[0].position);
  }
  console.log("gameState.customers:", gameState.customers);
  
  // Create modal overlay
  const modal = document.createElement("div");
  modal.className = "ice-cream-shop-modal";
  
  let modalContent = '';
  if (currentCustomer) {
    // Bedienings interface
    modalContent = `
      <div class="ice-cream-shop-modal-content">
        <div class="ice-cream-shop-modal-header">
          <div>
            <h2>🍦 Klant Bedienen</h2>
            <div style="font-size: 0.9em; margin-top: 5px;">
              ${currentCustomer.type.emoji} ${currentCustomer.type.name} wil graag:
            </div>
            <div style="font-size: 1.1em; font-weight: bold; color: #ff69b4; margin-top: 5px;">
              ${iceCreams[currentCustomer.wantedIceCream]?.emoji || '🍦'} ${iceCreams[currentCustomer.wantedIceCream]?.name || 'IJs'}
            </div>
          </div>
          <button class="close-button" onclick="closeIceCreamShopModal()">✖️</button>
        </div>
        <div class="ice-cream-shop-modal-body">
          <div class="customer-patience" style="margin-bottom: 15px;">
            <div style="font-size: 0.9em; margin-bottom: 5px;">Geduld: ${Math.ceil(currentCustomer.patience)}/${currentCustomer.maxPatience}</div>
            <div class="patience-bar" style="width: 100%; height: 8px; background: #ddd; border-radius: 4px;">
              <div style="width: ${(currentCustomer.patience / currentCustomer.maxPatience) * 100}%; height: 100%; background: ${currentCustomer.patience > 5 ? '#4CAF50' : currentCustomer.patience > 2 ? '#FFC107' : '#F44336'}; border-radius: 4px;"></div>
            </div>
          </div>
          <div class="shop-items" id="iceCreamShopItems">
            <!-- Ice cream items will be populated here -->
          </div>
        </div>
      </div>
    `;
  } else {
    // Normale verkoop interface (geen klant)
    modalContent = `
      <div class="ice-cream-shop-modal-content">
        <div class="ice-cream-shop-modal-header">
          <div>
            <h2>🍦 IJswinkel</h2>
            <div style="font-size: 0.8em; opacity: 0.8; margin-top: 5px;">
              Geen klant aan de balie. Verkoop je zelfgemaakte ijs hier!
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
  }
  
  modal.innerHTML = modalContent;
  document.body.appendChild(modal);
  updateIceCreamShopModal(currentCustomer);
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
function updateIceCreamShopModal(currentCustomer = null) {
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
          ${currentCustomer 
            ? `<button class="serve-customer-button" onclick="serveCustomerIceCream('${iceCreamType}')"
                      style="background: ${iceCreamType === currentCustomer.wantedIceCream ? '#4CAF50' : config.color}; ${iceCreamType === currentCustomer.wantedIceCream ? 'border: 2px solid #2E7D32; box-shadow: 0 0 8px rgba(76, 175, 80, 0.5);' : ''}">
                ${iceCreamType === currentCustomer.wantedIceCream ? '⭐ Gewenst!' : 'Bedien Klant'}
              </button>`
            : `<div style="text-align: center; color: #666; font-style: italic; padding: 10px; border: 2px dashed #ccc; border-radius: 8px;">
                🍦 Alleen verkoop aan klanten!<br>
                <small>Wacht tot er een klant bij de balie staat</small>
              </div>`}
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

// Bedien klant met specifiek ijsje
function serveCustomerIceCream(iceCreamType) {
  if (window.serveCurrentCustomer && serveCurrentCustomer(iceCreamType)) {
    // Klant succesvol bediend, sluit modal
    closeIceCreamShopModal();
    // Speel succes geluid
    if (window.speelGeluidseffect) {
      speelGeluidseffect('kassa');
    }
  }
}

// Maak functies globaal beschikbaar
window.serveCustomerIceCream = serveCustomerIceCream;
window.interactWithIceCreamShop = interactWithIceCreamShop;
window.interactWithIceCreamShopCounter = interactWithIceCreamShopCounter;

// Interacteer met ijssalon balie (binnen de ijssalon)
function interactWithIceCreamShopCounter() {
  if (!gameState.inIceCreamShop) {
    showMessage("Je bent niet in de ijssalon!", "error");
    return;
  }

  // Check of speler bij de balie staat (nieuwe positie)
  const playerX = gameState.playerPosition.x;
  const playerY = gameState.playerPosition.y;
  
  // Nieuwe balie positie: x=6, y=1-4 (balie) of x=7, y=1-4 (achter de balie) of x=5, y=1-4 (voor de balie)
  if ((playerX === 6 && playerY >= 1 && playerY <= 4) || 
      (playerX === 7 && playerY >= 1 && playerY <= 4) ||
      (playerX === 5 && playerY >= 1 && playerY <= 4)) {
    openIceCreamShopModal();
  } else {
    showMessage("Loop naar de balie om ijs te verkopen! 🍦", "error");
  }
}
