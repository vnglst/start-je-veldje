// UI Update functions
function updateUI() {
  // Update farm title based on location
  const farmTitle = document.getElementById("farmTitle");
  if (farmTitle) {
    if (gameState.inGreenhouse) {
      farmTitle.innerHTML = "🏡 Je Kas";
      farmTitle.style.color = "#2e8b57";
    } else {
      farmTitle.innerHTML = "🚜 Je Boerderij";
      farmTitle.style.color = "#8b4513";
    }
  }

  // Safe element updates with null checks
  const moneyEl = document.getElementById("money");
  if (moneyEl) moneyEl.textContent = gameState.money;

  const seedCountEl = document.getElementById("seedCount");
  if (seedCountEl) seedCountEl.textContent = Object.values(gameState.seeds).reduce((a, b) => a + b, 0);

  const fruitCountEl = document.getElementById("fruitCount");
  if (fruitCountEl) fruitCountEl.textContent = Object.values(gameState.fruits).reduce((a, b) => a + b, 0);

  const waterEl = document.getElementById("water");
  if (waterEl) waterEl.textContent = gameState.water;

  const dayEl = document.getElementById("day");
  if (dayEl) dayEl.textContent = gameState.day;

  // Update season with emoji and apply seasonal theme
  const seasonEmojis = {
    Lente: "🌸",
    Zomer: "☀️",
    Herfst: "🍂",
    Winter: "❄️",
  };

  const seasonEl = document.getElementById("season");
  if (seasonEl) seasonEl.textContent = gameState.season;

  // Apply seasonal body class for visual themes
  document.body.className = gameState.season.toLowerCase();

  // Update season emoji in stats
  const seasonStat = document.querySelector("#season");
  if (seasonStat && seasonStat.parentElement) {
    seasonStat.parentElement.innerHTML = `${seasonEmojis[gameState.season]} <span id="season">${
      gameState.season
    }</span>`;
  }

  // Update greenhouse status
  const greenhouseStat = document.getElementById("greenhouseStat");
  if (greenhouseStat) {
    if (gameState.greenhouse) {
      greenhouseStat.style.display = "block";
    } else {
      greenhouseStat.style.display = "none";
    }
  }

  // Update greenhouse button visibility
  const greenhouseButton = document.getElementById("greenhouseButton");
  if (greenhouseButton) {
    if (gameState.greenhouse) {
      greenhouseButton.style.display = "block";
    } else {
      greenhouseButton.style.display = "none";
    }
  }

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
  // updateShopDisplay(); // Disabled - element doesn't exist
  updateSeasonInfo();
  // updateGameStats(); // Disabled - element doesn't exist
}

// Update inventory display
function updateInventory() {
  const inventoryList = document.getElementById("inventoryList");
  if (!inventoryList) {
    console.warn("inventoryList element not found");
    return;
  }

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
  if (!gameMap) {
    console.warn("gameMap element not found");
    return;
  }

  // Clear and rebuild the entire map
  gameMap.innerHTML = "";

  if (gameState.inGreenhouse) {
    // Render greenhouse interior (6x4 grid)
    gameMap.classList.add("greenhouse-interior");
    renderGreenhouseMap(gameMap);
  } else {
    // Render regular farm map (8x6 grid)
    gameMap.classList.remove("greenhouse-interior");
    renderRegularMap(gameMap);
  }
}

// Render regular farm map
function renderRegularMap(gameMap) {
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
      // Check if this is the greenhouse position
      else if (x === gameState.greenhousePosition.x && y === gameState.greenhousePosition.y) {
        tile.classList.add("greenhouse");
        if (gameState.greenhouse) {
          tile.innerHTML = "🏡";
          tile.title = "Kas - Klik om binnen te gaan!";
          tile.onclick = () => interactWithGreenhouse();
        } else {
          tile.innerHTML = "🏗️";
          tile.title = "Bouwplaats - Koop een kas in de winkel voor €1000";
          tile.onclick = () => showMessage("Je hebt nog geen kas! Koop er een in de winkel voor €1000. 🏪", "error");
        }
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

// Render greenhouse interior map
function renderGreenhouseMap(gameMap) {
  // Create 8x6 grid for greenhouse interior (same size as regular farm)
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 8; x++) {
      const tile = document.createElement("div");
      tile.className = "map-tile greenhouse-tile";
      tile.id = `greenhouse-tile-${x}-${y}`;

      // Exit at top left corner
      if (x === 0 && y === 0) {
        tile.classList.add("greenhouse-exit");
        tile.innerHTML = "🚪";
        tile.title = "Uitgang - Klik om de kas te verlaten";
        tile.onclick = () => interactWithGreenhouse();
      }
      // Farm plots in the greenhouse (center 6x4 area, 24 total plots)
      else if (x >= 1 && x <= 6 && y >= 1 && y <= 4) {
        const farmIndex = (y - 1) * 6 + (x - 1);
        tile.classList.add("greenhouse-plot");
        tile.id = `greenhouse-plot-${farmIndex}`;

        // Update greenhouse farm plot content
        updateGreenhousePlot(tile, farmIndex);
      }
      // Regular greenhouse interior tiles
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

// Update greenhouse farm plot content
function updateGreenhousePlot(tile, plotIndex) {
  const plot = gameState.greenhouseFarm[plotIndex];
  tile.innerHTML = "";

  // Add plot click handlers
  tile.onclick = (e) => {
    e.stopPropagation();
    if (isPlayerNearPlot(plotIndex)) {
      if (wateringMode) {
        waterPlant(plotIndex);
      } else if (infoMode) {
        showPlantInfo(plotIndex);
      } else {
        plantSeed(plotIndex);
      }
    } else {
      showMessage("Je bent te ver van dit veldje! Loop er naartoe. 🏃‍♂️", "error");
    }
  };

  if (plot.planted) {
    const crop = crops[plot.cropType];
    let status = "";

    if (plot.grown) {
      status = "grown";
      tile.innerHTML = crop.emoji;
      tile.classList.add("grown");
      tile.title = `${crop.name} - Klaar voor oogst! Klik om te oogsten.`;
    } else {
      const needsWater = !plot.watered || plot.lastWateredDay < gameState.day;
      const daysWithoutWater = plot.daysWithoutWater || 0;

      if (daysWithoutWater >= 1) {
        status = "dying";
        tile.classList.add("dying");
        tile.innerHTML = "💀";
        tile.title = `${crop.name} - Kritiek! Plant gaat morgen dood zonder water!`;
      } else if (needsWater) {
        status = "needs-water";
        tile.classList.add("needs-water");
        tile.innerHTML = "🌱";
        tile.title = `${crop.name} - Heeft water nodig!`;
      } else {
        status = "growing";
        tile.classList.add("growing");
        tile.innerHTML = "🌿";
        tile.title = `${crop.name} - Groeit goed! Nog ${Math.ceil(crop.growthTime - (plot.growthDays || 0))} dagen.`;
      }
    }
  } else {
    tile.innerHTML = "🟫";
    tile.title = "Leeg veldje - Klik om een zaad te planten";
    tile.classList.add("empty");
  }

  // Check if player can reach this plot
  if (!isPlayerNearPlot(plotIndex)) {
    tile.classList.add("unreachable");
  }
}

// Update shop display based on current season
function updateShopDisplay() {
  // This function is disabled since .shop-section element doesn't exist in current HTML
  // Keeping function for potential future use
  return;
}

// Update seasonal information display
function updateSeasonInfo() {
  const seasonInfo = document.getElementById("seasonInfo");
  if (!seasonInfo) {
    console.warn("seasonInfo element not found");
    return;
  }

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
  // This function is disabled since gameStats element doesn't exist in current HTML
  // Keeping function for potential future use
  return;
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
  if (!messageArea) {
    console.warn("messageArea element not found");
    return;
  }

  // Convert newlines to HTML breaks for multi-line messages
  const formattedText = text.replace(/\n/g, "<br>");
  messageArea.innerHTML = `<div class="message ${type}">${formattedText}</div>`;

  // Longer timeout for info messages since they have more content
  const timeout = type === "info" ? 6000 : 3000;
  setTimeout(() => {
    if (messageArea) {
      messageArea.innerHTML = "";
    }
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
