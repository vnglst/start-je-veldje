// UI Update functions
function updateUI() {
  document.getElementById("money").textContent = gameState.money;
  document.getElementById("seedCount").textContent = Object.values(gameState.seeds).reduce((a, b) => a + b, 0);
  document.getElementById("fruitCount").textContent = Object.values(gameState.fruits).reduce((a, b) => a + b, 0);
  document.getElementById("water").textContent = gameState.water;
  document.getElementById("day").textContent = gameState.day;

  // Update season with emoji and apply seasonal theme
  const seasonEmojis = {
    Lente: "🌸",
    Zomer: "☀️",
    Herfst: "🍂",
    Winter: "❄️",
  };

  document.getElementById("season").textContent = gameState.season;

  // Apply seasonal body class for visual themes
  document.body.className = gameState.season.toLowerCase();

  // Update season emoji in stats
  const seasonStat = document.querySelector("#season").parentElement;
  seasonStat.innerHTML = `${seasonEmojis[gameState.season]} <span id="season">${gameState.season}</span>`;

  // Update watering button
  const wateringButton = document.getElementById("wateringButton");
  if (wateringButton) {
    wateringButton.textContent = wateringMode ? "🚿 Gieter Mode (Aan)" : "🚿 Gieter Mode (Uit)";
    wateringButton.style.background = wateringMode ? "#32CD32" : "#00BFFF";
  }

  updateInventory();
  updateGameMap();
  updateShopDisplay();
  updateSeasonInfo();
  updateGameStats();
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

// Update game map display
function updateGameMap() {
  const gameMap = document.getElementById("gameMap");

  // Clear and rebuild the entire map
  gameMap.innerHTML = "";

  // Create 8x6 grid (farm is 6x4, plus space for well and pathways)
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 8; x++) {
      const tile = document.createElement("div");
      tile.className = "map-tile";
      tile.id = `tile-${x}-${y}`;

      // Check if this is a farm plot (center 6x4 area)
      if (x >= 1 && x <= 6 && y >= 1 && y <= 4) {
        const farmIndex = (y - 1) * 6 + (x - 1);
        tile.classList.add("farm-plot");
        tile.id = `plot-${farmIndex}`;

        // Update farm plot content
        updateFarmPlot(tile, farmIndex);
      }
      // Check if this is the well position
      else if (x === gameState.wellPosition.x && y === gameState.wellPosition.y) {
        tile.classList.add("well");
        tile.innerHTML = "🏗️";
        tile.title = "Put - Klik om water te halen";
        tile.onclick = () => getWaterFromWell();
      }
      // Regular pathway tiles
      else {
        tile.innerHTML = "";
      }

      // Add player if on this tile
      if (x === gameState.playerPosition.x && y === gameState.playerPosition.y) {
        const player = document.createElement("div");
        player.className = "player";
        player.innerHTML = "🧑‍🌾";
        tile.appendChild(player);
      }

      gameMap.appendChild(tile);
    }
  }
}

// Update individual farm plot
function updateFarmPlot(plotElement, index) {
  const plot = gameState.farm[index];
  plotElement.innerHTML = "";

  if (plot && plot.planted && plot.cropType) {
    if (plot.grown) {
      plotElement.classList.add("grown");
      plotElement.innerHTML = crops[plot.cropType].emoji;
      plotElement.onclick = () => harvestCrop(index);
    } else {
      const actualGrowthDays = plot.growthDays || 0;
      const daysLeft = crops[plot.cropType].growthTime - actualGrowthDays;
      const needsWater = !plot.watered || plot.lastWateredDay < gameState.day;
      const daysWithoutWater = plot.daysWithoutWater || 0;

      plotElement.classList.add("planted");

      // Different visual states based on water status
      if (daysWithoutWater >= 1) {
        plotElement.classList.add("critical");
        plotElement.innerHTML = "💀"; // Skull for plants about to die
      } else if (needsWater && gameState.day > plot.plantedDay + 1) {
        plotElement.classList.add("needs-water");
        plotElement.innerHTML = "🥀"; // Wilted plant emoji
      } else if (needsWater) {
        plotElement.classList.add("needs-water");
        plotElement.innerHTML = "🌱";
      } else {
        plotElement.innerHTML = "🌱";
        plotElement.style.filter = "none";
        plotElement.style.border = "2px solid #654321";
      }

      // Add growth timer
      if (daysLeft > 0) {
        const timer = document.createElement("div");
        timer.className = "growth-timer";

        if (daysWithoutWater >= 1) {
          timer.style.background = "#8B0000";
          timer.style.color = "#fff";
          timer.textContent = "💀";
          timer.title = "KRITIEK! Plant gaat morgen dood zonder water!";
        } else if (needsWater) {
          timer.style.background = "#FF6347";
          timer.textContent = "💧";
          timer.title = "Heeft water nodig!";
        } else {
          timer.textContent = daysLeft + "d";
          timer.title = `Nog ${daysLeft} dag(en) groei nodig (groeidagen: ${actualGrowthDays})`;
        }
        plotElement.appendChild(timer);
      }

      plotElement.onclick = () => {
        if (isPlayerNearPlot(index)) {
          if (wateringMode) {
            waterPlant(index);
          } else {
            plantSeed(index);
          }
        } else {
          showMessage("Je bent te ver weg! Loop dichter naar het veldje.", "error");
        }
      };
    }
  } else {
    plotElement.onclick = () => {
      if (isPlayerNearPlot(index)) {
        plantSeed(index);
      } else {
        showMessage("Je bent te ver weg! Loop dichter naar het veldje.", "error");
      }
    };
  }
}

// Update shop display based on current season
function updateShopDisplay() {
  const shopSection = document.querySelector(".shop-section");
  let shopHTML = '<h3 class="section-title">🏪 Winkel</h3>';

  // Add crop seeds based on seasonal availability
  Object.entries(crops).forEach(([cropType, crop]) => {
    const isAvailable = crop.seasons.includes(gameState.season);
    const disabledClass = isAvailable ? "" : " disabled";
    const opacity = isAvailable ? "1" : "0.5";

    shopHTML += `
      <div class="shop-item${disabledClass}" onclick="${
      isAvailable ? `buySeeds('${cropType}')` : ""
    }" style="opacity: ${opacity}">
        <div class="item-info">
          <span class="item-emoji">${crop.emoji}</span>
          <span class="item-name">${crop.name} Zaad${!isAvailable ? " (Niet beschikbaar)" : ""}</span>
        </div>
        <div class="item-price">€${crop.seedPrice}</div>
      </div>
    `;
  });

  // Add note about the well instead of selling water
  shopHTML += `
    <div style="padding: 10px; background: #e6f3ff; border-radius: 8px; margin-top: 10px; text-align: center; color: #2e8b57; font-style: italic;">
      💧 Voor water: loop naar de put! 🏗️
    </div>
  `;

  shopSection.innerHTML = shopHTML;
}

// Update seasonal information display
function updateSeasonInfo() {
  const seasonInfo = document.getElementById("seasonInfo");
  const currentDay = gameState.day;
  const dayInSeason = ((currentDay - 1) % 30) + 1;
  const daysLeft = 30 - dayInSeason;

  const seasonDescriptions = {
    Lente: {
      description: "🌸 Lente: Gewassen groeien 20% sneller!",
      tips: "Perfect voor wortels en appels.",
    },
    Zomer: {
      description: "☀️ Zomer: Warm weer, 10% snellere groei.",
      tips: "Ideaal voor maïs. Alle gewassen groeien goed.",
    },
    Herfst: {
      description: "🍂 Herfst: Normale groeisnelheid.",
      tips: "Laatste kans voor wortels en appels.",
    },
    Winter: {
      description: "❄️ Winter: Gewassen groeien 50% langzamer!",
      tips: "Winterbessen zijn nu beschikbaar - duur maar waardevol!",
    },
  };

  const info = seasonDescriptions[gameState.season];

  seasonInfo.innerHTML = `
    <div style="margin-bottom: 8px;">${info.description}</div>
    <div style="margin-bottom: 8px; font-style: italic;">${info.tips}</div>
    <div style="color: #888; font-size: 0.8em;">
      Dag ${dayInSeason}/30 • ${daysLeft} dagen tot volgend seizoen
    </div>
  `;
}

// Update game statistics display
function updateGameStats() {
  const gameStats = document.getElementById("gameStats");
  const totalSeeds = Object.values(gameState.seeds).reduce((a, b) => a + b, 0);
  const totalFruits = Object.values(gameState.fruits).reduce((a, b) => a + b, 0);
  const plantsOnFarm = gameState.farm.filter((plot) => plot && plot.planted).length;
  const grownCrops = gameState.farm.filter((plot) => plot && plot.grown).length;
  const year = Math.floor((gameState.day - 1) / 120) + 1;
  const totalPlots = 24; // 6x4 farm grid

  gameStats.innerHTML = `
    <div style="margin-bottom: 8px;">🗓️ Jaar ${year} • Dag ${gameState.day}</div>
    <div style="margin-bottom: 8px;">🌱 ${plantsOnFarm}/${totalPlots} veldjes beplant</div>
    <div style="margin-bottom: 8px;">🎯 ${grownCrops} gewassen klaar voor oogst</div>
    <div style="margin-bottom: 8px;">📦 ${totalSeeds + totalFruits} items in inventaris</div>
  `;
}

// Show message function
function showMessage(text, type) {
  const messageArea = document.getElementById("messageArea");
  messageArea.innerHTML = `<div class="message ${type}">${text}</div>`;

  setTimeout(() => {
    messageArea.innerHTML = "";
  }, 3000);
}
