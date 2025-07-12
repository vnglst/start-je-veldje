// Player movement and well interaction functions

// Check if player is near a farm plot (adjacent or on the plot)
function isPlayerNearPlot(plotIndex) {
  const playerX = gameState.playerPosition.x;
  const playerY = gameState.playerPosition.y;

  let plotX, plotY;

  if (gameState.inGreenhouse) {
    // Greenhouse plots (6 wide, 4 tall - same as regular farm)
    plotX = (plotIndex % 6) + 1; // Greenhouse farm starts at x=1
    plotY = Math.floor(plotIndex / 6) + 1; // Greenhouse farm starts at y=1
  } else {
    // Regular farm plots (6 wide, 4 tall)
    plotX = (plotIndex % 6) + 1; // Farm starts at x=1
    plotY = Math.floor(plotIndex / 6) + 1; // Farm starts at y=1
  }

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

  // Set boundaries based on current location
  let maxX, maxY;
  if (gameState.inGreenhouse) {
    maxX = 7; // Greenhouse is same size as regular map (8x6)
    maxY = 5;
  } else {
    maxX = 7; // Regular map (8x6)
    maxY = 5;
  }

  switch (direction) {
    case "up":
      newY = Math.max(0, currentY - 1);
      break;
    case "down":
      newY = Math.min(maxY, currentY + 1);
      break;
    case "left":
      newX = Math.max(0, currentX - 1);
      break;
    case "right":
      newX = Math.min(maxX, currentX + 1);
      break;
  }

  // Only move if position actually changed
  if (newX !== currentX || newY !== currentY) {
    gameState.playerPosition.x = newX;
    gameState.playerPosition.y = newY;

    // Location-specific messages
    if (gameState.inGreenhouse) {
      // In greenhouse - no special locations except exit
      if (newX === 0 && newY === 0) {
        showMessage("Je bent bij de uitgang! Druk op spatie om de kas te verlaten. 🚪", "success");
      }
    } else {
      // Outside greenhouse - check for well, shop, etc.
      const wellX = gameState.wellPosition.x;
      const wellY = gameState.wellPosition.y;
      if (Math.abs(newX - wellX) <= 1 && Math.abs(newY - wellY) <= 1) {
        showMessage("Je bent bij de put! Druk op spatie of klik op de 💧 knop voor water.", "success");
      }

      const shopX = gameState.shopPosition.x;
      const shopY = gameState.shopPosition.y;
      if (Math.abs(newX - shopX) <= 1 && Math.abs(newY - shopY) <= 1) {
        showMessage("Je bent bij de winkel! Druk op spatie of klik op de 🏪 voor winkelen.", "success");
      }

      const iceCreamShopX = gameState.iceCreamShopPosition.x;
      const iceCreamShopY = gameState.iceCreamShopPosition.y;
      if (Math.abs(newX - iceCreamShopX) <= 1 && Math.abs(newY - iceCreamShopY) <= 1) {
        showMessage("Je bent bij de ijswinkel! Druk op spatie of klik op de 🍦 voor lekker ijs.", "success");
      }

      const iceCreamMachineX = gameState.iceCreamMachinePosition.x;
      const iceCreamMachineY = gameState.iceCreamMachinePosition.y;
      if (Math.abs(newX - iceCreamMachineX) <= 1 && Math.abs(newY - iceCreamMachineY) <= 1) {
        showMessage("Je bent bij de ijsmachine! Druk op spatie of klik op de 🏭 om ijs te maken.", "success");
      }

      const greenhouseX = gameState.greenhousePosition.x;
      const greenhouseY = gameState.greenhousePosition.y;
      if (Math.abs(newX - greenhouseX) <= 1 && Math.abs(newY - greenhouseY) <= 1) {
        showMessage("Je bent bij de kas! Druk op spatie om binnen te gaan. 🏡", "success");
      }
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

// Interact with greenhouse
function interactWithGreenhouse() {
  if (!gameState.greenhouse) {
    showMessage("Je hebt nog geen kas! Koop er een in de winkel voor €1000. 🏪", "error");
    return;
  }

  const greenhouseX = gameState.greenhousePosition.x;
  const greenhouseY = gameState.greenhousePosition.y;
  const playerX = gameState.playerPosition.x;
  const playerY = gameState.playerPosition.y;

  // Check if player is adjacent to the greenhouse
  const deltaX = Math.abs(playerX - greenhouseX);
  const deltaY = Math.abs(playerY - greenhouseY);

  if (deltaX <= 1 && deltaY <= 1) {
    // Toggle between inside and outside greenhouse
    if (gameState.inGreenhouse) {
      // Exit greenhouse
      gameState.inGreenhouse = false;
      gameState.playerPosition = { x: 1, y: 0 }; // Position next to greenhouse exit
      showMessage("Je verlaat de kas en gaat terug naar je boerderij! 🚜", "success");
    } else {
      // Enter greenhouse
      gameState.inGreenhouse = true;
      gameState.playerPosition = { x: 1, y: 1 }; // Position inside greenhouse (avoid exit)
      showMessage("Welkom in je kas! 🏡 Hier kun je speciale gewassen planten die het hele jaar groeien!", "success");
    }
    updateGameMap();
    updateUI();
    saveGame();
  } else {
    showMessage("Je bent te ver van de kas! Loop er naartoe. 🏃‍♂️", "error");
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

      if (gameState.inGreenhouse) {
        // In greenhouse - check for exit
        if (playerX === 0 && playerY === 0) {
          interactWithGreenhouse(); // This will exit the greenhouse
        }
      } else {
        // Outside greenhouse - check for buildings
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

        // Check if near ice cream shop
        const iceCreamShopX = gameState.iceCreamShopPosition.x;
        const iceCreamShopY = gameState.iceCreamShopPosition.y;
        if (Math.abs(playerX - iceCreamShopX) <= 1 && Math.abs(playerY - iceCreamShopY) <= 1) {
          interactWithIceCreamShop();
          break;
        }

        // Check if near ice cream machine
        const iceCreamMachineX = gameState.iceCreamMachinePosition.x;
        const iceCreamMachineY = gameState.iceCreamMachinePosition.y;
        if (Math.abs(playerX - iceCreamMachineX) <= 1 && Math.abs(playerY - iceCreamMachineY) <= 1) {
          interactWithIceCreamMachine();
          break;
        }

        // Check if near greenhouse
        const greenhouseX = gameState.greenhousePosition.x;
        const greenhouseY = gameState.greenhousePosition.y;
        if (Math.abs(playerX - greenhouseX) <= 1 && Math.abs(playerY - greenhouseY) <= 1) {
          interactWithGreenhouse();
          break;
        }
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
  if (confirm("Wil je een starter pack krijgen? (€500 + diverse zaden + kas)")) {
    gameState.money += 500;
    gameState.greenhouse = true; // Give greenhouse for free in cheat

    // Give 2 of each seed type
    Object.keys(gameState.seeds).forEach((seedType) => {
      gameState.seeds[seedType] += 2;
    });

    updateUI();
    saveGame();
    showMessage("Starter pack gekregen! €500 + 2 van elk zaad type + kas! 🎁", "success");
  }
}
