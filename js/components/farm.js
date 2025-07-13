// Farm management functions
function initializeFarm() {
  // Initialize regular farm plots data (24 plots)
  for (let i = 0; i < 24; i++) {
    // Only initialize if the plot doesn't exist or is incomplete
    if (!gameState.farm[i]) {
      gameState.farm[i] = {
        planted: false,
        cropType: null,
        plantedDay: null,
        grown: false,
        watered: false,
        lastWateredDay: null,
        daysWithoutWater: 0, // Track consecutive days without water
        growthDays: 0, // Track actual growth days (only increases when watered)
      };
    } else {
      // Ensure all properties exist for backwards compatibility
      if (gameState.farm[i].daysWithoutWater === undefined) {
        gameState.farm[i].daysWithoutWater = 0;
      }
      if (gameState.farm[i].growthDays === undefined) {
        gameState.farm[i].growthDays = gameState.farm[i].plantedDay ? gameState.day - gameState.farm[i].plantedDay : 0;
      }
    }
  }

  // Initialize greenhouse farm plots data (24 plots - same size as regular farm)
  for (let i = 0; i < 24; i++) {
    if (!gameState.greenhouseFarm[i]) {
      gameState.greenhouseFarm[i] = {
        planted: false,
        cropType: null,
        plantedDay: null,
        grown: false,
        watered: false,
        lastWateredDay: null,
        daysWithoutWater: 0,
        growthDays: 0,
      };
    } else {
      // Ensure all properties exist for backwards compatibility
      if (gameState.greenhouseFarm[i].daysWithoutWater === undefined) {
        gameState.greenhouseFarm[i].daysWithoutWater = 0;
      }
      if (gameState.greenhouseFarm[i].growthDays === undefined) {
        gameState.greenhouseFarm[i].growthDays = gameState.greenhouseFarm[i].plantedDay
          ? gameState.day - gameState.greenhouseFarm[i].plantedDay
          : 0;
      }
    }
  }
}

// Plant seed function
function plantSeed(plotIndex) {
  const currentFarm = gameState.inGreenhouse ? gameState.greenhouseFarm : gameState.farm;
  const plot = currentFarm[plotIndex];

  if (plot.planted) {
    if (plot.grown) {
      harvestCrop(plotIndex);
    } else {
      showMessage("Er groeit al een plant op dit veldje! 🌱", "error");
    }
    return;
  }

  // Find available seed that can be planted
  let seedType = null;
  for (const [type, count] of Object.entries(gameState.seeds)) {
    if (count > 0) {
      const crop = crops[type];
      // In greenhouse: can plant greenhouse-only crops or regular crops
      // Outside: can only plant regular crops that are in season
      if (gameState.inGreenhouse) {
        if (crop.greenhouseOnly || crop.seasons.includes(gameState.season)) {
          seedType = type;
          break;
        }
      } else {
        if (!crop.greenhouseOnly && crop.seasons.includes(gameState.season)) {
          seedType = type;
          break;
        }
      }
    }
  }

  if (!seedType) {
    // Check if player has seeds but they're not suitable for current location
    const hasSeeds = Object.values(gameState.seeds).some((count) => count > 0);
    if (hasSeeds) {
      if (gameState.inGreenhouse) {
        showMessage("Je hebt geen zaden die geschikt zijn voor de kas! 🏡", "error");
      } else {
        showMessage(`Je zaden kunnen niet geplant worden in ${gameState.season}! 🚫`, "error");
      }
    } else {
      showMessage("Je hebt geen zaden! Koop eerst zaden in de winkel. 🏪", "error");
    }
    return;
  }

  // Plant the seed
  gameState.seeds[seedType]--;
  plot.planted = true;
  plot.cropType = seedType;
  plot.plantedDay = gameState.day;
  plot.grown = false;
  plot.watered = false;
  plot.lastWateredDay = null;
  plot.growthDays = 0;
  plot.daysWithoutWater = 0;

  speelPlantGeluid(); // Geluidseffect voor planten
  const cropName = crops[seedType].name;
  const locationText = gameState.inGreenhouse ? "in de kas" : "op je boerderij";
  showMessage(`Je hebt ${cropName} zaad geplant ${locationText}! Vergeet niet om water te geven. 🌱`, "success");
  updateUI();
  saveGame();
}

// Harvest crop function
function harvestCrop(plotIndex) {
  const currentFarm = gameState.inGreenhouse ? gameState.greenhouseFarm : gameState.farm;
  const plot = currentFarm[plotIndex];

  if (!plot.grown) {
    showMessage("Deze plant is nog niet klaar om te oogsten! ⏰", "error");
    return;
  }

  const cropType = plot.cropType;
  gameState.fruits[cropType]++;

  // Reset plot
  plot.planted = false;
  plot.cropType = null;
  plot.plantedDay = null;
  plot.grown = false;
  plot.watered = false;
  plot.lastWateredDay = null;
  plot.growthDays = 0;
  plot.daysWithoutWater = 0;

  // Animation effect (if plot element exists)
  const plotElement = document.getElementById(`plot-${plotIndex}`);
  if (plotElement) {
    plotElement.classList.add("harvest-animation");
    setTimeout(() => {
      plotElement.classList.remove("harvest-animation");
    }, 600);
  }

  speelOogstGeluid(); // Geluidseffect voor oogsten
  showMessage(`Je hebt ${crops[cropType].name} geoogst! 🎉`, "success");
  updateUI();
  saveGame();
}

// Water plant function
function waterPlant(plotIndex) {
  const currentFarm = gameState.inGreenhouse ? gameState.greenhouseFarm : gameState.farm;
  const plot = currentFarm[plotIndex];

  if (!plot.planted || plot.grown) {
    showMessage("Er is geen plant om water te geven! 🌱", "error");
    return;
  }

  if (gameState.water <= 0) {
    showMessage("Je hebt geen water meer! Ga naar de put voor water. 🏗️", "error");
    return;
  }

  if (plot.watered && plot.lastWateredDay === gameState.day) {
    showMessage("Deze plant heeft vandaag al water gekregen! 💧", "error");
    return;
  }

  gameState.water--;
  plot.watered = true;
  plot.lastWateredDay = gameState.day;
  plot.daysWithoutWater = 0; // Reset drought counter

  speelWaterGeluid(); // Geluidseffect voor water geven
  showMessage(`Je hebt de ${crops[plot.cropType].name} water gegeven! 💧`, "success");
  updateUI();
  saveGame();
}

// Toggle watering mode
function toggleWateringMode() {
  wateringMode = !wateringMode;
  updateUI();

  if (wateringMode) {
    showMessage("Gieter mode aan! Klik op planten om ze water te geven. 🚿", "success");
  } else {
    showMessage("Gieter mode uit! Klik op lege veldjes om te planten. 🌱", "success");
  }
}

// Toggle info mode
function toggleInfoMode() {
  infoMode = !infoMode;
  // Turn off watering mode when info mode is on
  if (infoMode) {
    wateringMode = false;
  }
  updateUI();

  if (infoMode) {
    showMessage("Info mode aan! Klik op planten om informatie te zien. 🔍", "success");
  } else {
    showMessage("Info mode uit! Normale plant interactie actief. 🌱", "success");
  }
}

// Get the best available seed for current season
function getBestAvailableSeed() {
  // Priority order: cheapest first for easier gameplay
  const seedPriority = [
    "potato", // €4 - cheapest
    "carrot", // €5
    "strawberry", // €6
    "tomato", // €7
    "apple", // €8
    "raspberry", // €10
    "corn", // €12
    "winterBerry", // €15
    "pumpkin", // €20 - most expensive
  ];

  for (const seedType of seedPriority) {
    if (gameState.seeds[seedType] > 0 && crops[seedType].seasons.includes(gameState.season)) {
      return seedType;
    }
  }

  return null;
}

// Quick plant function (plants best available seed)
function quickPlant(plotIndex) {
  const plot = gameState.farm[plotIndex];

  if (plot.planted) {
    if (plot.grown) {
      harvestCrop(plotIndex);
    } else {
      showMessage("Er groeit al een plant op dit veldje! 🌱", "error");
    }
    return;
  }

  const seedType = getBestAvailableSeed();

  if (!seedType) {
    const hasSeeds = Object.values(gameState.seeds).some((count) => count > 0);
    if (hasSeeds) {
      showMessage(`Je zaden kunnen niet geplant worden in ${gameState.season}! 🚫`, "error");
    } else {
      showMessage("Je hebt geen zaden! Koop eerst zaden in de winkel. 🏪", "error");
    }
    return;
  }

  // Plant the seed
  gameState.seeds[seedType]--;
  plot.planted = true;
  plot.cropType = seedType;
  plot.plantedDay = gameState.day;
  plot.grown = false;
  plot.watered = false;
  plot.lastWateredDay = null;
  plot.growthDays = 0;
  plot.daysWithoutWater = 0;

  showMessage(`Je hebt ${crops[seedType].name} zaad geplant! Vergeet niet om water te geven. 🌱`, "success");
  updateUI();
  saveGame();
}

// Show plant information when clicking on a planted crop
function showPlantInfo(plotIndex) {
  const currentFarm = gameState.inGreenhouse ? gameState.greenhouseFarm : gameState.farm;
  const plot = currentFarm[plotIndex];

  if (!plot.planted || !plot.cropType) {
    showMessage("Er groeit geen plant op dit veldje.", "error");
    return;
  }

  const crop = crops[plot.cropType];
  const actualGrowthDays = plot.growthDays || 0;
  const daysLeft = Math.max(0, Math.ceil(crop.growthTime - actualGrowthDays)); // Round up and prevent negative days
  const needsWater = !plot.watered || plot.lastWateredDay < gameState.day;
  const daysWithoutWater = plot.daysWithoutWater || 0;

  let statusMessage = "";
  let statusEmoji = "";

  if (plot.grown) {
    statusMessage = `${crop.emoji} ${crop.name} is klaar voor de oogst! Klik om te oogsten.`;
    statusEmoji = "✅";
  } else if (daysLeft === 0) {
    statusMessage = `${crop.emoji} ${crop.name} is bijna klaar! Slaap om de plant te laten rijpen.`;
    statusEmoji = "🌾";
  } else if (daysWithoutWater >= 1) {
    statusMessage = `${crop.emoji} ${crop.name} is kritiek! Nog ${daysLeft} dagen groei nodig, maar de plant gaat morgen dood zonder water!`;
    statusEmoji = "💀";
  } else if (needsWater) {
    statusMessage = `${crop.emoji} ${crop.name} heeft water nodig! Nog ${daysLeft} dagen groei nodig.`;
    statusEmoji = "💧";
  } else {
    statusMessage = `${crop.emoji} ${crop.name} groeit goed! Nog ${daysLeft} dagen tot oogst.`;
    statusEmoji = "🌱";
  }

  const locationText = gameState.inGreenhouse ? "🏡 In de kas" : "🚜 Op de boerderij";
  const infoText = `${statusEmoji} ${statusMessage}\n\n📊 Plantinfo:\n• Locatie: ${locationText}\n• Geplant op dag ${
    plot.plantedDay
  }\n• Groeidagen: ${Math.round(actualGrowthDays * 10) / 10}/${crop.growthTime}\n• Verkoopprijs: €${crop.fruitPrice}${
    crop.greenhouseOnly ? "\n• � Exclusief kas gewas!" : ""
  }`;

  showMessage(infoText, daysWithoutWater >= 1 ? "error" : needsWater ? "warning" : "info");
}
