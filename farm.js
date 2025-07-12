// Farm management functions
function initializeFarm() {
  // Initialize farm plots data (no DOM manipulation here since we use gameMap now)
  for (let i = 0; i < 24; i++) {
    gameState.farm[i] = {
      planted: false,
      cropType: null,
      plantedDay: null,
      grown: false,
      watered: false,
      lastWateredDay: null,
      daysWithoutWater: 0, // Track consecutive days without water
    };
  }
}

// Plant seed function
function plantSeed(plotIndex) {
  const plot = gameState.farm[plotIndex];

  if (plot.planted) {
    if (plot.grown) {
      harvestCrop(plotIndex);
    } else {
      showMessage("Er groeit al een plant op dit veldje! 🌱", "error");
    }
    return;
  }

  // Find available seed that can be planted in current season
  let seedType = null;
  for (const [type, count] of Object.entries(gameState.seeds)) {
    if (count > 0 && crops[type].seasons.includes(gameState.season)) {
      seedType = type;
      break;
    }
  }

  if (!seedType) {
    // Check if player has seeds but they're not in season
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
  plot.growthDays = 0; // Track actual growth days (only increases when watered)
  plot.daysWithoutWater = 0;

  showMessage(`Je hebt ${crops[seedType].name} zaad geplant! Vergeet niet om water te geven. 🌱`, "success");
  updateUI();
  saveGame();
}

// Harvest crop function
function harvestCrop(plotIndex) {
  const plot = gameState.farm[plotIndex];

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

  showMessage(`Je hebt ${crops[cropType].name} geoogst! 🎉`, "success");
  updateUI();
  saveGame();
}

// Water plant function
function waterPlant(plotIndex) {
  const plot = gameState.farm[plotIndex];

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
