// Ice cream machine interaction functions

// Check if player can craft specific ice cream
function canCraftIceCream(iceCreamType) {
  const iceCream = iceCreams[iceCreamType];
  if (!iceCream || !iceCream.canCraft) return false;

  // Check if player has all required ingredients
  for (const [fruit, amount] of Object.entries(iceCream.recipe)) {
    if (!gameState.fruits[fruit] || gameState.fruits[fruit] < amount) {
      return false;
    }
  }
  return true;
}

// Craft ice cream from fruits
function craftIceCream(iceCreamType) {
  const iceCream = iceCreams[iceCreamType];
  if (!iceCream || !iceCream.canCraft) {
    showMessage("Dit ijs kan niet gemaakt worden! 🍦", "error");
    return false;
  }

  // Check if player has all required ingredients
  if (!canCraftIceCream(iceCreamType)) {
    const missingIngredients = [];
    Object.entries(iceCream.recipe).forEach(([fruit, amount]) => {
      const have = gameState.fruits[fruit] || 0;
      if (have < amount) {
        const needed = amount - have;
        missingIngredients.push(`${needed}x ${crops[fruit].emoji} ${crops[fruit].name}`);
      }
    });
    showMessage(`Je mist ingrediënten: ${missingIngredients.join(", ")} 🥕🍎`, "error");
    return false;
  }

  // Consume ingredients
  Object.entries(iceCream.recipe).forEach(([fruit, amount]) => {
    gameState.fruits[fruit] -= amount;
  });

  // Add ice cream to inventory
  if (!gameState.iceCream[iceCreamType]) {
    gameState.iceCream[iceCreamType] = 0;
  }
  gameState.iceCream[iceCreamType]++;

  const profitInfo = calculateIceCreamProfit(iceCreamType);

  // Special messages for rare ice cream
  let rarityMessage = "";
  const rarity = iceCream.rarity || "basic";

  switch (rarity) {
    case "rare":
      rarityMessage = "⭐ Zeldzaam recept ontgrendeld! ";
      break;
    case "epic":
      rarityMessage = "💎 Episch recept gemeesterd! ";
      break;
    case "legendary":
      rarityMessage = "🏆 Legendarische creatie voltooid! ";
      break;
    case "mythical":
      rarityMessage = "✨ MYTHISCHE MEESTERCREATIE! ";
      break;
  }

  showMessage(
    `${rarityMessage}Je hebt ${iceCream.name} gemaakt! ${profitInfo} 🍦✨ Verkoop het in de IJswinkel!`,
    rarity === "mythical" || rarity === "legendary" ? "epic" : "success"
  );

  updateUI();
  saveGame();
  return true;
}

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
            Maak ijs van je geoogste fruit! Verkoop het in de IJswinkel 🍦
          </div>
        </div>
        <button class="close-button" onclick="closeIceCreamMachineModal()">✖️</button>
      </div>
      <div class="ice-cream-machine-modal-body">
        <h3 style="color: #2e8b57; margin-bottom: 15px;">🍦 Maak IJs van je Fruit</h3>
        <div class="ice-cream-recipes" id="iceCreamRecipes">
          <!-- Recipes will be generated here -->
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
  showMessage("IJsmachine geopend! 🏭 Maak ijs van je fruit. Verkoop het in de IJswinkel!", "success");
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
}

// Update the make ice cream tab
function updateMakeIceCreamTab() {
  const recipesContainer = document.getElementById("iceCreamRecipes");
  if (!recipesContainer) return;

  recipesContainer.innerHTML = "";

  // Group recipes by rarity
  const groupedRecipes = {
    basic: [],
    rare: [],
    epic: [],
    legendary: [],
    mythical: [],
  };

  // Add craftable ice cream recipes
  Object.entries(iceCreams).forEach(([iceCreamType, iceCream]) => {
    if (!iceCream.canCraft) return; // Skip non-craftable items

    const rarity = iceCream.rarity || "basic";
    groupedRecipes[rarity].push({ iceCreamType, iceCream });
  });

  // Rarity display configuration
  const rarityConfig = {
    basic: { name: "🥄 Basis Recepten", color: "#666", bgColor: "#f9f9f9" },
    rare: { name: "⭐ Zeldzame Recepten", color: "#4169E1", bgColor: "#f0f4ff" },
    epic: { name: "💎 Epische Recepten", color: "#8A2BE2", bgColor: "#f8f0ff" },
    legendary: { name: "🏆 Legendarische Recepten", color: "#FF8C00", bgColor: "#fff8f0" },
    mythical: { name: "✨ Mythische Recepten", color: "#DC143C", bgColor: "#fff0f0" },
  };

  // Display recipes by rarity
  Object.entries(groupedRecipes).forEach(([rarity, recipes]) => {
    if (recipes.length === 0) return;

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
    recipesContainer.appendChild(rarityHeader);

    // Add recipes in this rarity
    recipes.forEach(({ iceCreamType, iceCream }) => {
      const canMake = canCraftIceCream(iceCreamType);
      const disabledClass = canMake ? "" : " disabled";

      const recipeText = Object.entries(iceCream.recipe)
        .map(([fruit, amount]) => `${amount}x ${crops[fruit].emoji} ${crops[fruit].name}`)
        .join(" + ");

      const profitInfo = calculateIceCreamProfit(iceCreamType);

      const recipeItem = document.createElement("div");
      recipeItem.className = `recipe-item${disabledClass}`;
      recipeItem.style.cssText = `
        border-left: 3px solid ${config.color};
        background: ${canMake ? config.bgColor : "#f5f5f5"};
      `;

      recipeItem.innerHTML = `
        <div class="recipe-icon" style="font-size: 1.5em;">${iceCream.emoji}</div>
        <div class="recipe-details">
          <div class="recipe-name" style="color: ${config.color}; font-weight: bold;">
            ${iceCream.name}
          </div>
          <div class="recipe-ingredients" style="font-size: 0.9em;">
            Recept: ${recipeText}
          </div>
          <div class="recipe-profit" style="color: #2e8b57; font-size: 0.9em;">
            Verkoop voor: €${iceCream.sellPrice} ${profitInfo}
          </div>
          ${
            iceCream.description
              ? `<div class="recipe-description" style="font-size: 0.8em; color: #666; font-style: italic;">${iceCream.description}</div>`
              : ""
          }
        </div>
        <button class="make-button ${disabledClass}" 
                onclick="makeIceCreamFromMachine('${iceCreamType}')"
                ${!canMake ? "disabled" : ""}
                style="background: ${canMake ? config.color : "#ccc"};">
          ${!canMake ? "❌ Geen fruit" : "✨ Maak"}
        </button>
      `;
      recipesContainer.appendChild(recipeItem);
    });
  });

  if (recipesContainer.children.length === 0) {
    recipesContainer.innerHTML =
      '<div style="text-align: center; color: #666; padding: 20px;">Geen recepten beschikbaar</div>';
  }
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
  const profitText =
    profit > 0 ? `(+€${profit} winst!)` : profit < 0 ? `(-€${Math.abs(profit)} verlies)` : "(break-even)";

  return profitText;
}

// Make ice cream from machine
function makeIceCreamFromMachine(iceCreamType) {
  const success = craftIceCream(iceCreamType);
  if (success !== false) {
    updateIceCreamMachineModal(); // Refresh the modal display
  }
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
