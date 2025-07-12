// Main initialization and game loop
function initializeGame() {
  // Load saved game if available
  if (loadGame()) {
    // Ensure player position exists for older saves
    if (!gameState.playerPosition) {
      gameState.playerPosition = { x: 0, y: 0 };
    }
    if (!gameState.wellPosition) {
      gameState.wellPosition = { x: 7, y: 2 };
    }
    // Ensure winter berry exists for older saves
    if (gameState.seeds.winterBerry === undefined) {
      gameState.seeds.winterBerry = 0;
    }
    if (gameState.fruits.winterBerry === undefined) {
      gameState.fruits.winterBerry = 0;
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
