# Start je Veldje - Game Development Instructions

## Project Overview

"Start je Veldje" is a simple farming game inspired by Stardew Valley, built as a single HTML file with vanilla JavaScript. The game allows players to:

- Buy seeds from a shop
- Plant seeds on farm plots
- Wait for crops to grow
- Harvest and sell crops for profit

## Current Game Features

### Core Mechanics

1. **Economy System**: Players start with €100 and can earn money by selling crops
2. **Farming System**: 24 farm plots (6x4 grid) where players can plant crops
3. **Growth System**: Crops take time to grow (5-10 seconds depending on type)
4. **Inventory Management**: Track seeds and harvested fruits

### Available Crops

- **Carrot** 🥕: Cost €5, Sells for €8, Grows in 5 seconds
- **Apple** 🍎: Cost €8, Sells for €15, Grows in 8 seconds
- **Corn** 🌽: Cost €12, Sells for €20, Grows in 10 seconds

### UI Components

- **Game Stats**: Display money, seed count, and fruit count
- **Farm Grid**: Interactive 6x4 grid of farm plots
- **Shop**: Buy different types of seeds
- **Inventory**: View owned items and sell fruits
- **Messages**: Success/error feedback to player

## Technical Implementation

### File Structure

- Single `index.html` file containing HTML, CSS, and JavaScript
- Uses emoji for graphics (🌱🥕🍎🌽🚜💰)
- Responsive design with CSS Grid
- Local storage for save/load functionality

### Game State Management

```javascript
gameState = {
    money: number,
    seeds: { carrot: number, apple: number, corn: number },
    fruits: { carrot: number, apple: number, corn: number },
    farm: Array<Plot>
}
```

### Key Functions

- `buySeeds(cropType)`: Purchase seeds from shop
- `plantSeed(plotIndex)`: Plant available seed on farm plot
- `harvestCrop(plotIndex)`: Collect grown crops
- `sellFruit(fruitType)`: Sell harvested fruits
- `updateUI()`: Refresh all display elements

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

### Adding New Crops

1. Add crop data to `crops` object with emoji, prices, and growth time
2. Add shop item HTML in sidebar
3. Update `buySeeds()` function to handle new crop
4. No other changes needed - system is extensible

### Adding New Features

1. Consider game balance (progression, pricing)
2. Maintain simple, intuitive UI
3. Use emoji or simple graphics for consistency
4. Add user feedback for all actions
5. Test on mobile devices

### Code Standards

- Use descriptive variable names
- Comment complex logic
- Keep functions small and focused
- Maintain consistent formatting
- Handle edge cases (no money, no seeds, etc.)

## Running the Game

Simply open `index.html` in any modern web browser. No build process or dependencies required.

## Save System

Game automatically saves progress to localStorage every 5 seconds and loads on page refresh.
