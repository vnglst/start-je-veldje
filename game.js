// Game mechanics and day/night cycle
function sleep() {
  gameState.day++;

  // Update seasons every 30 days
  const seasons = ["Lente", "Zomer", "Herfst", "Winter"];
  const seasonIndex = Math.floor((gameState.day - 1) / 30) % 4;
  gameState.season = seasons[seasonIndex];

  // Check for crop growth
  let newlyGrownCrops = 0;
  gameState.farm.forEach((plot, index) => {
    if (plot.planted && !plot.grown && plot.cropType) {
      const daysGrown = gameState.day - plot.plantedDay;
      const isWatered = plot.watered && plot.lastWateredDay === gameState.day - 1;

      if (daysGrown >= crops[plot.cropType].growthTime && isWatered) {
        plot.grown = true;
        newlyGrownCrops++;
      }

      // Reset daily watering status
      if (plot.lastWateredDay < gameState.day - 1) {
        plot.watered = false;
      }
    }
  });

  if (newlyGrownCrops > 0) {
    showMessage(`🌅 Dag ${gameState.day} - ${newlyGrownCrops} gewas(sen) zijn klaar om te oogsten! ✨`, "success");
  } else {
    showMessage(`🌅 Dag ${gameState.day} - Goedemorgen! Tijd om je boerderij te verzorgen. 🌱`, "success");
  }

  updateUI();
}

// Toggle watering mode
function toggleWateringMode() {
  wateringMode = !wateringMode;
  updateUI();
  if (wateringMode) {
    showMessage("Gieter mode geactiveerd! Klik op planten om water te geven. 🚿", "success");
  } else {
    showMessage("Gieter mode gedeactiveerd. 🌱", "success");
  }
}
