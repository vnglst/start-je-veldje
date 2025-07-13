// Gewas data voor alle planten in het spel
const crops = {
  // ===== REGULIERE GEWASSEN =====
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
  pumpkin: {
    emoji: "🎃",
    name: "Pompoen",
    seedPrice: 20,
    fruitPrice: 35,
    growthTime: 8, // days
    seasons: ["Herfst"], // Only available in autumn
  },
  strawberry: {
    emoji: "🍓",
    name: "Aardbei",
    seedPrice: 6,
    fruitPrice: 12,
    growthTime: 3, // days
    seasons: ["Lente", "Zomer"], // Available in spring and summer
  },
  potato: {
    emoji: "🥔",
    name: "Aardappel",
    seedPrice: 4,
    fruitPrice: 7,
    growthTime: 4, // days
    seasons: ["Lente", "Herfst"], // Available in spring and autumn
  },
  tomato: {
    emoji: "🍅",
    name: "Tomaat",
    seedPrice: 8,
    fruitPrice: 14,
    growthTime: 5, // days
    seasons: ["Zomer"], // Only available in summer
  },

  // ===== KAS GEWASSEN (alleen beschikbaar in kas) =====
  apricot: {
    emoji: "🧡",
    name: "Abrikoos",
    seedPrice: 25,
    fruitPrice: 40,
    growthTime: 6, // days
    seasons: ["alle"], // Available all seasons in greenhouse
    greenhouseOnly: true,
  },
  peach: {
    emoji: "🍑",
    name: "Perzik",
    seedPrice: 30,
    fruitPrice: 50,
    growthTime: 7, // days
    seasons: ["alle"], // Available all seasons in greenhouse
    greenhouseOnly: true,
  },
  kiwi: {
    emoji: "🥝",
    name: "Kiwi",
    seedPrice: 35,
    fruitPrice: 60,
    growthTime: 8, // days
    seasons: ["alle"], // Available all seasons in greenhouse
    greenhouseOnly: true,
  },
  mango: {
    emoji: "🥭",
    name: "Mango",
    seedPrice: 50,
    fruitPrice: 70,
    growthTime: 10, // days
    seasons: ["alle"], // Available all seasons in greenhouse
    greenhouseOnly: true,
  },
  dragon_fruit: {
    emoji: "🐉",
    name: "Drakenvrucht",
    seedPrice: 60,
    fruitPrice: 90,
    growthTime: 12, // days
    seasons: ["alle"], // Available all seasons in greenhouse
    greenhouseOnly: true,
  },
};

// Export voor gebruik in andere modules
export { crops };