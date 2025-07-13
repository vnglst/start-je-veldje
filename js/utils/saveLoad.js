// Save/Load utilities voor spelvoortgang

/**
 * Slaat de huidige spelstatus op in localStorage
 */
function saveGame() {
  localStorage.setItem("farmGameSave-v2", JSON.stringify(gameState));
}

/**
 * Laadt opgeslagen spelstatus uit localStorage
 */
function loadGame() {
  const savedGame = localStorage.getItem("farmGameSave-v2");
  if (savedGame) {
    const loadedState = JSON.parse(savedGame);

    // Merge loaded state met huidige gameState om nieuwe properties te behouden
    Object.assign(gameState, loadedState);

    // Zorg ervoor dat nieuwe properties default waarden hebben
    if (!gameState.iceCream) {
      gameState.iceCream = {
        strawberry: 0,
        apple: 0,
        carrot: 0,
        corn: 0,
        berry_mix: 0,
        tropical_paradise: 0,
        autumn_harvest: 0,
        rainbow_deluxe: 0,
        veggie_surprise: 0,
        summer_festival: 0,
        golden_treasure: 0,
      };
    }
  }
}

/**
 * Start een nieuw spel met bevestiging van de gebruiker
 */
function startNewGame() {
  if (confirm("Weet je zeker dat je een nieuw spel wilt starten? Al je voortgang gaat verloren!")) {
    // Leave this here, essential to clean localStorage
    localStorage.clear();

    // Reset alle game state naar beginwaarden
    gameState.money = 100;
    gameState.day = 1;
    gameState.season = "Lente";
    gameState.water = 10;
    gameState.greenhouse = true;
    gameState.inGreenhouse = false;
    gameState.playerPosition = { x: 0, y: 0 };

    // Reset alle seeds naar 0
    Object.keys(gameState.seeds).forEach((seed) => {
      gameState.seeds[seed] = 0;
    });

    // Reset alle fruits naar 0
    Object.keys(gameState.fruits).forEach((fruit) => {
      gameState.fruits[fruit] = 0;
    });

    // Reset alle ice cream naar 0
    Object.keys(gameState.iceCream).forEach((iceCream) => {
      gameState.iceCream[iceCream] = 0;
    });

    // Reset farm naar lege arrays
    gameState.farm = [];
    gameState.greenhouseFarm = [];

    // Reset modes
    wateringMode = false;
    infoMode = false;

    // Save en update UI
    saveGame();
    updateUI();
    initializeFarm();

    showMessage("Nieuw spel gestart! Welkom terug op je boerderij! 🌱", "success");
  }
}

/**
 * Exporteert speldata als JSON bestand voor download
 */
function exportGameData() {
  const gameData = {
    version: "1.0",
    timestamp: new Date().toISOString(),
    gameState: gameState,
    metadata: {
      exportedBy: "Start je Veldje Game",
      day: gameState.day,
      season: gameState.season,
      money: gameState.money,
    },
  };

  const dataStr = JSON.stringify(gameData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(dataBlob);
  link.download = `start-je-veldje-save-dag${gameState.day}-${gameState.season.toLowerCase()}.json`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showMessage(
    `Speldata geëxporteerd! Bestand: start-je-veldje-save-dag${gameState.day}-${gameState.season.toLowerCase()}.json`,
    "success"
  );
}

/**
 * Importeert speldata vanuit een JSON bestand
 */
function importGameData() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

  input.onchange = function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const importedData = JSON.parse(e.target.result);

        // Check if it's our game format
        let importedGameState;
        if (importedData.gameState) {
          // New format with metadata
          importedGameState = importedData.gameState;
          console.log("Importing new format save file, version:", importedData.version);
        } else {
          // Old format - direct gameState
          importedGameState = importedData;
          console.log("Importing legacy format save file");
        }

        // Validatie van belangrijke properties
        if (
          typeof importedGameState.money !== "number" ||
          typeof importedGameState.day !== "number" ||
          !importedGameState.season
        ) {
          throw new Error("Ongeldig save bestand format");
        }

        // Backup huidige staat voor het geval dat
        const backup = JSON.stringify(gameState);

        try {
          // Merge imported state met huidige gameState
          Object.assign(gameState, importedGameState);

          // Zorg ervoor dat nieuwe properties bestaan
          if (!gameState.iceCream) {
            gameState.iceCream = {
              strawberry: 0,
              apple: 0,
              carrot: 0,
              corn: 0,
              berry_mix: 0,
              tropical_paradise: 0,
              autumn_harvest: 0,
              rainbow_deluxe: 0,
              veggie_surprise: 0,
              summer_festival: 0,
              golden_treasure: 0,
            };
          }

          // Zorg ervoor dat alle gewas types bestaan
          Object.keys(crops).forEach((cropType) => {
            if (gameState.seeds[cropType] === undefined) {
              gameState.seeds[cropType] = 0;
            }
            if (gameState.fruits[cropType] === undefined) {
              gameState.fruits[cropType] = 0;
            }
          });

          // Save en update alles
          saveGame();
          updateUI();
          initializeFarm();
          initializeGreenhouseFarm();
          updatePlayerPosition();

          const metadata = importedData.metadata;
          if (metadata) {
            showMessage(
              `Speldata succesvol geïmporteerd! Dag ${metadata.day}, ${metadata.season}, €${metadata.money} 💾`,
              "success"
            );
          } else {
            showMessage(
              `Legacy speldata succesvol geïmporteerd! Dag ${gameState.day}, ${gameState.season} 💾`,
              "success"
            );
          }
        } catch (applyError) {
          // Restore backup als er iets fout ging
          Object.assign(gameState, JSON.parse(backup));
          throw applyError;
        }
      } catch (error) {
        console.error("Import error:", error);
        showMessage("Fout bij importeren van speldata. Controleer of het bestand geldig is. ❌", "error");
      }
    };

    reader.readAsText(file);
  };

  input.click();
}

// Export functies voor gebruik in andere modules
if (typeof module !== "undefined" && module.exports) {
  // Node.js environment
  module.exports = {
    saveGame,
    loadGame,
    startNewGame,
    exportGameData,
    importGameData,
  };
} else {
  // Browser environment - maak functies globaal beschikbaar
  window.saveGame = saveGame;
  window.loadGame = loadGame;
  window.startNewGame = startNewGame;
  window.exportGameData = exportGameData;
  window.importGameData = importGameData;
}
