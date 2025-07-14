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

    // Check voor monster aanvallen in Groenland
    if (gameState.inGroenland) {
      checkMonsterAttack();
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
      } else if (gameState.inGroenland) {
        // In Groenland - check for portal exit of interacties
        if (playerX === 0 && playerY === 0) {
          interactWithGroenlandPortal(); // This will exit Groenland
        } else {
          // Check voor schatkist interactie
          checkTreasureChest();
          // Check voor gat interactie
          checkNextLevel();
          // Check voor monster gevecht
          if (gameState.heeftZwaard && isMonsterAt(playerX, playerY)) {
            doodMonster(playerX, playerY);
          } else if (isMonsterAt(playerX, playerY)) {
            showMessage("Er is een monster hier! 👺 Je hebt een zwaard nodig om te vechten!", "error");
          }
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

        const groenlandPortalX = gameState.groenlandPortalPosition.x;
        const groenlandPortalY = gameState.groenlandPortalPosition.y;
        if (playerX === groenlandPortalX && playerY === groenlandPortalY) {
          interactWithGroenlandPortal();
          break;
        }
      }
      break;
    case "Escape":
      // Escape key - nooduitgang uit Groenland
      if (gameState.inGroenland) {
        event.preventDefault();
        showMessage("🚨 NOODUITGANG! Je gebruikt de escape toets om terug te gaan naar je boerderij!", "info");
        stopMonsterAI();
        gameState.inGroenland = false;
        gameState.playerPosition = { x: 6, y: 0 }; // Naast portal
        updateGameMap();
        updateUI();
        saveGame();
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

// Interact met Groenland portal
function interactWithGroenlandPortal() {
  const groenlandPortalX = gameState.groenlandPortalPosition.x;
  const groenlandPortalY = gameState.groenlandPortalPosition.y;
  const playerX = gameState.playerPosition.x;
  const playerY = gameState.playerPosition.y;

  // Check of speler exact op de portal staat
  if (playerX === groenlandPortalX && playerY === groenlandPortalY) {
    // Speel portal geluid
    if (window.speelDeurGeluid) {
      speelDeurGeluid();
    }

    // Toggle tussen Groenland en normale wereld
    if (gameState.inGroenland) {
      // Verlaat Groenland
      stopMonsterAI();
      gameState.inGroenland = false;
      gameState.playerPosition = { x: 6, y: 0 }; // Positie naast portal
      showMessage("Je reist terug naar je boerderij! 🏡", "success");
    } else {
      // Ga naar Groenland
      gameState.inGroenland = true;
      gameState.playerPosition = { x: 1, y: 1 }; // Positie in Groenland
      initializeGroenlandMonsters(); // Maak monsters aan als ze er nog niet zijn
      showMessage("🎮 Welkom in Groenland! ❄️\n\n📖 INSTRUCTIES:\n• Lees eerst het waarschuwingsbord (⚠️)\n• Pak het zwaard uit de gouden schatkist (💎)\n• Monsters vallen je aan als je te dichtbij komt!\n• Dood alle monsters om naar het volgende level te gaan!", "info");
    }
    updateGameMap();
    updateUI();
    saveGame();
  } else {
    showMessage("Je bent te ver van de portal! Loop er naartoe. 🏃‍♂️", "error");
  }
}

// Initialiseer monsters in de mijn
function initializeGroenlandMonsters() {
  if (gameState.monstersInMijn.length === 0) {
    console.log("🏭 Maak 5 nieuwe monsters aan...");
    // Maak 5 monsters in de mijn (posities binnen de mijn)
    for (let i = 0; i < 5; i++) {
      const monster = {
        id: i + 1,
        x: Math.floor(Math.random() * 3) + 2, // Posities 2-4 (mijn gebied)
        y: Math.floor(Math.random() * 2) + 2, // Posities 2-3 (mijn gebied)
        alive: true,
        lastMoveTime: Date.now(),
        moveSpeed: 2000 + Math.random() * 1000 // Willekeurige snelheid tussen 2-3 seconden
      };
      console.log(`👺 Monster ${monster.id} gemaakt op positie (${monster.x}, ${monster.y})`);
      gameState.monstersInMijn.push(monster);
    }
  }
  
  console.log(`🎯 Groenland status: inGroenland=${gameState.inGroenland}, monsterAIRunning=${gameState.monsterAIRunning}`);
  console.log(`👺 Monsters in mijn: ${gameState.monstersInMijn.length} totaal, ${gameState.monstersInMijn.filter(m => m.alive).length} levend`);
  
  // Start monster AI systeem
  if (gameState.inGroenland && !gameState.monsterAIRunning) {
    console.log("🚀 Start monster AI...");
    startMonsterAI();
  } else if (gameState.inGroenland && gameState.monsterAIRunning) {
    console.log("⚠️ Monster AI al actief, forceer herstart...");
    stopMonsterAI();
    setTimeout(() => startMonsterAI(), 100);
  }
}

// Functie om te checken of er monsters zijn op een positie
function isMonsterAt(x, y) {
  return gameState.monstersInMijn.some(monster => 
    monster.alive && monster.x === x && monster.y === y
  );
}

// Functie om monster te doden
function doodMonster(x, y) {
  if (!gameState.heeftZwaard) {
    showMessage("💀 Je hebt geen zwaard! Ga eerst naar de gouden schatkist (💎) in het midden van het veldje om het zwaard te pakken!", "error");
    return;
  }
  
  const monster = gameState.monstersInMijn.find(monster => 
    monster.alive && monster.x === x && monster.y === y
  );
  if (monster) {
    monster.alive = false;
    const remainingMonsters = gameState.monstersInMijn.filter(m => m.alive).length;
    showMessage(`🎉 Monster gedood! ⚔️👺\n\nNog ${remainingMonsters} monsters over!`, "success");
    // Speel vechtsound als beschikbaar
    if (window.speelWaterGeluid) {
      speelWaterGeluid(); // Gebruik water geluid als vechtsound
    }
    updateGameMap();
    saveGame();
  }
}

// Functie om te checken of speler schatkist kan pakken
function checkTreasureChest() {
  const playerX = gameState.playerPosition.x;
  const playerY = gameState.playerPosition.y;
  
  // Schatkist staat op positie (5, 3) - midden-rechts van het veldje
  if (playerX === 5 && playerY === 3) {
    if (!gameState.heeftZwaard) {
      gameState.heeftZwaard = true;
      showMessage("🎉 Je hebt een magisch zwaard gevonden! ⚔️\n\nNu kun je monsters doden door er op te klikken of door ernaartoe te lopen!", "success");
      updateUI();
      saveGame();
    } else {
      showMessage("De schatkist is al leeg. Je hebt het zwaard al! ⚔️", "info");
    }
  }
}

// Functie om te checken of monsters je aanvallen
function checkMonsterAttack() {
  const playerX = gameState.playerPosition.x;
  const playerY = gameState.playerPosition.y;
  
  // Check alle levende monsters
  const nearbyMonsters = gameState.monstersInMijn.filter(monster => {
    if (!monster.alive) return false;
    
    // Check of monster naast speler staat (1 veld afstand)
    const distance = Math.abs(monster.x - playerX) + Math.abs(monster.y - playerY);
    return distance <= 1;
  });
  
  if (nearbyMonsters.length > 0) {
    const monster = nearbyMonsters[0];
    if (gameState.heeftZwaard) {
      // Speler heeft zwaard - monster doet schade
      const damage = Math.floor(Math.random() * 20) + 10; // 10-30 schade
      gameState.hitPoints -= damage;
      gameState.hitPoints = Math.max(0, gameState.hitPoints); // Kan niet onder 0
      
      showMessage(`👺 Een monster valt je aan! Je verliest ${damage} hitpoints! (${gameState.hitPoints} over)`, "error");
      
      // Check voor game over
      if (gameState.hitPoints <= 0) {
        showMessage("💀 GAME OVER! Je bent verslagen door de monsters!\n\nJe wordt terug naar je boerderij gebracht...", "error");
        setTimeout(() => {
          stopMonsterAI();
          gameState.inGroenland = false;
          gameState.playerPosition = { x: 6, y: 0 }; // Naast portal
          gameState.hitPoints = 100; // Reset hitpoints
          updateGameMap();
          updateUI();
          saveGame();
        }, 2000);
      }
    } else {
      // Speler heeft geen zwaard - monster wint
      showMessage("👺 AHHH! Een monster valt je aan! Je hebt geen zwaard om je te verdedigen!\n\nJe bent terug naar je boerderij gevlucht! 🏃‍♂️💨", "error");
      
      // Stuur speler terug naar boerderij
      setTimeout(() => {
        stopMonsterAI();
        gameState.inGroenland = false;
        gameState.playerPosition = { x: 6, y: 0 }; // Naast portal
        updateGameMap();
        updateUI();
        saveGame();
      }, 2000);
    }
  }
}

// Functie om te checken of speler in het gat kan springen
function checkNextLevel() {
  const playerX = gameState.playerPosition.x;
  const playerY = gameState.playerPosition.y;
  
  // Gat staat op positie (6, 4) - rechts onderaan
  if (playerX === 6 && playerY === 4) {
    // Check of alle monsters dood zijn
    const aliveMonsters = gameState.monstersInMijn.filter(monster => monster.alive);
    if (aliveMonsters.length === 0) {
      showMessage("🎉 Gefeliciteerd! Je hebt alle monsters verslagen! Het volgende level komt binnenkort... 🕳️", "success");
    } else {
      showMessage(`Je moet eerst alle monsters doden! Nog ${aliveMonsters.length} monsters over. 👺`, "error");
    }
  }
}

// Monster AI systeem
function startMonsterAI() {
  if (gameState.monsterAIRunning) {
    console.log("⚠️ Monster AI al actief - geen herstart");
    return;
  }
  
  console.log("🎮 Monster AI gestart!");
  gameState.monsterAIRunning = true;
  
  const monsterAIInterval = setInterval(() => {
    // Stop AI als we niet meer in Groenland zijn
    if (!gameState.inGroenland) {
      console.log("🚪 Verlaat Groenland - stop monster AI");
      clearInterval(monsterAIInterval);
      gameState.monsterAIRunning = false;
      return;
    }
    
    // Beweeg elk levend monster
    const aliveMonsters = gameState.monstersInMijn.filter(m => m.alive);
    console.log(`👺 ${aliveMonsters.length} levende monsters bewegen...`);
    
    gameState.monstersInMijn.forEach(monster => {
      if (!monster.alive) return;
      
      const now = Date.now();
      
      // Bereken afstand tot speler voor agressiviteit
      const playerDistance = Math.abs(monster.x - gameState.playerPosition.x) + 
                           Math.abs(monster.y - gameState.playerPosition.y);
      
      // Monsters worden agressiever als je dichtbij bent
      let currentMoveSpeed = monster.moveSpeed;
      if (playerDistance <= 2) {
        currentMoveSpeed = monster.moveSpeed * 0.5; // 2x sneller als dichtbij
      } else if (playerDistance <= 3) {
        currentMoveSpeed = monster.moveSpeed * 0.7; // 1.5x sneller als redelijk dichtbij
      }
      
      if (now - monster.lastMoveTime < currentMoveSpeed) return;
      
      console.log(`👺 Monster ${monster.id} beweegt van (${monster.x}, ${monster.y}) naar speler (${gameState.playerPosition.x}, ${gameState.playerPosition.y})`);
      
      // Beweeg monster naar speler toe
      moveMonsterTowardsPlayer(monster);
      monster.lastMoveTime = now;
    });
    
    // Update de map na monster beweging
    if (gameState.inGroenland) {
      updateGameMap();
    }
  }, 500); // Check elke 500ms voor vloeiende beweging
}

function stopMonsterAI() {
  console.log("🛑 Monster AI gestopt!");
  gameState.monsterAIRunning = false;
}

// Beweeg monster richting speler
function moveMonsterTowardsPlayer(monster) {
  const playerX = gameState.playerPosition.x;
  const playerY = gameState.playerPosition.y;
  
  // Bereken afstand tot speler
  const distanceToPlayer = Math.abs(monster.x - playerX) + Math.abs(monster.y - playerY);
  
  // Alleen bewegen als speler niet te ver weg is (binnen 5 velden)
  if (distanceToPlayer > 5) {
    console.log(`👺 Monster ${monster.id} te ver weg (${distanceToPlayer} velden) - geen beweging`);
    return;
  }
  
  // Bereken beste richting naar speler
  let bestX = monster.x;
  let bestY = monster.y;
  let bestDistance = distanceToPlayer;
  
  // Probeer alle mogelijke bewegingen
  const directions = [
    { dx: 0, dy: -1 }, // omhoog
    { dx: 0, dy: 1 },  // omlaag
    { dx: -1, dy: 0 }, // links
    { dx: 1, dy: 0 }   // rechts
  ];
  
  directions.forEach(dir => {
    const newX = monster.x + dir.dx;
    const newY = monster.y + dir.dy;
    
    // Check of nieuwe positie geldig is
    if (newX < 0 || newX > 7 || newY < 0 || newY > 5) return;
    
    // Check of er geen ander monster op die positie staat
    if (gameState.monstersInMijn.some(otherMonster => 
      otherMonster.alive && otherMonster.id !== monster.id && 
      otherMonster.x === newX && otherMonster.y === newY)) {
      return;
    }
    
    // Bereken afstand tot speler vanuit nieuwe positie
    const newDistance = Math.abs(newX - playerX) + Math.abs(newY - playerY);
    
    // Als dit dichter bij de speler is, gebruik deze positie
    if (newDistance < bestDistance) {
      bestX = newX;
      bestY = newY;
      bestDistance = newDistance;
    }
    
    // Als monster naast speler kan komen, doe dat altijd (voor aanval)
    if (newDistance === 1) {
      bestX = newX;
      bestY = newY;
      bestDistance = newDistance;
    }
  });
  
  // Beweeg monster naar beste positie
  if (bestX !== monster.x || bestY !== monster.y) {
    console.log(`👺 Monster ${monster.id} beweegt van (${monster.x}, ${monster.y}) naar (${bestX}, ${bestY}) - afstand ${bestDistance}`);
    monster.x = bestX;
    monster.y = bestY;
    
    // Speel bewegingsgeluid en waarschuwing als monster dichtbij is
    if (bestDistance <= 2) {
      if (window.speelWaterGeluid) {
        speelWaterGeluid(); // Gebruik water geluid voor monster beweging
      }
      
      // Toon waarschuwing als monster heel dichtbij komt
      if (bestDistance <= 1 && !gameState.heeftZwaard) {
        showMessage("👺 MONSTER KOMT DICHTBIJ! Ga naar de schatkist voor een zwaard!", "error");
      }
      
      // Automatische aanval als monster naast speler staat
      if (bestDistance <= 1) {
        console.log(`🥊 Monster ${monster.id} valt aan vanaf positie (${bestX}, ${bestY})`);
        // Trigger de aanval logica
        setTimeout(() => {
          checkMonsterAttack();
        }, 100);
      }
    }
  } else {
    console.log(`👺 Monster ${monster.id} kan niet dichter bij - blijft op (${monster.x}, ${monster.y})`);
  }
}

// Stop monster AI als we Groenland verlaten
function exitGroenland() {
  gameState.inGroenland = false;
  stopMonsterAI();
  gameState.playerPosition = { x: 6, y: 0 }; // Naast portal
  updateGameMap();
  updateUI();
  saveGame();
}

// Maak handleStatTap globaal beschikbaar
window.handleStatTap = handleStatTap;

// Noodreset functie voor monster AI (gebruik in console)
window.resetMonsterAI = function() {
  console.log("🔄 NOODRESET Monster AI...");
  stopMonsterAI();
  setTimeout(() => {
    if (gameState.inGroenland) {
      console.log("🚀 Herstart Monster AI...");
      startMonsterAI();
    }
  }, 500);
};
