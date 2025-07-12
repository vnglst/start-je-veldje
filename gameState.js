// Game state management
let gameState = {
  money: 100,
  seeds: {
    carrot: 0,
    apple: 0,
    corn: 0,
    winterBerry: 0,
  },
  fruits: {
    carrot: 0,
    apple: 0,
    corn: 0,
    winterBerry: 0,
  },
  farm: [],
  day: 1,
  season: "Lente",
  wateringCan: true,
  water: 10,
  playerPosition: { x: 0, y: 0 }, // Player position on the map
  wellPosition: { x: 7, y: 2 }, // Well position outside the farm grid
};

// Game mode
let wateringMode = false;

// Crop data
const crops = {
  carrot: {
    emoji: "🥕",
    name: "Wortel",
    seedPrice: 5,
    fruitPrice: 8,
    growthTime: 3, // days
    seasons: ["Lente", "Herfst"], // Available in spring and autumn
  },
  apple: {
    emoji: "🍎",
    name: "Appel",
    seedPrice: 8,
    fruitPrice: 15,
    growthTime: 5, // days
    seasons: ["Lente", "Zomer", "Herfst"], // Available spring through autumn
  },
  corn: {
    emoji: "🌽",
    name: "Maïs",
    seedPrice: 12,
    fruitPrice: 20,
    growthTime: 7, // days
    seasons: ["Zomer"], // Only available in summer
  },
  winterBerry: {
    emoji: "🫐",
    name: "Winterbes",
    seedPrice: 15,
    fruitPrice: 25,
    growthTime: 4, // days
    seasons: ["Winter"], // Only available in winter
  },
};

// Save and load functions
function saveGame() {
  localStorage.setItem("startJeVeldje", JSON.stringify(gameState));
}

function loadGame() {
  const saved = localStorage.getItem("startJeVeldje");
  if (saved) {
    gameState = JSON.parse(saved);
    return true;
  }
  return false;
}

// Start a new game (reset all progress)
function startNewGame() {
  // Show confirmation dialog
  if (confirm("Weet je zeker dat je een nieuw spel wilt starten? Al je voortgang gaat verloren!")) {
    // Reset game state to initial values
    gameState = {
      money: 100,
      seeds: {
        carrot: 0,
        apple: 0,
        corn: 0,
        winterBerry: 0,
      },
      fruits: {
        carrot: 0,
        apple: 0,
        corn: 0,
        winterBerry: 0,
      },
      farm: [],
      day: 1,
      season: "Lente",
      wateringCan: true,
      water: 10,
      playerPosition: { x: 0, y: 0 },
      wellPosition: { x: 7, y: 2 },
    };

    // Reset watering mode
    wateringMode = false;

    // Initialize farm and update UI
    initializeFarm();
    updateUI();
    saveGame();

    showMessage("Nieuw spel gestart! Welkom terug boer! 🌱", "success");
  }
}

// Export game save data
function exportGameData() {
  const saveData = JSON.stringify(gameState, null, 2);
  const blob = new Blob([saveData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `start-je-veldje-save-dag${gameState.day}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showMessage("Spel voortgang geëxporteerd! 💾", "success");
}

// Import game save data
function importGameData() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const importedData = JSON.parse(e.target.result);

          // Validate that this looks like a valid save file
          if (importedData.money !== undefined && importedData.day !== undefined) {
            gameState = importedData;

            // Ensure all required properties exist for backwards compatibility
            if (!gameState.playerPosition) gameState.playerPosition = { x: 0, y: 0 };
            if (!gameState.wellPosition) gameState.wellPosition = { x: 7, y: 2 };
            if (!gameState.seeds.winterBerry) gameState.seeds.winterBerry = 0;
            if (!gameState.fruits.winterBerry) gameState.fruits.winterBerry = 0;

            initializeFarm();
            updateUI();
            saveGame();
            showMessage("Spel voortgang geïmporteerd! 📂", "success");
          } else {
            showMessage("Ongeldig save bestand! ❌", "error");
          }
        } catch (error) {
          showMessage("Fout bij het laden van het save bestand! ❌", "error");
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
}
