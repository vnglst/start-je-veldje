// Limonade machine interaction functions

// Check if player can craft specific lemonade
function canCraftLemonade(lemonadeType) {
  const lemonade = lemonades[lemonadeType];
  if (!lemonade || !lemonade.canCraft) return false;

  // Check if player has all required ingredients
  for (const [fruit, amount] of Object.entries(lemonade.recipe)) {
    if (!gameState.fruits[fruit] || gameState.fruits[fruit] < amount) {
      return false;
    }
  }
  return true;
}

// Craft lemonade from fruits
function craftLemonade(lemonadeType) {
  const lemonade = lemonades[lemonadeType];
  if (!lemonade || !lemonade.canCraft) {
    showMessage("Deze limonade kan niet gemaakt worden! 🥤", "error");
    return false;
  }

  // Check if player has all required ingredients
  if (!canCraftLemonade(lemonadeType)) {
    const missingIngredients = [];
    Object.entries(lemonade.recipe).forEach(([fruit, amount]) => {
      const have = gameState.fruits[fruit] || 0;
      if (have < amount) {
        const needed = amount - have;
        missingIngredients.push(`${needed}x ${crops[fruit].emoji} ${crops[fruit].name}`);
      }
    });
    showMessage(`Je mist ingrediënten: ${missingIngredients.join(", ")} 🍓🍎`, "error");
    return false;
  }

  // Consume ingredients
  Object.entries(lemonade.recipe).forEach(([fruit, amount]) => {
    gameState.fruits[fruit] -= amount;
  });

  // Add lemonade to inventory
  if (!gameState.lemonade[lemonadeType]) {
    gameState.lemonade[lemonadeType] = 0;
  }
  gameState.lemonade[lemonadeType]++;

  const profitInfo = calculateLemonadeProfit(lemonadeType);
  showMessage(`🥤 Je hebt ${lemonade.name} gemaakt! Winst: €${profitInfo.profit} 💰`, "success");

  updateUI();
  return true;
}

// Calculate lemonade profit information
function calculateLemonadeProfit(lemonadeType) {
  const lemonade = lemonades[lemonadeType];
  if (!lemonade) return { cost: 0, sellPrice: 0, profit: 0 };

  // Calculate ingredient cost
  let ingredientCost = 0;
  Object.entries(lemonade.recipe).forEach(([fruit, amount]) => {
    const crop = crops[fruit];
    if (crop) {
      ingredientCost += crop.sellPrice * amount;
    }
  });

  return {
    cost: ingredientCost,
    sellPrice: lemonade.sellPrice,
    profit: lemonade.sellPrice - ingredientCost,
  };
}

// Open lemonade machine interaction modal
function interactWithLemonadeMachine() {
  // Check if player is at the correct position
  const lemonadeMachineX = gameState.lemonadeMachinePosition.x;
  const lemonadeMachineY = gameState.lemonadeMachinePosition.y;

  if (gameState.playerPosition.x !== lemonadeMachineX || gameState.playerPosition.y !== lemonadeMachineY) {
    showMessage("Je moet precies op de limonademachine staan om deze te gebruiken! 🥤", "error");
    return;
  }

  // Create modal overlay
  const modal = document.createElement("div");
  modal.className = "lemonade-machine-modal";
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: modalFadeIn 0.3s ease-out;
  `;

  const modalContent = `
    <div class="lemonade-machine-modal-content" style="
      background: linear-gradient(135deg, #fff8dc 0%, #f0e68c 100%);
      border: 3px solid #daa520;
      border-radius: 15px;
      max-width: 600px;
      width: 90vw;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      animation: modalSlideIn 0.3s ease-out;
    ">
      <div class="lemonade-machine-modal-header" style="
        background: linear-gradient(135deg, #daa520 0%, #b8860b 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 12px 12px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <div>
          <h2 style="margin: 0; font-size: 1.5em;">🥤 Limonade Machine</h2>
          <div style="font-size: 0.9em; margin-top: 5px; opacity: 0.9;">
            Maak verse drankjes van je gewassen!
          </div>
        </div>
        <button class="close-button" onclick="closeLemonadeMachineModal()" style="
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          font-size: 1.5em;
          cursor: pointer;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">✖️</button>
      </div>
      <div class="lemonade-machine-modal-body" style="padding: 20px;">
        <div class="lemonade-recipes" id="lemonadeRecipes">
          <!-- Lemonade recipes will be populated here -->
        </div>
      </div>
    </div>
  `;

  modal.innerHTML = modalContent;
  document.body.appendChild(modal);
  updateLemonadeMachineModal();
  addLemonadeMachineKeyListeners();
}

// Close lemonade machine modal
function closeLemonadeMachineModal() {
  const modal = document.querySelector(".lemonade-machine-modal");
  if (modal) {
    modal.remove();
  }
  document.removeEventListener("keydown", handleLemonadeMachineEscKey);
}

// Handle escape key for lemonade machine modal
function handleLemonadeMachineEscKey(event) {
  if (event.key === "Escape") {
    closeLemonadeMachineModal();
  }
}

// Add keyboard listeners for lemonade machine modal
function addLemonadeMachineKeyListeners() {
  document.addEventListener("keydown", handleLemonadeMachineEscKey);
}

// Update lemonade machine modal content
function updateLemonadeMachineModal() {
  const recipesContainer = document.getElementById("lemonadeRecipes");
  if (!recipesContainer) return;

  recipesContainer.innerHTML = "";

  // Group lemonades by rarity
  const groupedLemonades = {
    basic: [],
    rare: [],
    epic: [],
    legendary: [],
    mythical: [],
  };

  Object.entries(lemonades).forEach(([lemonadeType, lemonade]) => {
    if (lemonade.canCraft) {
      const rarity = lemonade.rarity || "basic";
      groupedLemonades[rarity].push({ lemonadeType, lemonade });
    }
  });

  // Rarity display configuration
  const rarityConfig = {
    basic: { name: "🥤 Basis Drankjes", color: "#4169E1", bgColor: "#f0f4ff" },
    rare: { name: "⭐ Speciale Mix", color: "#8A2BE2", bgColor: "#f8f0ff" },
    epic: { name: "💎 Premium Drankjes", color: "#FF8C00", bgColor: "#fff8f0" },
    legendary: { name: "🏆 Legendarische Drankjes", color: "#DC143C", bgColor: "#fff0f0" },
    mythical: { name: "✨ Mythische Elixers", color: "#9932CC", bgColor: "#f8f0ff" },
  };

  // Display lemonades by rarity
  Object.entries(groupedLemonades).forEach(([rarity, lemonadeList]) => {
    if (lemonadeList.length === 0) return;

    const config = rarityConfig[rarity];

    // Add rarity header
    const rarityHeader = document.createElement("div");
    rarityHeader.style.cssText = `
      background: ${config.bgColor};
      color: ${config.color};
      padding: 10px;
      margin: 15px 0 10px 0;
      border-left: 4px solid ${config.color};
      font-weight: bold;
      border-radius: 4px;
      font-size: 1.1em;
    `;
    rarityHeader.textContent = config.name;
    recipesContainer.appendChild(rarityHeader);

    // Add lemonade recipes in this rarity
    lemonadeList.forEach(({ lemonadeType, lemonade }) => {
      const recipeDiv = document.createElement("div");
      const canCraft = canCraftLemonade(lemonadeType);
      const profitInfo = calculateLemonadeProfit(lemonadeType);

      // Create recipe ingredients text
      const ingredientsList = Object.entries(lemonade.recipe)
        .map(([fruit, amount]) => {
          const crop = crops[fruit];
          const have = gameState.fruits[fruit] || 0;
          const hasEnough = have >= amount;
          return `${crop.emoji} ${amount}x ${crop.name} ${hasEnough ? "✅" : `❌ (heb ${have})`}`;
        })
        .join("<br>");

      recipeDiv.style.cssText = `
        display: flex;
        align-items: center;
        padding: 15px;
        margin: 8px 0;
        background: ${canCraft ? "rgba(255, 255, 255, 0.9)" : "rgba(200, 200, 200, 0.5)"};
        border: 2px solid ${canCraft ? config.color : "#ccc"};
        border-radius: 10px;
        ${canCraft ? "cursor: pointer;" : "cursor: not-allowed;"}
        transition: all 0.3s ease;
        opacity: ${canCraft ? "1" : "0.6"};
      `;

      if (canCraft) {
        recipeDiv.addEventListener("mouseenter", () => {
          recipeDiv.style.transform = "translateY(-2px)";
          recipeDiv.style.boxShadow = `0 4px 12px ${config.color}30`;
        });
        recipeDiv.addEventListener("mouseleave", () => {
          recipeDiv.style.transform = "translateY(0)";
          recipeDiv.style.boxShadow = "none";
        });
      }

      recipeDiv.innerHTML = `
        <div style="font-size: 2em; margin-right: 15px; min-width: 60px; text-align: center;">
          ${lemonade.emoji}
        </div>
        <div style="flex: 1;">
          <div style="font-weight: bold; font-size: 1.2em; color: ${config.color}; margin-bottom: 5px;">
            ${lemonade.name}
          </div>
          <div style="color: #666; font-size: 0.9em; margin-bottom: 8px;">
            ${lemonade.description}
          </div>
          <div style="font-size: 0.9em; line-height: 1.4;">
            <strong>Ingrediënten:</strong><br>
            ${ingredientsList}
          </div>
          <div style="margin-top: 8px; display: flex; gap: 15px; font-size: 0.9em;">
            <span style="color: #2e8b57; font-weight: bold;">💰 Winst: €${profitInfo.profit}</span>
            <span style="color: #ff6347;">😊 Geluk: +${lemonade.happiness}</span>
          </div>
        </div>
        <div style="margin-left: 15px;">
          <button onclick="craftLemonade('${lemonadeType}')" 
                  ${canCraft ? "" : "disabled"} 
                  style="
                    background: ${canCraft ? config.color : "#ccc"};
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 8px;
                    cursor: ${canCraft ? "pointer" : "not-allowed"};
                    font-weight: bold;
                    font-size: 1em;
                    transition: background 0.3s ease;
                  "
                  onmouseover="if(!this.disabled) this.style.opacity='0.9'"
                  onmouseout="if(!this.disabled) this.style.opacity='1'">
            🥤 Maak
          </button>
        </div>
      `;

      if (canCraft) {
        recipeDiv.addEventListener("click", (e) => {
          if (e.target.tagName !== "BUTTON") {
            craftLemonade(lemonadeType);
          }
        });
      }

      recipesContainer.appendChild(recipeDiv);
    });
  });

  if (Object.values(groupedLemonades).every((arr) => arr.length === 0)) {
    recipesContainer.innerHTML = `
      <div style="text-align: center; color: #666; padding: 40px; line-height: 1.6;">
        <div style="font-size: 3em; margin-bottom: 15px;">🌱</div>
        <div style="font-weight: bold; margin-bottom: 10px;">Nog geen limonade recepten beschikbaar!</div>
        <div>Kweek fruit en groenten om verse drankjes te maken.</div>
        <div style="margin-top: 10px; font-size: 0.9em; color: #888;">
          💡 Combineer verschillende gewassen voor speciale recepten!
        </div>
      </div>
    `;
  }
}

// Make functions globally available
window.interactWithLemonadeMachine = interactWithLemonadeMachine;
window.closeLemonadeMachineModal = closeLemonadeMachineModal;
window.craftLemonade = craftLemonade;
