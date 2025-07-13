// Limonade data - gemaakt van alle fruit en groenten
const lemonades = {
  // Basis fruit limonades
  strawberry_lemonade: {
    emoji: "🍓🧃",
    name: "Aardbei Limonade",
    sellPrice: 85, // Iets minder dan ijs maar nog steeds winstgevend
    description: "Verfrissende aardbei limonade",
    happiness: 6,
    canCraft: true,
    recipe: { strawberry: 2 }, // 2 aardbeien nodig
    rarity: "basic",
  },
  apple_lemonade: {
    emoji: "🍎🧃",
    name: "Appel Limonade",
    sellPrice: 95,
    description: "Zoete appel limonade",
    happiness: 7,
    canCraft: true,
    recipe: { apple: 2 }, // 2 appels nodig
    rarity: "basic",
  },
  carrot_juice: {
    emoji: "🥕🧃",
    name: "Wortel Sap",
    sellPrice: 80,
    description: "Gezond wortel sap (vol vitamines!)",
    happiness: 8,
    canCraft: true,
    recipe: { carrot: 3 }, // 3 wortels nodig
    rarity: "basic",
  },
  corn_smoothie: {
    emoji: "🌽🧃",
    name: "Maïs Smoothie",
    sellPrice: 90,
    description: "Crèmige maïs smoothie",
    happiness: 8,
    canCraft: true,
    recipe: { corn: 2 }, // 2 maïs nodig
    rarity: "basic",
  },

  // Mix limonades (zeldzamer)
  berry_mix_lemonade: {
    emoji: "🍓🍎🧃",
    name: "Bessen Mix Limonade",
    sellPrice: 160,
    description: "Perfecte mix van aardbei en appel",
    happiness: 12,
    canCraft: true,
    recipe: { strawberry: 2, apple: 2 }, // 2 aardbeien + 2 appels
    rarity: "rare",
  },
  veggie_surprise: {
    emoji: "🥕🌽🧃",
    name: "Groente Verrassing",
    sellPrice: 145,
    description: "Verrassend lekkere groente mix",
    happiness: 10,
    canCraft: true,
    recipe: { carrot: 2, corn: 1 }, // 2 wortels + 1 maïs
    rarity: "rare",
  },
  
  // Premium limonades (episch)
  summer_paradise: {
    emoji: "🍓🍎🥕🧃",
    name: "Zomer Paradijs",
    sellPrice: 275,
    description: "Ultieme zomer verfrissing met 3 smaken",
    happiness: 18,
    canCraft: true,
    recipe: { strawberry: 2, apple: 2, carrot: 1 }, // Mix van alles
    rarity: "epic",
  },
  harvest_celebration: {
    emoji: "🍎🌽🥕🧃",
    name: "Oogst Feest",
    sellPrice: 250,
    description: "Vier de oogst met deze speciale mix",
    happiness: 16,
    canCraft: true,
    recipe: { apple: 2, corn: 2, carrot: 1 }, // Oogst mix
    rarity: "epic",
  },

  // Legendarische limonades
  rainbow_delight: {
    emoji: "🌈🧃",
    name: "Regenboog Genot",
    sellPrice: 400,
    description: "Magische limonade met alle smaken van de regenboog",
    happiness: 25,
    canCraft: true,
    recipe: { strawberry: 3, apple: 3, carrot: 2, corn: 2 }, // Van alles veel
    rarity: "legendary",
  },
  
  // Mythische limonade (heel zeldzaam)
  golden_elixir: {
    emoji: "✨🧃",
    name: "Gouden Elixer",
    sellPrice: 600,
    description: "Mythische limonade die geluk en voorspoed brengt",
    happiness: 35,
    canCraft: true,
    recipe: { strawberry: 5, apple: 5, carrot: 3, corn: 3 }, // Heel veel ingrediënten
    rarity: "mythical",
  },
};

// Exporteer voor gebruik in andere bestanden
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { lemonades };
} else if (typeof window !== 'undefined') {
  window.lemonades = lemonades;
}