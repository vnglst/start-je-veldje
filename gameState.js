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
