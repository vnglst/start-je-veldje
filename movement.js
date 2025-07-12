// Player movement and well interaction functions

// Check if player is near a farm plot (adjacent or on the plot)
function isPlayerNearPlot(plotIndex) {
  const plotX = (plotIndex % 6) + 1; // Farm starts at x=1
  const plotY = Math.floor(plotIndex / 6) + 1; // Farm starts at y=1

  const playerX = gameState.playerPosition.x;
  const playerY = gameState.playerPosition.y;

  // Check if player is adjacent to or on the plot
  const deltaX = Math.abs(playerX - plotX);
  const deltaY = Math.abs(playerY - plotY);

  return deltaX <= 1 && deltaY <= 1;
}

// Move player in a direction
function movePlayer(direction) {
  const currentX = gameState.playerPosition.x;
  const currentY = gameState.playerPosition.y;
  let newX = currentX;
  let newY = currentY;

  switch (direction) {
    case "up":
      newY = Math.max(0, currentY - 1);
      break;
    case "down":
      newY = Math.min(5, currentY + 1);
      break;
    case "left":
      newX = Math.max(0, currentX - 1);
      break;
    case "right":
      newX = Math.min(7, currentX + 1);
      break;
  }

  // Only move if position actually changed
  if (newX !== currentX || newY !== currentY) {
    gameState.playerPosition.x = newX;
    gameState.playerPosition.y = newY;

    // Check if player is near the well
    const wellX = gameState.wellPosition.x;
    const wellY = gameState.wellPosition.y;
    if (Math.abs(newX - wellX) <= 1 && Math.abs(newY - wellY) <= 1) {
      showMessage("Je bent bij de put! Druk op spatie of klik op de 💧 knop voor water.", "success");
    }

    // Check if player is near the shop
    const shopX = gameState.shopPosition.x;
    const shopY = gameState.shopPosition.y;
    if (Math.abs(newX - shopX) <= 1 && Math.abs(newY - shopY) <= 1) {
      showMessage("Je bent bij de winkel! Druk op spatie of klik op de 🏪 voor winkelen.", "success");
    }

    updateGameMap();
    saveGame();
  }
}

// Get water from the well
function getWaterFromWell() {
  const wellX = gameState.wellPosition.x;
  const wellY = gameState.wellPosition.y;
  const playerX = gameState.playerPosition.x;
  const playerY = gameState.playerPosition.y;

  // Check if player is adjacent to the well
  const deltaX = Math.abs(playerX - wellX);
  const deltaY = Math.abs(playerY - wellY);

  if (deltaX <= 1 && deltaY <= 1) {
    gameState.water += 5;
    showMessage("Je hebt water gehaald uit de put! +5 water 💧", "success");
    updateUI();
    saveGame();
  } else {
    showMessage("Je bent te ver van de put! Loop er naartoe. 🏃‍♂️", "error");
  }
}

// Keyboard event listener for player movement
document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "ArrowUp":
    case "w":
    case "W":
      event.preventDefault();
      movePlayer("up");
      break;
    case "ArrowDown":
    case "s":
    case "S":
      event.preventDefault();
      movePlayer("down");
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      event.preventDefault();
      movePlayer("left");
      break;
    case "ArrowRight":
    case "d":
    case "D":
      event.preventDefault();
      movePlayer("right");
      break;
    case " ":
    case "Enter":
      event.preventDefault();
      const playerX = gameState.playerPosition.x;
      const playerY = gameState.playerPosition.y;

      // Check if near well
      const wellX = gameState.wellPosition.x;
      const wellY = gameState.wellPosition.y;
      if (Math.abs(playerX - wellX) <= 1 && Math.abs(playerY - wellY) <= 1) {
        getWaterFromWell();
        break;
      }

      // Check if near shop
      const shopX = gameState.shopPosition.x;
      const shopY = gameState.shopPosition.y;
      if (Math.abs(playerX - shopX) <= 1 && Math.abs(playerY - shopY) <= 1) {
        interactWithShop();
        break;
      }
      break;
    case "n":
    case "N":
      // Start new game with Ctrl+N or Cmd+N
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        startNewGame();
      }
      break;
    case "c":
    case "C":
      // Cheat code: Ctrl+C for starter pack
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        giveStarterPack();
      }
      break;
  }
});

// Cheat function: Give starter pack with money and seeds
function giveStarterPack() {
  if (confirm("Wil je een starter pack krijgen? (€500 + diverse zaden)")) {
    gameState.money += 500;

    // Give 2 of each seed type
    Object.keys(gameState.seeds).forEach((seedType) => {
      gameState.seeds[seedType] += 2;
    });

    updateUI();
    saveGame();
    showMessage("Starter pack gekregen! €500 + 2 van elk zaad type! 🎁", "success");
  }
}
