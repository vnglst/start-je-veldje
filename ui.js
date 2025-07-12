// UI Update functions
function updateUI() {
  document.getElementById("money").textContent = gameState.money;
  document.getElementById("seedCount").textContent = Object.values(gameState.seeds).reduce((a, b) => a + b, 0);
  document.getElementById("fruitCount").textContent = Object.values(gameState.fruits).reduce((a, b) => a + b, 0);
  document.getElementById("water").textContent = gameState.water;
  document.getElementById("day").textContent = gameState.day;
  document.getElementById("season").textContent = gameState.season;

  // Update watering button
  const wateringButton = document.getElementById("wateringButton");
  if (wateringButton) {
    wateringButton.textContent = wateringMode ? "🚿 Gieter Mode (Aan)" : "🚿 Gieter Mode (Uit)";
    wateringButton.style.background = wateringMode ? "#32CD32" : "#00BFFF";
  }

  updateInventory();
  updateFarmDisplay();
}

// Update inventory display
function updateInventory() {
  const inventoryList = document.getElementById("inventoryList");
  inventoryList.innerHTML = "";

  // Show seeds
  for (const [type, count] of Object.entries(gameState.seeds)) {
    if (count > 0) {
      const item = document.createElement("div");
      item.className = "inventory-item";
      item.innerHTML = `
        <div class="item-info">
          <span class="item-emoji">${crops[type].emoji}</span>
          <span class="item-name">${crops[type].name} Zaad (${count})</span>
        </div>
      `;
      inventoryList.appendChild(item);
    }
  }

  // Show fruits
  for (const [type, count] of Object.entries(gameState.fruits)) {
    if (count > 0) {
      const item = document.createElement("div");
      item.className = "inventory-item";
      item.innerHTML = `
        <div class="item-info">
          <span class="item-emoji">${crops[type].emoji}</span>
          <span class="item-name">${crops[type].name} (${count})</span>
        </div>
        <button class="button sell-button" onclick="sellFruit('${type}')">
          Verkoop €${crops[type].fruitPrice}
        </button>
      `;
      inventoryList.appendChild(item);
    }
  }
}

// Update farm display
function updateFarmDisplay() {
  gameState.farm.forEach((plot, index) => {
    const plotElement = document.getElementById(`plot-${index}`);
    plotElement.innerHTML = "";

    if (plot.planted && plot.cropType) {
      if (plot.grown) {
        plotElement.className = "farm-plot grown";
        plotElement.innerHTML = crops[plot.cropType].emoji;
        plotElement.onclick = () => harvestCrop(index);
      } else {
        plotElement.className = "farm-plot planted";
        plotElement.innerHTML = "🌱";

        const daysGrown = gameState.day - plot.plantedDay;
        const daysLeft = crops[plot.cropType].growthTime - daysGrown;
        const needsWater = !plot.watered || plot.lastWateredDay < gameState.day;

        if (needsWater) {
          plotElement.style.filter = "brightness(0.7)";
          plotElement.style.border = "2px solid #CD853F";
        } else {
          plotElement.style.filter = "none";
          plotElement.style.border = "2px solid #654321";
        }

        if (daysLeft > 0) {
          const timer = document.createElement("div");
          timer.className = "growth-timer";
          timer.textContent = daysLeft + "d";
          if (needsWater) {
            timer.style.background = "#FF6347";
            timer.textContent = "💧";
          }
          plotElement.appendChild(timer);
        } else if (daysGrown >= crops[plot.cropType].growthTime && !needsWater) {
          // Crop is ready to be grown (only if enough days have passed AND watered)
          plot.grown = true;
        }

        plotElement.onclick = () => {
          if (wateringMode) {
            waterPlant(index);
          } else {
            plantSeed(index);
          }
        };
      }
    } else {
      plotElement.className = "farm-plot";
      plotElement.style.filter = "none";
      plotElement.style.border = "2px solid #654321";
      plotElement.onclick = () => plantSeed(index);
    }
  });
}

// Show message function
function showMessage(text, type) {
  const messageArea = document.getElementById("messageArea");
  messageArea.innerHTML = `<div class="message ${type}">${text}</div>`;

  setTimeout(() => {
    messageArea.innerHTML = "";
  }, 3000);
}
