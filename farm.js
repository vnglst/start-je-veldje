// Farm management functions
function initializeFarm() {
  const farmGrid = document.getElementById("farmGrid");
  farmGrid.innerHTML = "";

  for (let i = 0; i < 24; i++) {
    const plot = document.createElement("div");
    plot.className = "farm-plot";
    plot.id = `plot-${i}`;
    plot.onclick = () => plantSeed(i);
    farmGrid.appendChild(plot);

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
    return;
  }

  // Find available seed
  let seedType = null;
  for (const [type, count] of Object.entries(gameState.seeds)) {
    if (count > 0) {
      seedType = type;
      break;
    }
  }

  if (!seedType) {
    showMessage("Je hebt geen zaden! Koop eerst zaden in de winkel. 🏪", "error");
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
}

// Harvest crop function
function harvestCrop(plotIndex) {
  const plot = gameState.farm[plotIndex];

  if (!plot.grown) {
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

  const plotElement = document.getElementById(`plot-${plotIndex}`);
  plotElement.classList.add("harvest-animation");

  setTimeout(() => {
    plotElement.classList.remove("harvest-animation");
  }, 600);

  showMessage(`Je hebt ${crops[cropType].name} geoogst! 🎉`, "success");
  updateUI();
}

// Water plant function
function waterPlant(plotIndex) {
  const plot = gameState.farm[plotIndex];

  if (!plot.planted || plot.grown) {
    showMessage("Er is geen plant om water te geven! 🌱", "error");
    return;
  }

  if (gameState.water <= 0) {
    showMessage("Je hebt geen water meer! Koop water in de winkel. 💧", "error");
    return;
  }

  if (plot.watered && plot.lastWateredDay === gameState.day) {
    showMessage("Deze plant heeft vandaag al water gekregen! 💧", "error");
    return;
  }

  gameState.water--;
  plot.watered = true;
  plot.lastWateredDay = gameState.day;

  showMessage(`Je hebt de ${crops[plot.cropType].name} water gegeven! 💧`, "success");
  updateUI();
}
