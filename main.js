// Main initialization and game loop
function initializeGame() {
  // Load saved game if available
  if (loadGame()) {
    // Ensure player position exists for older saves
    if (!gameState.playerPosition) {
      gameState.playerPosition = { x: 0, y: 0 };
    }
    if (!gameState.wellPosition) {
      gameState.wellPosition = { x: 7, y: 1 };
    }
    if (!gameState.shopPosition) {
      gameState.shopPosition = { x: 0, y: 5 };
    }
    if (!gameState.greenhousePosition) {
      gameState.greenhousePosition = { x: 0, y: 0 };
    }
    if (!gameState.iceCreamShopPosition) {
      gameState.iceCreamShopPosition = { x: 7, y: 5 };
    }
    
    // Forceer ijswinkel naar nieuwe positie (tijdelijke fix)
    if (gameState.iceCreamShopPosition.x === 7 && gameState.iceCreamShopPosition.y === 0) {
      gameState.iceCreamShopPosition = { x: 7, y: 5 };
      console.log("IJswinkel verplaatst naar rechts onder: ", gameState.iceCreamShopPosition);
    }
    if (!gameState.iceCreamMachinePosition) {
      gameState.iceCreamMachinePosition = { x: 0, y: 1 };
    }

    // Ensure ice cream inventory exists for older saves (zonder regenboog, mint, chocolade)
    if (!gameState.iceCream) {
      gameState.iceCream = {
        vanilla: 0,
        strawberry: 0,
        apple: 0,
        carrot: 0,
        corn: 0,
        berry_mix: 0,
      };
    } else {
      // Add new ice cream types to existing saves (en verwijder oude types)
      const newIceCreams = ["apple", "carrot", "corn", "berry_mix"];
      newIceCreams.forEach((iceCream) => {
        if (gameState.iceCream[iceCream] === undefined) {
          gameState.iceCream[iceCream] = 0;
        }
      });
      // Remove old ice cream types if they exist
      if (gameState.iceCream.chocolate !== undefined) delete gameState.iceCream.chocolate;
      if (gameState.iceCream.mint !== undefined) delete gameState.iceCream.mint;
      if (gameState.iceCream.rainbow !== undefined) delete gameState.iceCream.rainbow;
    }

    // Ensure greenhouse property exists for older saves
    if (gameState.greenhouse === undefined) {
      gameState.greenhouse = false;
    }

    // Ensure all crops exist for older saves
    const allCrops = [
      "winterBerry",
      "raspberry",
      "pumpkin",
      "strawberry",
      "potato",
      "tomato",
      "apricot",
      "peach",
      "kiwi",
      "mango",
      "dragon_fruit",
    ];
    allCrops.forEach((crop) => {
      if (gameState.seeds[crop] === undefined) {
        gameState.seeds[crop] = 0;
      }
      if (gameState.fruits[crop] === undefined) {
        gameState.fruits[crop] = 0;
      }
    });

    // Add greenhouse farm for backwards compatibility
    if (!gameState.greenhouseFarm) {
      gameState.greenhouseFarm = [];
    }
    if (gameState.inGreenhouse === undefined) {
      gameState.inGreenhouse = false;
    }

    initializeFarm();
    updateUI();
    showMessage(`Welkom terug! 🌱 Dag ${gameState.day} in ${gameState.season}`, "success");
  } else {
    // Start new game
    initializeFarm();
    updateUI();
    showMessage(
      "Welkom bij Start je Veldje! 🌱 Gebruik pijltjestoetsen om te bewegen en ga naar de put voor water! Druk Ctrl+N voor een nieuw spel.",
      "success"
    );
  }
  
  // Forceer ijswinkel positie naar rechts onder (voor alle games)
  if (gameState.iceCreamShopPosition && gameState.iceCreamShopPosition.x === 7 && gameState.iceCreamShopPosition.y === 0) {
    gameState.iceCreamShopPosition = { x: 7, y: 5 };
    console.log("IJswinkel verplaatst naar rechts onder: ", gameState.iceCreamShopPosition);
    saveGame(); // Sla de nieuwe positie op
    updateGameMap(); // Update de map direct
  }
}

// Auto-save functionality
function startAutoSave() {
  setInterval(() => {
    saveGame();
  }, 5000);
}

// Start the game when page loads
window.onload = function () {
  initializeGame();
  startAutoSave();
};
