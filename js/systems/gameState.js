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
  iceCreamShopPosition: { x: 7, y: 0 }, // IJswinkel positie rechts boven
  iceCreamMachinePosition: { x: 0, y: 1 }, // IJsmachine positie links midden
  // Ijs inventaris toevoegen
  iceCream: {
    vanilla: 0,
    strawberry: 0,
    apple: 0,
    carrot: 0,
    corn: 0,
    berry_mix: 0,
    // Speciale combinatie recepten
    tropical_paradise: 0,
    autumn_harvest: 0,
    rainbow_deluxe: 0,
    veggie_surprise: 0,
    summer_festival: 0,
    golden_treasure: 0,
  },
};

// IJs data (zonder regenboog, mint, chocolade)
const iceCreams = {
  vanilla: {
    emoji: "🍦",
    name: "Vanille IJs",
    price: 15,
    sellPrice: 110, // Verkoop prijs (minder dan koop prijs)
    description: "Klassiek vanille ijs",
    happiness: 5,
  },
  // Fruit-gebaseerde ijsjes (gemaakt van je eigen gewassen)
  strawberry: {
    emoji: "🍓",
    name: "Aardbei IJs",
    price: 20,
    sellPrice: 135, // Verkoop prijs - 2 aardbeien (€24) + winst!
    description: "Fris aardbei ijs",
    happiness: 7,
    canCraft: true,
    recipe: { strawberry: 2 }, // 2 aardbeien nodig
  },
  apple: {
    emoji: "🍎",
    name: "Appel IJs",
    price: 25,
    sellPrice: 150, // Verkoop prijs - 3 appels (€45) + winst!
    description: "Zoet appel ijs",
    happiness: 8,
    canCraft: true,
    recipe: { apple: 3 }, // 3 appels nodig
  },
  carrot: {
    emoji: "🥕",
    name: "Wortel IJs",
    price: 22,
    sellPrice: 125, // Verkoop prijs - 2 wortels (€16) + winst!
    description: "Uniek wortel ijs (gezond!)",
    happiness: 9,
    canCraft: true,
    recipe: { carrot: 2 }, // 2 wortels nodig
  },
  corn: {
    emoji: "🌽",
    name: "Maïs IJs",
    price: 28,
    sellPrice: 150, // Verkoop prijs - 2 maïs (€40) + winst!
    description: "Exotisch maïs ijs",
    happiness: 10,
    canCraft: true,
    recipe: { corn: 2 }, // 2 maïs nodig
  },
  berry_mix: {
    emoji: "🫐",
    name: "Bessen Mix IJs",
    price: 35,
    sellPrice: 160, // Verkoop prijs - 1 winterbes (€25) + 1 framboos (€18) + winst!
    description: "Deluxe bessen combinatie",
    happiness: 12,
    canCraft: true,
    recipe: { winterBerry: 1, raspberry: 1 }, // 1 winterbes + 1 framboos
  },

  // ===== SPECIALE COMBINATIE RECEPTEN =====
  tropical_paradise: {
    emoji: "🏝️",
    name: "Tropisch Paradijs IJs",
    price: 80,
    sellPrice: 550, // 2 mango (€140) + kiwi (€60) + drakenvrucht (€90) = €290 + flinke winst!
    description: "Exotische tropische vruchten mix - exclusief!",
    happiness: 20,
    canCraft: true,
    recipe: { mango: 2, kiwi: 1, dragon_fruit: 1 }, // Kas gewassen
    rarity: "legendary",
  },

  autumn_harvest: {
    emoji: "🍂",
    name: "Herfst Oogst IJs",
    price: 60,
    sellPrice: 390, // 2 appels (€30) + pompoen (€35) + aardappel (€7) = €72 + winst!
    description: "Rijke herfst smaken combinatie",
    happiness: 16,
    canCraft: true,
    recipe: { apple: 2, pumpkin: 1, potato: 1 },
    rarity: "epic",
  },

  rainbow_deluxe: {
    emoji: "🌈",
    name: "Regenboog Deluxe IJs",
    price: 100,
    sellPrice: 420, // 1 aardbei (€12) + 1 appel (€15) + 1 maïs (€20) + 1 winterbes (€25) + 1 wortel (€8) = €80 + winst!
    description: "Alle kleuren van de regenboog - ultiem!",
    happiness: 25,
    canCraft: true,
    recipe: { strawberry: 1, apple: 1, corn: 1, winterBerry: 1, carrot: 1 },
    rarity: "mythical",
  },

  veggie_surprise: {
    emoji: "🥗",
    name: "Groente Verrassing IJs",
    price: 45,
    sellPrice: 255, // 2 wortels (€16) + aardappel (€7) + tomaat (€14) = €37 + winst!
    description: "Verrassend lekker groente ijs",
    happiness: 14,
    canCraft: true,
    recipe: { carrot: 2, potato: 1, tomato: 1 },
    rarity: "rare",
  },

  summer_festival: {
    emoji: "🎪",
    name: "Zomer Festival IJs",
    price: 55,
    sellPrice: 375, // 2 aardbeien (€24) + framboos (€18) + tomaat (€14) = €56 + winst!
    description: "Feestelijke zomer smaak combinatie",
    happiness: 17,
    canCraft: true,
    recipe: { strawberry: 2, raspberry: 1, tomato: 1 },
    rarity: "epic",
  },

  golden_treasure: {
    emoji: "💰",
    name: "Gouden Schat IJs",
    price: 120,
    sellPrice: 1000, // 2 mango (€140) + 2 drakenvrucht (€180) + perzik (€50) + abrikoos (€40) = €410 + winst!
    description: "De meest waardevolle ijscreatie - zeldzaam!",
    happiness: 30,
    canCraft: true,
    recipe: { mango: 2, dragon_fruit: 2, peach: 1, apricot: 1 },
    rarity: "mythical",
  },
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
    // Clear all localStorage data for this game
    localStorage.removeItem("startJeVeldje");

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
      iceCreamShopPosition: { x: 7, y: 0 },
      iceCreamMachinePosition: { x: 0, y: 1 },
      // Ijs inventaris resetten (alle types inclusief speciale recepten)
      iceCream: {
        vanilla: 0,
        strawberry: 0,
        apple: 0,
        carrot: 0,
        corn: 0,
        berry_mix: 0,
        // Speciale combinatie recepten
        tropical_paradise: 0,
        autumn_harvest: 0,
        rainbow_deluxe: 0,
        veggie_surprise: 0,
        summer_festival: 0,
        golden_treasure: 0,
      },
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
            if (!gameState.iceCreamShopPosition) gameState.iceCreamShopPosition = { x: 7, y: 0 };
            if (!gameState.iceCreamMachinePosition) gameState.iceCreamMachinePosition = { x: 0, y: 1 };

            // Add ice cream inventory for backwards compatibility
            if (!gameState.iceCream) {
              gameState.iceCream = {
                vanilla: 0,
                strawberry: 0,
                apple: 0,
                carrot: 0,
                corn: 0,
                berry_mix: 0,
                // Speciale combinatie recepten
                tropical_paradise: 0,
                autumn_harvest: 0,
                rainbow_deluxe: 0,
                veggie_surprise: 0,
                summer_festival: 0,
                golden_treasure: 0,
              };
            } else {
              // Add new ice cream types to existing saves (inclusief speciale recepten)
              const newIceCreams = [
                "apple",
                "carrot",
                "corn",
                "berry_mix",
                "tropical_paradise",
                "autumn_harvest",
                "rainbow_deluxe",
                "veggie_surprise",
                "summer_festival",
                "golden_treasure",
              ];
              newIceCreams.forEach((iceCream) => {
                if (gameState.iceCream[iceCream] === undefined) {
                  gameState.iceCream[iceCream] = 0;
                }
              });
              // Remove old ice cream types
              delete gameState.iceCream.chocolate;
              delete gameState.iceCream.mint;
              delete gameState.iceCream.rainbow;
            }

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
