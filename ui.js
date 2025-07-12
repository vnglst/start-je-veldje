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

  // Update tool buttons
  const wateringButton = document.getElementById("wateringButton");
  if (wateringButton) {
    wateringButton.textContent = wateringMode ? "🚿 Gieter ✓" : "🚿 Gieter";
    wateringButton.classList.toggle("active", wateringMode);
  }

  // Update info button
  const infoButton = document.getElementById("infoButton");
  if (infoButton) {
    infoButton.textContent = infoMode ? "🔍 Info ✓" : "🔍 Info";
    infoButton.classList.toggle("active", infoMode);
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
  const seedItems = [];
  for (const [type, count] of Object.entries(gameState.seeds)) {
    if (count > 0) {
      seedItems.push(`${crops[type].emoji} ${crops[type].name} Zaad (${count})`);
    }
  }

  // Show fruits
  const fruitItems = [];
  for (const [type, count] of Object.entries(gameState.fruits)) {
    if (count > 0) {
      fruitItems.push({ type, count, name: crops[type].name, emoji: crops[type].emoji, price: crops[type].fruitPrice });
    }
  }

  // Create compact inventory display
  if (seedItems.length > 0) {
    const seedSection = document.createElement("div");
    seedSection.className = "inventory-section";
    seedSection.innerHTML = `
      <h4 style="color: #2e8b57; margin-bottom: 8px; font-size: 0.9em;">🌱 Zaden</h4>
      <div style="font-size: 0.8em; line-height: 1.3;">
        ${seedItems.join("<br>")}
      </div>
    `;
    inventoryList.appendChild(seedSection);
  }

  if (fruitItems.length > 0) {
    const fruitSection = document.createElement("div");
    fruitSection.className = "inventory-section";
    fruitSection.style.marginTop = "15px";

    let fruitHtml = `<h4 style="color: #2e8b57; margin-bottom: 8px; font-size: 0.9em;">🍎 Fruit</h4>`;

    fruitItems.forEach((item) => {
      fruitHtml += `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; font-size: 0.8em;">
          <span>${item.emoji} ${item.name} (${item.count})</span>
          <button class="sell-btn" onclick="sellFruit('${item.type}')" style="padding: 2px 6px; font-size: 0.7em; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
            €${item.price}
          </button>
        </div>
      `;
    });

    fruitSection.innerHTML = fruitHtml;
    inventoryList.appendChild(fruitSection);
  }

  if (seedItems.length === 0 && fruitItems.length === 0) {
    inventoryList.innerHTML =
      '<div style="text-align: center; color: #666; font-style: italic; padding: 20px;">Geen items in inventaris</div>';
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
      // Check if this is the shop position
      else if (x === gameState.shopPosition.x && y === gameState.shopPosition.y) {
        tile.classList.add("shop");
        tile.innerHTML = "🏪";
        tile.title = "Winkel - Klik om te winkelen";
        tile.onclick = () => interactWithShop();
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
      plotElement.title = `${crops[plot.cropType].name} - Klaar voor oogst! Info mode voor details`;
      plotElement.onclick = (event) => {
        if (infoMode || event.shiftKey) {
          showPlantInfo(index);
        } else {
          harvestCrop(index);
        }
      };
    } else {
      const actualGrowthDays = plot.growthDays || 0;
      const daysLeft = Math.max(0, Math.ceil(crops[plot.cropType].growthTime - actualGrowthDays)); // Round up and prevent negative days
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

      // Add growth timer (only show if plant is still growing and has days left)
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
          timer.title = `Nog ${daysLeft} dag(en) groei nodig (groeidagen: ${Math.round(actualGrowthDays * 10) / 10})`;
        }
        plotElement.appendChild(timer);
      } else if (daysLeft <= 0 && !plot.grown) {
        // Plant should be ready but isn't marked as grown - show ready indicator
        const timer = document.createElement("div");
        timer.className = "growth-timer";
        timer.style.background = "#4CAF50";
        timer.style.color = "#fff";
        timer.textContent = "✓";
        timer.title = "Plant is klaar! Slaap om te laten groeien.";
        plotElement.appendChild(timer);
      }

      // Add tooltip for plant info
      plotElement.title = `${crops[plot.cropType].name} - Info mode voor plantinfo`;

      plotElement.onclick = (event) => {
        // Check if info mode is active or Shift key is held for plant info
        if (infoMode || event.shiftKey) {
          showPlantInfo(index);
          return;
        }

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

  // Replace shop items with direction to physical shop
  shopHTML += `
    <div style="padding: 15px; background: #fff8dc; border: 2px solid #daa520; border-radius: 8px; text-align: center; color: #2e8b57; line-height: 1.5;">
      <div style="font-size: 1.2em; margin-bottom: 10px;">🏪 Bezoek de Winkel!</div>
      <div style="margin-bottom: 10px; font-style: italic;">Loop naar de winkel (🏪) op de kaart om zaden te kopen.</div>
      <div style="font-size: 0.9em; color: #666;">💧 Voor water: ga naar de put 🏗️</div>
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
      tips: "Perfekt voor wortels, aardbeien, appels en aardappels.",
    },
    Zomer: {
      description: "☀️ Zomer: Warm weer, 10% snellere groei.",
      tips: "Ideaal voor tomaten, maïs, frambozen en aardbeien.",
    },
    Herfst: {
      description: "🍂 Herfst: Normale groeisnelheid.",
      tips: "Pompoenen, frambozen, wortels en appels groeien goed.",
    },
    Winter: {
      description: "❄️ Winter: Gewassen groeien 50% langzamer!",
      tips: "Alleen winterbessen en aardappels kunnen groeien.",
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

// Show available crops for current season
function showSeasonalCrops() {
  const currentSeasonCrops = Object.entries(crops)
    .filter(([_, crop]) => crop.seasons.includes(gameState.season))
    .sort((a, b) => a[1].seedPrice - b[1].seedPrice); // Sort by price

  let cropList = currentSeasonCrops
    .map(([_, crop]) => `${crop.emoji} ${crop.name} (€${crop.seedPrice}→€${crop.fruitPrice})`)
    .join(" • ");

  return cropList || "Geen gewassen beschikbaar";
}

// Show message function
function showMessage(text, type) {
  const messageArea = document.getElementById("messageArea");
  // Convert newlines to HTML breaks for multi-line messages
  const formattedText = text.replace(/\n/g, "<br>");
  messageArea.innerHTML = `<div class="message ${type}">${formattedText}</div>`;

  // Longer timeout for info messages since they have more content
  const timeout = type === "info" ? 6000 : 3000;
  setTimeout(() => {
    messageArea.innerHTML = "";
  }, timeout);
}

// Tab functionality for sidebar
function showTab(tabName) {
  // Hide all tab panels
  const panels = document.querySelectorAll(".tab-panel");
  panels.forEach((panel) => panel.classList.remove("active"));

  // Hide all tab buttons
  const buttons = document.querySelectorAll(".tab-button");
  buttons.forEach((button) => button.classList.remove("active"));

  // Show selected tab panel
  const targetPanel = document.getElementById(`tab-${tabName}`);
  if (targetPanel) {
    targetPanel.classList.add("active");
  }

  // Activate selected tab button
  const targetButton = event.target;
  if (targetButton) {
    targetButton.classList.add("active");
  }
}
