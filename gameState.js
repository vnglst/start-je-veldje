// Game state management
let gameState = {
  money: 100,
  seeds: {
    carrot: 0,
    apple: 0,
    corn: 0,
    winterBerry: 0,
    raspberry: 0,
    pumpkin: 0,
    strawberry: 0,
    potato: 0,
    tomato: 0,
    // Kas gewassen
    apricot: 0,
    peach: 0,
    kiwi: 0,
    mango: 0,
    dragon_fruit: 0,
  },
  fruits: {
    carrot: 0,
    apple: 0,
    corn: 0,
    winterBerry: 0,
    raspberry: 0,
    pumpkin: 0,
    strawberry: 0,
    potato: 0,
    tomato: 0,
    // Kas gewassen
    apricot: 0,
    peach: 0,
    kiwi: 0,
    mango: 0,
    dragon_fruit: 0,
  },
  farm: [],
  greenhouseFarm: [], // Aparte boerderij voor in de kas
  inGreenhouse: false, // Of de speler momenteel in de kas is
  day: 1,
  season: "Lente",
  wateringCan: true,
  water: 10,
  greenhouse: false, // Whether player has bought a greenhouse
  playerPosition: { x: 0, y: 0 }, // Player position on the map
  wellPosition: { x: 7, y: 1 }, // Well position outside the farm grid
  shopPosition: { x: 0, y: 5 }, // Shop position at bottom left
  greenhousePosition: { x: 0, y: 0 }, // Greenhouse position at top left
};

// Game mode
let wateringMode = false;
let infoMode = false;

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
  raspberry: {
    emoji: "🫐",
    name: "Framboos",
    seedPrice: 10,
    fruitPrice: 18,
    growthTime: 4, // days
    seasons: ["Zomer", "Herfst"], // Available in summer and autumn
  },
  strawberry: {
    emoji: "🍓",
    name: "Aardbei",
    seedPrice: 6,
    fruitPrice: 12,
    growthTime: 3, // days
    seasons: ["Lente", "Zomer"], // Available in spring and summer
  },
  pumpkin: {
    emoji: "🎃",
    name: "Pompoen",
    seedPrice: 20,
    fruitPrice: 35,
    growthTime: 8, // days
    seasons: ["Herfst"], // Only available in autumn
  },
  potato: {
    emoji: "🥔",
    name: "Aardappel",
    seedPrice: 4,
    fruitPrice: 7,
    growthTime: 5, // days
    seasons: ["Lente", "Herfst", "Winter"], // Available most seasons except summer
  },
  tomato: {
    emoji: "🍅",
    name: "Tomaat",
    seedPrice: 7,
    fruitPrice: 14,
    growthTime: 6, // days
    seasons: ["Zomer"], // Only available in summer
  },
  // Kas-specifieke gewassen (kunnen altijd groeien in de kas)
  apricot: {
    emoji: "🍑",
    name: "Abrikoos",
    seedPrice: 25,
    fruitPrice: 40,
    growthTime: 8, // days
    seasons: ["Kas"], // Only available in greenhouse
    greenhouseOnly: true,
  },
  peach: {
    emoji: "�",
    name: "Perzik",
    seedPrice: 30,
    fruitPrice: 50,
    growthTime: 10, // days
    seasons: ["Kas"], // Only available in greenhouse
    greenhouseOnly: true,
  },
  kiwi: {
    emoji: "🥝",
    name: "Kiwi",
    seedPrice: 35,
    fruitPrice: 60,
    growthTime: 12, // days
    seasons: ["Kas"], // Only available in greenhouse
    greenhouseOnly: true,
  },
  mango: {
    emoji: "🥭",
    name: "Mango",
    seedPrice: 40,
    fruitPrice: 70,
    growthTime: 14, // days
    seasons: ["Kas"], // Only available in greenhouse
    greenhouseOnly: true,
  },
  dragon_fruit: {
    emoji: "�",
    name: "Drakenvrucht",
    seedPrice: 50,
    fruitPrice: 90,
    growthTime: 16, // days
    seasons: ["Kas"], // Only available in greenhouse
    greenhouseOnly: true,
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
        raspberry: 0,
        pumpkin: 0,
        strawberry: 0,
        potato: 0,
        tomato: 0,
        // Kas gewassen
        apricot: 0,
        peach: 0,
        kiwi: 0,
        mango: 0,
        dragon_fruit: 0,
      },
      fruits: {
        carrot: 0,
        apple: 0,
        corn: 0,
        winterBerry: 0,
        raspberry: 0,
        pumpkin: 0,
        strawberry: 0,
        potato: 0,
        tomato: 0,
        // Kas gewassen
        apricot: 0,
        peach: 0,
        kiwi: 0,
        mango: 0,
        dragon_fruit: 0,
      },
      farm: [],
      greenhouseFarm: [],
      inGreenhouse: false,
      day: 1,
      season: "Lente",
      wateringCan: true,
      water: 10,
      greenhouse: false,
      playerPosition: { x: 0, y: 0 },
      wellPosition: { x: 7, y: 1 },
      shopPosition: { x: 0, y: 5 },
      greenhousePosition: { x: 0, y: 0 },
    };

    // Reset watering mode and info mode
    wateringMode = false;
    infoMode = false;

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
            if (!gameState.shopPosition) gameState.shopPosition = { x: 0, y: 5 };

            // Add new crops for backwards compatibility
            const newCrops = [
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
            newCrops.forEach((crop) => {
              if (gameState.seeds[crop] === undefined) gameState.seeds[crop] = 0;
              if (gameState.fruits[crop] === undefined) gameState.fruits[crop] = 0;
            });

            // Add greenhouse farm for backwards compatibility
            if (!gameState.greenhouseFarm) gameState.greenhouseFarm = [];
            if (gameState.inGreenhouse === undefined) gameState.inGreenhouse = false;

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
