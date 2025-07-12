// Shop and inventory functions
function buySeeds(cropType) {
  const crop = crops[cropType];
  const price = crop.seedPrice;

  // Check if crop is available in current season
  if (!crop.seasons.includes(gameState.season)) {
    showMessage(`${crop.name} zaad is niet beschikbaar in ${gameState.season}! 🚫`, "error");
    return;
  }

  if (gameState.money >= price) {
    gameState.money -= price;
    gameState.seeds[cropType]++;
    showMessage(`Je hebt ${crop.name} zaad gekocht! 🌱`, "success");
    updateUI();
  } else {
    showMessage("Je hebt niet genoeg geld! 💸", "error");
  }
}

// Buy water function
function buyWater() {
  const price = 3;

  if (gameState.money >= price) {
    gameState.money -= price;
    gameState.water += 5;
    showMessage("Je hebt water gekocht! 💧", "success");
    updateUI();
  } else {
    showMessage("Je hebt niet genoeg geld! 💸", "error");
  }
}

// Sell fruit function
function sellFruit(fruitType) {
  if (gameState.fruits[fruitType] > 0) {
    gameState.fruits[fruitType]--;
    gameState.money += crops[fruitType].fruitPrice;
    showMessage(`Je hebt ${crops[fruitType].name} verkocht voor €${crops[fruitType].fruitPrice}! 💰`, "success");
    updateUI();
  }
}
