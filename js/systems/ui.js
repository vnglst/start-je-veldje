// UI Update functions
function updateUI() {
  // Update farm title based on location
  const farmTitle = document.getElementById("farmTitle");
  if (farmTitle) {
    if (gameState.inGreenhouse) {
      farmTitle.innerHTML = "🏡 Je Kas";
      farmTitle.style.color = "#2e8b57";
    } else if (gameState.inIceCreamShop) {
      farmTitle.innerHTML = "🍦 Je IJssalon";
      farmTitle.style.color = "#ff69b4";
    } else if (gameState.inGroenland) {
      farmTitle.innerHTML = "❄️ Groenland Avontuur";
      farmTitle.style.color = "#4682b4";
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

  const iceCreamCountEl = document.getElementById("iceCreamCount");
  if (iceCreamCountEl) iceCreamCountEl.textContent = Object.values(gameState.iceCream).reduce((a, b) => a + b, 0);

  const lemonadeCountEl = document.getElementById("lemonadeCount");
  if (lemonadeCountEl) lemonadeCountEl.textContent = Object.values(gameState.lemonade).reduce((a, b) => a + b, 0);

  const waterEl = document.getElementById("water");
  if (waterEl) waterEl.textContent = gameState.water;

  const dayEl = document.getElementById("day");
  if (dayEl) dayEl.textContent = gameState.day;

  // Update zwaard status
  const swordEl = document.getElementById("sword");
  if (swordEl) swordEl.textContent = gameState.heeftZwaard ? "⚔️" : "❌";

  // Update hitpoints
  const hitPointsEl = document.getElementById("hitPoints");
  if (hitPointsEl) {
    hitPointsEl.textContent = gameState.hitPoints;
    // Verander kleur als hitpoints laag zijn
    const hitPointsStat = document.getElementById("hitPointsStat");
    if (hitPointsStat) {
      if (gameState.hitPoints <= 30) {
        hitPointsStat.style.color = "#ff0000";
        hitPointsStat.style.animation = "heartbeat 0.5s ease-in-out infinite";
      } else if (gameState.hitPoints <= 60) {
        hitPointsStat.style.color = "#ff6600";
        hitPointsStat.style.animation = "heartbeat 1s ease-in-out infinite";
      } else {
        hitPointsStat.style.color = "#dc143c";
        hitPointsStat.style.animation = "heartbeat 2s ease-in-out infinite";
      }
    }
  }

  // Update tijd
  const timeEl = document.getElementById("time");
  if (timeEl) {
    const timeString = `${gameState.hour.toString().padStart(2, "0")}:${gameState.minute.toString().padStart(2, "0")}`;
    timeEl.textContent = timeString;
  }

  // Update dag/nacht cyclus CSS klassen
  updateDayNightCycle();

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

  // Klanten worden nu automatisch geupdate door de timer in main.js

  updateInventory();
  updateGameMap();
  // updateShopDisplay(); // Disabled - element doesn't exist
  updateSeasonInfo();
  // updateGameStats(); // Disabled - element doesn't exist
}

// Dag/nacht cyclus systeem
function updateDayNightCycle() {
  const body = document.body;

  // Verwijder alle tijd-gebaseerde klassen
  body.classList.remove("time-morning", "time-day", "time-evening", "time-night", "time-late-night");

  const hour = gameState.hour;

  if (hour >= 6 && hour < 9) {
    // Ochtend (6:00-9:00) - Zachte oranje gloed
    body.classList.add("time-morning");
  } else if (hour >= 9 && hour < 17) {
    // Dag (9:00-17:00) - Helder licht
    body.classList.add("time-day");
  } else if (hour >= 17 && hour < 20) {
    // Avond (17:00-20:00) - Warme oranje gloed
    body.classList.add("time-evening");
  } else if (hour >= 20 && hour < 24) {
    // Nacht (20:00-24:00) - Donkerblauw
    body.classList.add("time-night");
  } else {
    // Late nacht (0:00-6:00) - Zeer donker
    body.classList.add("time-late-night");
  }
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

  // Show ice creams
  const iceCreamItems = [];
  for (const [type, count] of Object.entries(gameState.iceCream)) {
    if (count > 0) {
      iceCreamItems.push({
        type,
        count,
        name: iceCreams[type].name,
        emoji: iceCreams[type].emoji,
        sellPrice: iceCreams[type].sellPrice,
      });
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
          <button class="sell-btn" onclick="speelGeldGeluid(); sellFruit('${item.type}')" style="padding: 2px 6px; font-size: 0.7em; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
            €${item.price}
          </button>
        </div>
      `;
    });

    fruitSection.innerHTML = fruitHtml;
    inventoryList.appendChild(fruitSection);
  }

  if (iceCreamItems.length > 0) {
    const iceCreamSection = document.createElement("div");
    iceCreamSection.className = "inventory-section";
    iceCreamSection.style.marginTop = "15px";

    let iceCreamHtml = `<h4 style="color: #2e8b57; margin-bottom: 8px; font-size: 0.9em;">🍦 IJsjes</h4>`;

    iceCreamItems.forEach((item) => {
      iceCreamHtml += `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; font-size: 0.8em;">
          <span>${item.emoji} ${item.name} (${item.count})</span>
          <button class="sell-ice-btn" onclick="showMessage('Ga naar de IJswinkel 🍦 om je ijs te verkopen!', 'info')" style="padding: 2px 6px; font-size: 0.7em; background: #4682b4; color: white; border: none; border-radius: 4px; cursor: pointer;">
            🍦 Winkel
          </button>
        </div>
      `;
    });

    iceCreamSection.innerHTML = iceCreamHtml;
    inventoryList.appendChild(iceCreamSection);
  }

  if (seedItems.length === 0 && fruitItems.length === 0 && iceCreamItems.length === 0) {
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
    gameMap.classList.remove("ice-cream-shop-interior", "groenland-interior");
    renderGreenhouseMap(gameMap);
  } else if (gameState.inIceCreamShop) {
    // Render ijssalon interior (8x6 grid)
    gameMap.classList.add("ice-cream-shop-interior");
    gameMap.classList.remove("greenhouse-interior", "groenland-interior");
    renderIceCreamShopMap(gameMap);
  } else if (gameState.inGroenland) {
    // Render Groenland adventure map (8x6 grid)
    gameMap.classList.add("groenland-interior");
    gameMap.classList.remove("greenhouse-interior", "ice-cream-shop-interior");
    renderGroenlandMap(gameMap);
  } else {
    // Render regular farm map (8x6 grid)
    gameMap.classList.remove("greenhouse-interior", "ice-cream-shop-interior", "groenland-interior");
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
      // Check if this is the ice cream shop position
      else if (x === gameState.iceCreamShopPosition.x && y === gameState.iceCreamShopPosition.y) {
        tile.classList.add("ice-cream-shop");
        tile.innerHTML = "🍦";
        tile.title = "IJswinkel - Klik om je ijs te verkopen";
        tile.onclick = () => interactWithIceCreamShop();
      }
      // Check if this is the ice cream machine position
      else if (x === gameState.iceCreamMachinePosition.x && y === gameState.iceCreamMachinePosition.y) {
        tile.classList.add("ice-cream-machine");
        tile.innerHTML = "🏭";
        tile.title = "IJsmachine - Klik om ijs te maken en verkopen";
        tile.onclick = () => interactWithIceCreamMachine();
      }
      // Check if this is the lemonade machine position
      else if (x === gameState.lemonadeMachinePosition.x && y === gameState.lemonadeMachinePosition.y) {
        tile.classList.add("lemonade-machine");
        tile.innerHTML = "🥤";
        tile.title = "Limonade Machine - Klik om verse drankjes te maken!";
        tile.onclick = () => interactWithLemonadeMachine();
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
      // Check if this is the Groenland portal position  
      else if (x === gameState.groenlandPortalPosition.x && y === gameState.groenlandPortalPosition.y) {
        tile.classList.add("groenland-portal");
        tile.innerHTML = "🌀";
        tile.title = "Portal naar Groenland - Klik om te reizen!";
        tile.onclick = () => interactWithGroenlandPortal();
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

  // Speel geluidseffect gebaseerd op type bericht
  if (window.speelSuccesGeluid && window.speelErrorGeluid && window.speelMeldingGeluid) {
    switch (type) {
      case "success":
        speelSuccesGeluid();
        break;
      case "error":
        speelErrorGeluid();
        break;
      case "info":
        speelMeldingGeluid();
        break;
    }
  }

  // Convert newlines to HTML breaks voor multi-line berichten
  const formattedText = text.replace(/\n/g, "<br>");
  // Verwijder oude message als die er nog is
  const oudeMsg = messageArea.querySelector(".message");
  if (oudeMsg) {
    oudeMsg.classList.remove("visible");
    setTimeout(() => {
      if (oudeMsg.parentNode) oudeMsg.parentNode.removeChild(oudeMsg);
    }, 400);
  }
  // Maak nieuwe message
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${type}`;
  msgDiv.innerHTML = formattedText;
  messageArea.appendChild(msgDiv);
  // Force reflow voor animatie
  void msgDiv.offsetWidth;
  msgDiv.classList.add("visible");
  // Timeout voor verdwijnen
  const timeout = type === "info" ? 9000 : 5000;
  setTimeout(() => {
    msgDiv.classList.remove("visible");
    setTimeout(() => {
      if (msgDiv.parentNode) msgDiv.parentNode.removeChild(msgDiv);
    }, 400);
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

// ========================
// INSTELLINGEN MODAL FUNCTIES
// ========================

// Open de instellingen modal
function openSettingsModal() {
  const modal = document.getElementById("settingsModal");
  if (modal) {
    modal.classList.add("show");
    // Speel menu open geluid
    if (window.speelMenuToggleGeluid) {
      speelMenuToggleGeluid(true);
    }
  }
}

// Sluit de instellingen modal
function closeSettingsModal() {
  const modal = document.getElementById("settingsModal");
  if (modal) {
    modal.classList.remove("show");
    // Speel menu sluit geluid
    if (window.speelMenuToggleGeluid) {
      speelMenuToggleGeluid(false);
    }
  }
}

// Event listener voor klikken buiten modal om te sluiten
document.addEventListener("click", function (event) {
  const modal = document.getElementById("settingsModal");
  if (modal && event.target === modal) {
    closeSettingsModal();
  }
});

// Event listener voor ESC toets om modal te sluiten
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeSettingsModal();
  }
});

// Maak modal functies globaal beschikbaar
window.openSettingsModal = openSettingsModal;
window.closeSettingsModal = closeSettingsModal;

// Render klanten in de ijssalon
function renderCustomers(gameMap) {
  if (!gameState.customers) return;

  gameState.customers.forEach((customer) => {
    const tile = document.getElementById(`tile-${customer.position.x}-${customer.position.y}`);
    if (tile) {
      // Voeg klant toe aan tile
      const customerDiv = document.createElement("div");
      customerDiv.className = "customer";
      customerDiv.innerHTML = customer.type.emoji;

      // Verschillende titel gebaseerd op state
      let title = `${customer.type.name}`;
      switch (customer.state) {
        case "entering":
          title += " komt binnen";
          break;
        case "waiting":
          title += ` wacht in de rij (${Math.ceil(customer.patience)} geduld)`;
          break;
        case "ordering":
          title += ` wil ${iceCreams[customer.wantedIceCream]?.name || "ijs"} bestellen`;
          break;
        case "moving_to_table":
          title += " loopt naar tafeltje";
          break;
        case "eating":
          title += " geniet van het ijs";
          break;
        case "leaving":
          title += " gaat weg";
          break;
      }

      customerDiv.title = title;
      tile.appendChild(customerDiv);
    }
  });
}

// Render ijssalon interior map
function renderIceCreamShopMap(gameMap) {
  // Create 8x6 grid for ijssalon interior
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 8; x++) {
      const tile = document.createElement("div");
      tile.className = "map-tile ice-cream-shop-tile";
      tile.id = `tile-${x}-${y}`;

      // Ijssalon layout:
      // (0,5) = Ingang/Uitgang
      // (6-7, 1-4) = Balie gebied met rand
      // (6, 1-4) = Balie rand (leeg ruimte)
      // (7, 2-3) = Eigenlijke balie (counter)
      // Meer tafels verspreid door de salon

      if (x === 0 && y === 5) {
        // Ingang/Uitgang
        tile.classList.add("ice-cream-shop-exit");
        tile.innerHTML = "🚪";
        tile.title = "Uitgang - Klik om te verlaten";
        tile.onclick = () => interactWithIceCreamShop();
      } else if (x === 5 && y >= 1 && y <= 4) {
        // Balie rand - lege ruimte rondom de balie (nu naar voren)
        tile.classList.add("ice-cream-shop-counter-area");
        tile.innerHTML = "";
        tile.title = "Ruimte voor de balie";
      } else if (x === 6 && y >= 2 && y <= 3) {
        // Eigenlijke balie (counter) - nu naar voren verplaatst
        tile.classList.add("ice-cream-shop-counter");

        // Verschillende emoji's voor de 2 delen van de balie
        if (x === 6 && y === 2) {
          tile.innerHTML = "🍦"; // Hoofdbalie boven
          tile.title = "Balie (Hoofdkassa) - Klik om ijs te verkopen";
        } else if (x === 6 && y === 3) {
          tile.innerHTML = "💰"; // Kassa onder
          tile.title = "Balie (Kassa) - Klik om ijs te verkopen";
        }

        tile.onclick = () => interactWithIceCreamShopCounter();
      } else if (x === 6 && (y === 1 || y === 4)) {
        // Balie uitbreidingen (boven en onder) - ook naar voren
        tile.classList.add("ice-cream-shop-counter-extension");
        if (y === 1) {
          tile.innerHTML = "🧊"; // IJsmachine boven
          tile.title = "Balie uitbreiding (IJsmachine)";
        } else {
          tile.innerHTML = "🥄"; // Gereedschap onder
          tile.title = "Balie uitbreiding (Gereedschap)";
        }
      } else if (x === 7 && y >= 1 && y <= 4) {
        // Ruimte achter de balie waar je kunt staan
        tile.classList.add("ice-cream-shop-work-area");
        tile.innerHTML = "";
        tile.title = "Werkruimte achter de balie";
      } else if ((x === 1 && y === 1) || (x === 5 && y === 1) || (x === 1 && y === 3)) {
        // Elegante tafelindeling - aangepast voor de lopende rij
        tile.classList.add("ice-cream-shop-table");

        if (x === 1 && y === 1) {
          // Klein tafeltje links-boven
          tile.innerHTML = "🍽️"; // Elegante tafel
          tile.title = "Tafeltje voor één persoon";
        } else if (x === 5 && y === 1) {
          // Tafeltje rechts-boven
          tile.innerHTML = "☕"; // Drankjes tafel
          tile.title = "Rustig drankjes tafeltje";
        } else if (x === 1 && y === 3) {
          // Klein tafeltje links-midden
          tile.innerHTML = "🧁"; // Dessert tafel
          tile.title = "Dessert hoekje";
        }
      } else if (x === 0 && y === 0) {
        // Hoek decoratie links-boven
        tile.classList.add("ice-cream-shop-decoration");
        tile.innerHTML = "🎨";
        tile.title = "Kunst aan de muur";
      } else if (x === 3 && y === 0) {
        // Decoratie midden-boven
        tile.classList.add("ice-cream-shop-decoration");
        tile.innerHTML = "💐";
        tile.title = "Elegante bloemen";
      } else if (x === 5 && y === 0) {
        // Decoratie rechts-boven
        tile.classList.add("ice-cream-shop-decoration");
        tile.innerHTML = "🖼️";
        tile.title = "IJssalon schilderij";
      } else if (x === 0 && y === 2) {
        // Decoratie links-midden
        tile.classList.add("ice-cream-shop-decoration");
        tile.innerHTML = "🪴";
        tile.title = "Mooie plant";
      } else if (x === 5 && y === 1) {
        // Decoratie tussen tafels en balie
        tile.classList.add("ice-cream-shop-decoration");
        tile.innerHTML = "🕯️";
        tile.title = "Sfeerverlichting";
      } else if (x === 2 && y === 4) {
        // Decoratie bij ingang
        tile.classList.add("ice-cream-shop-decoration");
        tile.innerHTML = "🌺";
        tile.title = "Welkom bloemen";
      } else if (x === 7 && y === 5) {
        // Hoek decoratie rechts-onder
        tile.classList.add("ice-cream-shop-decoration");
        tile.innerHTML = "🌟";
        tile.title = "Glitter decoratie";
      } else {
        // Vloer tegels
        tile.classList.add("ice-cream-shop-floor");
        tile.innerHTML = "";
      }

      gameMap.appendChild(tile);
    }
  }

  // Render klanten dynamisch
  renderCustomers(gameMap);

  // Add player if on this tile (na klanten zodat speler bovenop staat)
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 8; x++) {
      if (x === gameState.playerPosition.x && y === gameState.playerPosition.y) {
        const tile = document.getElementById(`tile-${x}-${y}`);
        if (tile) {
          const player = document.createElement("div");
          player.className = "player";
          player.innerHTML = "🧑‍🌾";
          tile.appendChild(player);
        }
      }
    }
  }
}

// Render Groenland adventure map
function renderGroenlandMap(gameMap) {
  // Create 8x6 grid voor Groenland
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 8; x++) {
      const tile = document.createElement("div");
      tile.className = "map-tile groenland-tile";
      tile.id = `groenland-tile-${x}-${y}`;

      // Groenland layout:
      // (0,0) = Portal terug
      // (1,1) = Waarschuwingsbord "Hier is een mijn, let op!"
      // (2-4, 2-3) = Mijn gebied met monsters
      // (4,3) = Schatkist met zwaard (midden van veldje)
      // (6,4) = Gat naar volgende level

      if (x === 0 && y === 0) {
        // Portal terug
        tile.classList.add("groenland-portal-exit");
        tile.innerHTML = "🌀";
        tile.title = "🏠 PORTAL TERUG NAAR BOERDERIJ 🏠 - Klik om terug te gaan!";
        tile.onclick = () => interactWithGroenlandPortal();
      } else if (x === 1 && y === 1) {
        // Waarschuwingsbord
        tile.classList.add("groenland-warning-sign");
        tile.innerHTML = "⚠️";
        tile.title = "Waarschuwingsbord: 'Hier is een mijn, let op!'";
        tile.onclick = () => showMessage("⚠️ WAARSCHUWING ⚠️\n\n'Hier is een mijn, let op! Monsters binnen!\n\nVind eerst het zwaard in de gouden schatkist in het midden van het veldje!\n\nMonsters vallen je aan als je te dichtbij komt zonder zwaard!' 👺⚔️", "warning");
      } else if (x >= 2 && x <= 4 && y >= 2 && y <= 3) {
        // Mijn gebied
        tile.classList.add("groenland-mine");
        tile.innerHTML = "⬛"; // Donkere mijn achtergrond
        tile.title = "Mijn - Hier zitten monsters!";
        
        // Check of er een monster op deze positie is
        const monster = gameState.monstersInMijn.find(m => m.alive && m.x === x && m.y === y);
        if (monster) {
          // Voeg monster toe
          const monsterDiv = document.createElement("div");
          monsterDiv.className = "monster";
          monsterDiv.innerHTML = "👺";
          monsterDiv.title = "Monster - Klik om te vechten (zwaard vereist)";
          tile.appendChild(monsterDiv);
        }
      } else if (x === 5 && y === 3) {
        // Schatkist (midden van veldje) - verplaatst naar meer zichtbare positie
        tile.classList.add("groenland-treasure");
        if (!gameState.heeftZwaard) {
          tile.innerHTML = "💎";
          tile.title = "✨ MAGISCHE SCHATKIST ✨ - Loop ernaartoe om het zwaard te pakken!";
          tile.onclick = () => checkTreasureChest();
        } else {
          tile.innerHTML = "📦";
          tile.title = "Lege schatkist - Je hebt het zwaard al!";
        }
      } else if (x === 6 && y === 4) {
        // Gat naar volgende level
        tile.classList.add("groenland-hole");
        tile.innerHTML = "🕳️";
        tile.title = "Gat naar volgende level - Dood eerst alle monsters!";
        tile.onclick = () => checkNextLevel();
      } else if (x === 0 && y === 1) {
        // Sneeuw decoratie
        tile.classList.add("groenland-snow");
        tile.innerHTML = "❄️";
        tile.title = "Koude Groenlandse sneeuw";
      } else if (x === 7 && y === 0) {
        // IJs decoratie
        tile.classList.add("groenland-ice");
        tile.innerHTML = "🧊";
        tile.title = "Bevroren ijs";
      } else if (x === 1 && y === 4) {
        // Kleine boom
        tile.classList.add("groenland-tree");
        tile.innerHTML = "🌲";
        tile.title = "Eenzame dennenboom";
      } else if (x === 5 && y === 1) {
        // Pijl naar schatkist (alleen als speler nog geen zwaard heeft)
        if (!gameState.heeftZwaard) {
          tile.classList.add("groenland-arrow");
          tile.innerHTML = "⬇️";
          tile.title = "🎯 KIJK NAAR BENEDEN! Daar is de gouden schatkist! 💎";
        } else {
          // Normale rots als speler het zwaard al heeft
          tile.classList.add("groenland-rock");
          tile.innerHTML = "🪨";
          tile.title = "Grote rots";
        }
      } else {
        // Gewone grond
        tile.classList.add("groenland-ground");
        tile.innerHTML = ""; // Lege grond
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
