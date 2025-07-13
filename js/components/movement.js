// Player movement and well interaction functions

// Geheime mobiele cheat activatie - dubbeltap systeem
let cheatTapCount = 0;
let cheatTapTimer = null;
const CHEAT_EMOJI = "💰"; // Tap 5x snel op geld emoji
const REQUIRED_TAPS = 5;

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
  } else if (gameState.inIceCreamShop) {
    maxX = 7; // Ijssalon is same size as regular map (8x6)
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

    // Geen irritante locatie berichten meer - spelers kunnen gewoon klikken of spatie gebruiken

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

  // Check of speler exact op de put staat
  if (playerX === wellX && playerY === wellY) {
    gameState.water += 5;
    // Speel water geluid bij halen van water
    if (window.speelWaterGeluid) {
      speelWaterGeluid();
    }
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

  // Check of speler exact op de kas staat
  if (playerX === greenhouseX && playerY === greenhouseY) {
    // Speel deur geluid bij kas in/uitgaan
    if (window.speelDeurGeluid) {
      speelDeurGeluid();
    }

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
      } else if (gameState.inIceCreamShop) {
        // In ijssalon - check for exit of balie interaction
        if (playerX === 0 && playerY === 5) {
          interactWithIceCreamShop(); // This will exit the ijssalon
        } else {
          // Check of speler bij de balie staat (nieuwe balie positie)
          if (
            (playerX === 6 && playerY >= 1 && playerY <= 4) ||
            (playerX === 7 && playerY >= 1 && playerY <= 4) ||
            (playerX === 5 && playerY >= 1 && playerY <= 4)
          ) {
            interactWithIceCreamShopCounter();
          }
        }
      } else {
        // Buiten gebouwen: alleen exact op het gebouw/machine uitvoeren
        const wellX = gameState.wellPosition.x;
        const wellY = gameState.wellPosition.y;
        if (playerX === wellX && playerY === wellY) {
          getWaterFromWell();
          break;
        }

        const shopX = gameState.shopPosition.x;
        const shopY = gameState.shopPosition.y;
        if (playerX === shopX && playerY === shopY) {
          interactWithShop();
          break;
        }

        const iceCreamShopX = gameState.iceCreamShopPosition.x;
        const iceCreamShopY = gameState.iceCreamShopPosition.y;
        if (playerX === iceCreamShopX && playerY === iceCreamShopY) {
          interactWithIceCreamShop();
          break;
        }

        const iceCreamMachineX = gameState.iceCreamMachinePosition.x;
        const iceCreamMachineY = gameState.iceCreamMachinePosition.y;
        if (playerX === iceCreamMachineX && playerY === iceCreamMachineY) {
          interactWithIceCreamMachine();
          break;
        }

        const lemonadeMachineX = gameState.lemonadeMachinePosition.x;
        const lemonadeMachineY = gameState.lemonadeMachinePosition.y;
        if (playerX === lemonadeMachineX && playerY === lemonadeMachineY) {
          interactWithLemonadeMachine();
          break;
        }

        const greenhouseX = gameState.greenhousePosition.x;
        const greenhouseY = gameState.greenhousePosition.y;
        if (playerX === greenhouseX && playerY === greenhouseY) {
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

// Geheime mobiele cheat - tap 5x snel op geld emoji
function handleStatTap(emoji) {
  // Check alleen op geld emoji
  if (emoji !== CHEAT_EMOJI) {
    return;
  }

  // Reset timer bij elke tap
  if (cheatTapTimer) {
    clearTimeout(cheatTapTimer);
  }

  // Verhoog tap count
  cheatTapCount++;
  console.log("Cheat tap count:", cheatTapCount);

  // Check of genoeg taps
  if (cheatTapCount >= REQUIRED_TAPS) {
    // Cheat geactiveerd!
    cheatTapCount = 0;
    showMessage("🎉 Geheime code ontdekt! 💰🎉", "success");
    setTimeout(() => {
      giveStarterPack();
    }, 1000);
    return;
  }

  // Reset na 2 seconden inactiviteit
  cheatTapTimer = setTimeout(() => {
    cheatTapCount = 0;
  }, 2000);
}

// Cheat function: Give starter pack with money and seeds
function giveStarterPack() {
  if (confirm("Wil je een starter pack krijgen? (€500 + diverse zaden & fruit + kas)")) {
    gameState.money += 500;
    gameState.greenhouse = true; // Give greenhouse for free in cheat

    // Give 2 of each seed type
    Object.keys(gameState.seeds).forEach((seedType) => {
      gameState.seeds[seedType] += 2;
    });

    // Give 3 of each fruit type
    Object.keys(gameState.fruits).forEach((fruitType) => {
      gameState.fruits[fruitType] += 3;
    });

    // Give 3 of each ice cream type
    Object.keys(gameState.iceCream).forEach((iceCreamType) => {
      gameState.iceCream[iceCreamType] += 3;
    });

    // Give 3 of each lemonade type
    Object.keys(gameState.lemonade).forEach((lemonadeType) => {
      gameState.lemonade[lemonadeType] += 3;
    });

    updateUI();
    saveGame();
    showMessage(
      "Starter pack gekregen! €500 + 2 van elk zaad + 3 van elk fruit + 3 van elk ijs + 3 van elke limonade + kas! 🎁",
      "success"
    );
  }
}

// Maak handleStatTap globaal beschikbaar
window.handleStatTap = handleStatTap;
