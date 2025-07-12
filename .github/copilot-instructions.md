# Start je Veldje - Game Development Instructions

## Project Overview

"Start je Veldje" is a farming game inspired by Stardew Valley, built with modular HTML, CSS and JavaScript. The game allows players to:

- Buy seeds from a shop
- Plant seeds on farm plots
- Water plants daily for growth
- Wait for crops to grow over multiple days
- Harvest and sell crops for profit

## Current Game Features

### Core Mechanics

1. **Economy System**: Players start with €100 and can earn money by selling crops
2. **Farming System**: 24 farm plots (6x4 grid) where players can plant crops
3. **Water System**: Plants need daily watering to grow properly
4. **Growth System**: Crops take multiple days to grow (3-7 days depending on type)
5. **Day/Night Cycle**: Sleep to advance to next day
6. **Seasonal System**: Seasons change every 30 days
7. **Inventory Management**: Track seeds, fruits, and water

### Available Crops

- **Carrot** 🥕: Cost €5, Sells for €8, Grows in 3 days
- **Apple** 🍎: Cost €8, Sells for €15, Grows in 5 days
- **Corn** 🌽: Cost €12, Sells for €20, Grows in 7 days

### UI Components

- **Game Stats**: Display money, seed count, fruit count, water, day, and season
- **Farm Grid**: Interactive 6x4 grid of farm plots with visual feedback
- **Shop**: Buy different types of seeds and water
- **Inventory**: View owned items and sell fruits
- **Tools**: Watering can toggle mode
- **Sleep Button**: Advance to next day
- **Messages**: Success/error feedback to player

## Technical Implementation

### File Structure (Modular Architecture)

```
start-je-veldje/
├── index-clean.html    # Main game page (modular version)
├── index.html          # Legacy single-file version
├── styles.css          # All CSS styling organized by component
├── gameState.js        # Game state management and save/load
├── ui.js              # UI update and display functions
├── farm.js            # Farm management (planting, harvesting, watering)
├── shop.js            # Shop and inventory functions
├── game.js            # Game mechanics (sleep, seasons, watering mode)
├── main.js            # Initialization and auto-save
├── README.md          # Project documentation
└── .github/
    └── copilot-instructions.md  # This file
```

### Game State Management

```javascript
gameState = {
    money: number,
    seeds: { carrot: number, apple: number, corn: number },
    fruits: { carrot: number, apple: number, corn: number },
    farm: Array<Plot>,
    day: number,
    season: string,
    water: number
}

Plot = {
    planted: boolean,
    cropType: string | null,
    plantedDay: number | null,
    grown: boolean,
    watered: boolean,
    lastWateredDay: number | null
}
```

### Key Functions by Module

**gameState.js**

- Game data storage
- `saveGame()` / `loadGame()` - LocalStorage persistence
- Crop configuration object

**ui.js**

- `updateUI()` - Refresh all display elements
- `updateInventory()` - Show seeds and fruits in sidebar
- `updateFarmDisplay()` - Visual farm state with watering indicators
- `showMessage()` - User feedback system

**farm.js**

- `initializeFarm()` - Create 24 farm plots
- `plantSeed(plotIndex)` - Plant available seed on farm plot
- `harvestCrop(plotIndex)` - Collect grown crops
- `waterPlant(plotIndex)` - Give water to plants

**shop.js**

- `buySeeds(cropType)` - Purchase seeds from shop
- `buyWater()` - Purchase water for watering can
- `sellFruit(fruitType)` - Sell harvested fruits

**game.js**

- `sleep()` - Advance day, check crop growth, handle seasons
- `toggleWateringMode()` - Switch between planting and watering modes

**main.js**

- `initializeGame()` - Setup and load saved game
- `startAutoSave()` - Auto-save every 5 seconds

## Future Enhancement Ideas

### Gameplay Features

1. **More Crops**: Add berries, tomatoes, wheat, etc.
2. **Seasons**: Different crops available in different seasons
3. **Weather**: Rain boosts growth, drought slows it
4. **Tools**: Watering can, fertilizer, sprinkler systems
5. **Animals**: Chickens, cows for eggs/milk
6. **Buildings**: Barn, greenhouse, storage silos
7. **Quests**: NPCs with farming tasks
8. **Market Prices**: Fluctuating crop values
9. **Upgrades**: Bigger farm, faster growth, better tools

### Technical Improvements

1. **Framework Migration**: Consider Vue.js or React for complex features
2. **Graphics**: Replace emoji with custom SVG sprites
3. **Sound Effects**: Add audio feedback for actions
4. **Animations**: Smooth transitions and effects
5. **Mobile Optimization**: Touch-friendly controls
6. **Multiplayer**: Share farms with friends
7. **Cloud Save**: Sync progress across devices

### Code Structure

1. **Modularization**: Split into separate JS/CSS files
2. **TypeScript**: Add type safety
3. **State Management**: Implement proper state patterns
4. **Testing**: Add unit tests for game logic
5. **Build Process**: Use bundler for optimization

## Development Guidelines

### Water System Mechanics

1. Plants must be watered daily to continue growing
2. Visual indicators show which plants need water (darker, red timer)
3. Water can be purchased in shop (5 units for €3)
4. Watering mode toggle changes plot click behavior
5. Plants only grow when they have enough days AND were watered the previous day

### Adding New Crops

1. Add crop data to `crops` object in `gameState.js`
2. Add shop item HTML in `index-clean.html`
3. Add to gameState seeds/fruits objects
4. No other changes needed - system is fully extensible

### Adding New Features

1. **New UI Elements**: Add to `index-clean.html` and style in `styles.css`
2. **New Game Logic**: Add functions to appropriate module file
3. **New Data**: Extend gameState object in `gameState.js`
4. **Visual Feedback**: Use `showMessage()` for user communication

### Code Organization Principles

- **Separation of Concerns**: Each file handles one aspect of the game
- **Modular Functions**: Functions are focused and reusable
- **Consistent Naming**: Use descriptive variable and function names
- **Error Handling**: Always check for edge cases (no money, no seeds, etc.)
- **Visual Feedback**: Provide clear feedback for all user actions

## Running the Game

### Development

- Open `index-clean.html` in browser for modular version
- Open `index.html` for legacy single-file version
- No build process required - pure HTML/CSS/JS

### File Dependencies

Load order in HTML:

1. `gameState.js` - Must be first (defines global state)
2. `ui.js` - UI functions
3. `farm.js` - Farm functions
4. `shop.js` - Shop functions
5. `game.js` - Game mechanics
6. `main.js` - Must be last (initializes everything)

## Save System

Game automatically saves progress to localStorage every 5 seconds and loads on page refresh.
