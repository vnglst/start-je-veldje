// Main initialization and game loop
function initializeGame() {
  // Load saved game if available
  if (loadGame()) {
    initializeFarm();
    updateUI();
  } else {
    // Start new game
    initializeFarm();
    updateUI();
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
