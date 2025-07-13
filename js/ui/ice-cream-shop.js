// Ice cream shop interaction functions

// Check of de ijssalon open is (10:00-18:00)
function isIceCreamShopOpen() {
  return gameState.hour >= 10 && gameState.hour < 18;
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

  // Als we buiten zijn, check of we precies op de ijswinkel staan
  const iceCreamShopX = gameState.iceCreamShopPosition.x;
  const iceCreamShopY = gameState.iceCreamShopPosition.y;
  const playerX = gameState.playerPosition.x;
  const playerY = gameState.playerPosition.y;
  if (!(playerX === iceCreamShopX && playerY === iceCreamShopY)) {
    showMessage("Je moet precies op de ijswinkel staan om naar binnen te gaan! 🏃‍♂️", "error");
    return;
  }

  // Check of de ijssalon open is
  if (!isIceCreamShopOpen()) {
    const currentTime = `${gameState.hour.toString().padStart(2, "0")}:${gameState.minute.toString().padStart(2, "0")}`;
    showMessage(`De ijssalon is nog gesloten! ⏰ Openingstijden: 10:00-18:00 (Nu: ${currentTime})`, "error");
    return;
  }

  // Ga ijssalon binnen
  gameState.inIceCreamShop = true;
  gameState.playerPosition = { x: 1, y: 5 }; // Positie binnen ijssalon (bij ingang)

  // Reset customer queue als er te veel klanten zijn (bug fix)
  if (gameState.customerQueue.length > 10) {
    gameState.customerQueue = [];
    gameState.customers = [];
    gameState.customerSpawnTimer = 0;
  }

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

  // Create modal overlay
  const modal = document.createElement("div");
  modal.className = "ice-cream-shop-modal";

  let modalContent = "";
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
              ${
                iceCreams[currentCustomer.wantedIceCream]?.emoji ||
                lemonades[currentCustomer.wantedIceCream]?.emoji ||
                "🍦"
              } ${
      iceCreams[currentCustomer.wantedIceCream]?.name || lemonades[currentCustomer.wantedIceCream]?.name || "Drankje"
    }
            </div>
          </div>
          <button class="close-button" onclick="closeIceCreamShopModal()">✖️</button>
        </div>
        <div class="ice-cream-shop-modal-body">
          <div class="customer-patience" style="margin-bottom: 15px;">
            <div style="font-size: 0.9em; margin-bottom: 5px;">Geduld: ${Math.ceil(currentCustomer.patience)}/${
      currentCustomer.maxPatience
    }</div>
            <div class="patience-bar" style="width: 100%; height: 8px; background: #ddd; border-radius: 4px;">
              <div style="width: ${
                (currentCustomer.patience / currentCustomer.maxPatience) * 100
              }%; height: 100%; background: ${
      currentCustomer.patience > 5 ? "#4CAF50" : currentCustomer.patience > 2 ? "#FFC107" : "#F44336"
    }; border-radius: 4px;"></div>
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

  // Show ice cream and lemonade separately
  const hasIceCream = Object.entries(gameState.iceCream).some(([type, count]) => count > 0);
  const hasLemonade = Object.entries(gameState.lemonade).some(([type, count]) => count > 0);

  if (!hasIceCream && !hasLemonade) {
    shopContainer.innerHTML =
      '<div style="text-align: center; color: #666; padding: 40px; line-height: 1.6;">' +
      '<div style="font-size: 2em; margin-bottom: 15px;">🏭🥤</div>' +
      '<div style="font-weight: bold; margin-bottom: 10px;">Geen ijs of limonade om te verkopen!</div>' +
      "<div>Ga naar de IJsmachine (🏭) of Limonade Machine (🥤) om drankjes te maken van je fruit.</div>" +
      '<div style="margin-top: 10px; font-size: 0.9em; color: #888;">💡 Combineer verschillende vruchten voor waardevolle recepten!</div>' +
      "</div>";
    return;
  }

  // Create two separate columns for ice cream and lemonade
  let shopHTML = '<div class="product-sections" style="display: flex; gap: 20px;">';

  // Ice cream section (left side)
  if (hasIceCream) {
    shopHTML +=
      '<div class="product-section ice-cream-section" style="flex: 1; border: 2px solid #ff69b4; border-radius: 10px; padding: 15px; background: linear-gradient(135deg, #fff0f8 0%, #ffe6f3 100%);">';
    shopHTML +=
      '<h3 style="text-align: center; color: #ff69b4; margin-bottom: 15px; font-size: 1.3em;">🍦 IJS VERKOPEN</h3>';

    // Sort ice cream by rarity (basic to mythical)
    const sortedIceCreams = Object.entries(gameState.iceCream)
      .filter(([type, count]) => count > 0)
      .map(([type, count]) => ({ type, count, product: iceCreams[type] }))
      .filter((item) => item.product)
      .sort((a, b) => {
        const rarityOrder = { basic: 0, rare: 1, epic: 2, legendary: 3, mythical: 4 };
        return rarityOrder[a.product.rarity || "basic"] - rarityOrder[b.product.rarity || "basic"];
      });

    // Add ice cream items in sorted order
    sortedIceCreams.forEach(({ type, count, product }) => {
      const isWanted = currentCustomer && currentCustomer.wantedIceCream === type;
      shopHTML += createProductCard(type, product, count, "iceCream", isWanted, currentCustomer);
    });

    shopHTML += "</div>";
  }

  // Lemonade section (right side)
  if (hasLemonade) {
    shopHTML +=
      '<div class="product-section lemonade-section" style="flex: 1; border: 2px solid #ffa500; border-radius: 10px; padding: 15px; background: linear-gradient(135deg, #fff8e6 0%, #ffeb99 100%);">';
    shopHTML +=
      '<h3 style="text-align: center; color: #ffa500; margin-bottom: 15px; font-size: 1.3em;">🥤 LIMONADE VERKOPEN</h3>';

    // Sort lemonade by rarity (basic to mythical)
    const sortedLemonades = Object.entries(gameState.lemonade)
      .filter(([type, count]) => count > 0)
      .map(([type, count]) => ({ type, count, product: lemonades[type] }))
      .filter((item) => item.product)
      .sort((a, b) => {
        const rarityOrder = { basic: 0, rare: 1, epic: 2, legendary: 3, mythical: 4 };
        return rarityOrder[a.product.rarity || "basic"] - rarityOrder[b.product.rarity || "basic"];
      });

    // Add lemonade items in sorted order
    sortedLemonades.forEach(({ type, count, product }) => {
      const isWanted = currentCustomer && currentCustomer.wantedIceCream === type;
      shopHTML += createProductCard(type, product, count, "lemonade", isWanted, currentCustomer);
    });

    shopHTML += "</div>";
  }

  shopHTML += "</div>";
  shopContainer.innerHTML = shopHTML;
}

// Helper functie om product kaarten te maken
function createProductCard(productType, product, count, category, isWanted, currentCustomer) {
  const rarityConfig = {
    basic: { color: "#666", name: "🥄 Basis", bg: "#f9f9f9" },
    rare: { color: "#4169E1", name: "⭐ Speciaal", bg: "#f0f4ff" },
    epic: { color: "#8A2BE2", name: "💎 Premium", bg: "#f8f0ff" },
    legendary: { color: "#FF8C00", name: "🏆 Legendarisch", bg: "#fff8f0" },
    mythical: { color: "#DC143C", name: "✨ Mythisch", bg: "#fff0f0" },
  };

  const rarity = rarityConfig[product.rarity] || rarityConfig.basic;
  const borderStyle = isWanted
    ? "border: 3px solid #4CAF50; box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);"
    : `border: 2px solid ${rarity.color};`;

  return `
    <div style="margin-bottom: 10px; padding: 10px; border-radius: 8px; background: ${rarity.bg}; ${borderStyle}">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="font-size: 1.8em;">${product.emoji}</div>
        <div style="flex: 1;">
          <div style="font-weight: bold; color: ${rarity.color};">
            ${product.name} ${isWanted ? "⭐" : ""}
          </div>
          <div style="font-size: 0.8em; color: ${rarity.color}; font-weight: bold; margin-bottom: 2px;">
            ${rarity.name}
          </div>
          <div style="font-size: 0.9em; color: #666;">
            Voorraad: ${count} • €${product.sellPrice}/stuk
          </div>
          <div style="font-size: 0.8em; color: #2e8b57; font-weight: bold;">
            Totaal: €${product.sellPrice * count}
          </div>
        </div>
        <div>
          ${
            currentCustomer
              ? `<button onclick="serveCustomerProduct('${productType}', '${category}')" 
                      style="padding: 8px 12px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; ${
                        isWanted ? "background: #4CAF50; color: white;" : "background: #e0e0e0; color: #666;"
                      }">
                ${isWanted ? "Gewenst!" : "Bedienen"}
              </button>`
              : `<div style="text-align: center; color: #666; font-style: italic; padding: 10px; border: 2px dashed #ccc; border-radius: 8px; background: #f9f9f9;">
                💡 Wacht op klanten!<br>
                <small style="font-size: 0.8em;">Je kunt alleen aan klanten verkopen</small>
              </div>`
          }
        </div>
      </div>
    </div>
  `;
}

// Opmerking: Directe verkoop aan winkel is verwijderd
// Je kunt nu alleen verkopen aan klanten die bij de balie staan

// Verkoop functies verwijderd - alleen verkoop aan klanten toegestaan

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
      speelGeluidseffect("kassa");
    }
  }
}

// Bedien klant met specifiek product (ijs of limonade)
function serveCustomerProduct(productType, category) {
  let success = false;

  if (category === "iceCream") {
    success = window.serveCurrentCustomer && serveCurrentCustomer(productType);
  } else if (category === "lemonade") {
    success = window.serveCurrentCustomerLemonade && serveCurrentCustomerLemonade(productType);
  }

  if (success) {
    // Klant succesvol bediend, sluit modal
    closeIceCreamShopModal();
    // Speel succes geluid
    if (window.speelGeluidseffect) {
      speelGeluidseffect("kassa");
    }
  }
}

// Maak functies globaal beschikbaar
window.serveCustomerIceCream = serveCustomerIceCream;
window.serveCustomerProduct = serveCustomerProduct;
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
  if (
    (playerX === 6 && playerY >= 1 && playerY <= 4) ||
    (playerX === 7 && playerY >= 1 && playerY <= 4) ||
    (playerX === 5 && playerY >= 1 && playerY <= 4)
  ) {
    openIceCreamShopModal();
  } else {
    showMessage("Loop naar de balie om ijs te verkopen! 🍦", "error");
  }
}
