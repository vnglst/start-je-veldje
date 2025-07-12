// Ice cream machine interaction functions

// Check if player is near the ice cream machine
function isPlayerNearIceCreamMachine() {
  const iceCreamMachineX = gameState.iceCreamMachinePosition.x;
  const iceCreamMachineY = gameState.iceCreamMachinePosition.y;
  const playerX = gameState.playerPosition.x;
  const playerY = gameState.playerPosition.y;

  const deltaX = Math.abs(playerX - iceCreamMachineX);
  const deltaY = Math.abs(playerY - iceCreamMachineY);

  return deltaX <= 1 && deltaY <= 1;
}

// Interact with ice cream machine (open machine modal)
function interactWithIceCreamMachine() {
  if (!isPlayerNearIceCreamMachine()) {
    showMessage("Je bent te ver van de ijsmachine! Loop er naartoe. 🏃‍♂️", "error");
    return;
  }

  openIceCreamMachineModal();
}

// Open ice cream machine modal/dialog
function openIceCreamMachineModal() {
  // Create modal overlay
  const modal = document.createElement("div");
  modal.className = "ice-cream-machine-modal";
  modal.innerHTML = `
    <div class="ice-cream-machine-modal-content">
      <div class="ice-cream-machine-modal-header">
        <div>
          <h2>🏭 IJsmachine</h2>
          <div style="font-size: 0.8em; opacity: 0.8; margin-top: 5px;">
            Maak ijs van je geoogste fruit en verkoop het!
          </div>
        </div>
        <button class="close-button" onclick="closeIceCreamMachineModal()">✖️</button>
      </div>
      <div class="ice-cream-machine-modal-body">
        <div class="machine-tabs">
          <button class="tab-btn active" onclick="showMachineTab('make')">🍦 Maak IJs</button>
          <button class="tab-btn" onclick="showMachineTab('sell')">💰 Verkoop IJs</button>
        </div>
        
        <div id="machine-make-tab" class="machine-tab-content active">
          <h3 style="color: #2e8b57; margin-bottom: 15px;">Maak IJs van je Fruit</h3>
          <div class="ice-cream-recipes" id="iceCreamRecipes">
            <!-- Recipes will be generated here -->
          </div>
        </div>

        <div id="machine-sell-tab" class="machine-tab-content">
          <h3 style="color: #2e8b57; margin-bottom: 15px;">Verkoop je IJs</h3>
          <div class="ice-cream-inventory" id="iceCreamInventoryForSale">
            <!-- Ice cream inventory will be generated here -->
          </div>
        </div>

        <div class="machine-footer">
          <button class="button close-machine-button" onclick="closeIceCreamMachineModal()">
            🚪 IJsmachine Verlaten
          </button>
        </div>
      </div>
    </div>
  `;

  // Close modal when clicking outside
  modal.onclick = function (event) {
    if (event.target === modal) {
      closeIceCreamMachineModal();
    }
  };

  document.body.appendChild(modal);
  updateIceCreamMachineModal();
  addIceCreamMachineKeyListeners(); // Add ESC key listener

  // Show welcome message
  showMessage("IJsmachine geopend! 🏭 Maak ijs van je fruit en verkoop het voor winst!", "success");
}

// Show specific tab in machine modal
function showMachineTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.machine-tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected tab
  document.getElementById(`machine-${tabName}-tab`).classList.add('active');
  event.target.classList.add('active');
  
  updateIceCreamMachineModal();
}

// Close ice cream machine modal
function closeIceCreamMachineModal() {
  const modal = document.querySelector(".ice-cream-machine-modal");
  if (modal) {
    modal.remove();
  }
  // Remove ESC key listener
  document.removeEventListener("keydown", handleIceCreamMachineEscKey);

  // Show goodbye message
  showMessage("IJsmachine verlaten! Veel succes met je ijsproductie! 🏭", "success");
}

// Update ice cream machine modal content
function updateIceCreamMachineModal() {
  updateMakeIceCreamTab();
  updateSellIceCreamTab();
}

// Update the make ice cream tab
function updateMakeIceCreamTab() {
  const recipesContainer = document.getElementById("iceCreamRecipes");
  if (!recipesContainer) return;

  recipesContainer.innerHTML = "";

  // Add craftable ice cream recipes
  Object.entries(iceCreams).forEach(([iceCreamType, iceCream]) => {
    if (!iceCream.canCraft) return; // Skip non-craftable items

    const canMake = canCraftIceCream(iceCreamType);
    const disabledClass = canMake ? "" : " disabled";

    const recipeText = Object.entries(iceCream.recipe)
      .map(([fruit, amount]) => `${amount}x ${crops[fruit].emoji} ${crops[fruit].name}`)
      .join(" + ");

    const profitInfo = calculateIceCreamProfit(iceCreamType);

    const recipeItem = document.createElement("div");
    recipeItem.className = `recipe-item${disabledClass}`;
    recipeItem.innerHTML = `
      <div class="recipe-icon">${iceCream.emoji}</div>
      <div class="recipe-details">
        <div class="recipe-name">${iceCream.name}</div>
        <div class="recipe-ingredients">Recept: ${recipeText}</div>
        <div class="recipe-profit" style="color: #2e8b57; font-size: 0.9em;">
          Verkoop voor €${iceCream.sellPrice} ${profitInfo}
        </div>
      </div>
      <button class="make-button ${disabledClass}" 
              onclick="makeIceCreamFromMachine('${iceCreamType}')"
              ${!canMake ? "disabled" : ""}>
        ${!canMake ? "Geen fruit" : "Maak"}
      </button>
    `;
    recipesContainer.appendChild(recipeItem);
  });

  if (recipesContainer.children.length === 0) {
    recipesContainer.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">Geen recepten beschikbaar</div>';
  }
}

// Update the sell ice cream tab
function updateSellIceCreamTab() {
  const inventoryContainer = document.getElementById("iceCreamInventoryForSale");
  if (!inventoryContainer) return;

  inventoryContainer.innerHTML = "";

  // Show all ice cream in inventory
  const hasIceCream = Object.entries(gameState.iceCream).some(([type, count]) => count > 0);

  if (!hasIceCream) {
    inventoryContainer.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">Geen ijs om te verkopen. Maak eerst ijs!</div>';
    return;
  }

  Object.entries(gameState.iceCream).forEach(([iceCreamType, count]) => {
    if (count <= 0) return;

    const iceCream = iceCreams[iceCreamType];
    if (!iceCream) return;

    const sellItem = document.createElement("div");
    sellItem.className = "sell-ice-cream-item";
    sellItem.innerHTML = `
      <div class="sell-icon">${iceCream.emoji}</div>
      <div class="sell-details">
        <div class="sell-name">${iceCream.name}</div>
        <div class="sell-count">Voorraad: ${count}</div>
        <div class="sell-price">Verkoop: €${iceCream.sellPrice} per stuk</div>
      </div>
      <div class="sell-actions">
        <button class="sell-one-button" onclick="sellIceCreamFromMachine('${iceCreamType}', 1)">
          Verkoop 1x
        </button>
        ${count > 1 ? `<button class="sell-all-button" onclick="sellIceCreamFromMachine('${iceCreamType}', ${count})">
          Verkoop Alles (${count}x)
        </button>` : ''}
      </div>
    `;
    inventoryContainer.appendChild(sellItem);
  });
}

// Calculate profit information for ice cream
function calculateIceCreamProfit(iceCreamType) {
  const iceCream = iceCreams[iceCreamType];
  if (!iceCream.canCraft) return "";

  let fruitValue = 0;
  let totalFruit = 0;

  Object.entries(iceCream.recipe).forEach(([fruit, amount]) => {
    fruitValue += crops[fruit].fruitPrice * amount;
    totalFruit += amount;
  });

  const profit = iceCream.sellPrice - fruitValue;
  const profitText = profit > 0 ? `(+€${profit} winst!)` : profit < 0 ? `(-€${Math.abs(profit)} verlies)` : "(break-even)";
  
  return profitText;
}

// Make ice cream from machine
function makeIceCreamFromMachine(iceCreamType) {
  const success = craftIceCream(iceCreamType);
  if (success !== false) {
    updateIceCreamMachineModal(); // Refresh the modal display
  }
}

// Sell ice cream from machine
function sellIceCreamFromMachine(iceCreamType, amount) {
  const iceCream = iceCreams[iceCreamType];
  if (!iceCream) return;

  if (gameState.iceCream[iceCreamType] < amount) {
    showMessage("Je hebt niet genoeg ijs om te verkopen! 🍦", "error");
    return;
  }

  const totalPrice = iceCream.sellPrice * amount;
  
  gameState.iceCream[iceCreamType] -= amount;
  gameState.money += totalPrice;

  const itemText = amount === 1 ? iceCream.name : `${amount}x ${iceCream.name}`;
  showMessage(`Je hebt ${itemText} verkocht voor €${totalPrice}! 💰`, "success");
  
  updateUI();
  saveGame();
  updateIceCreamMachineModal(); // Refresh the modal display
}

// Handle ESC key for closing ice cream machine
function handleIceCreamMachineEscKey(event) {
  if (event.key === "Escape") {
    closeIceCreamMachineModal();
  }
}

// Add ESC key listener when ice cream machine opens
function addIceCreamMachineKeyListeners() {
  document.addEventListener("keydown", handleIceCreamMachineEscKey);
}
