// Klanten systeem voor de ijssalon
// Beheert beweging, bestelling en betaling van klanten

// Verschillende klant types met emoji's en voorkeuren
const customerTypes = [
  { emoji: "👧", name: "Meisje", favoriteIceCream: "strawberry", patience: 8 },
  { emoji: "👦", name: "Jongen", favoriteIceCream: "vanilla", patience: 6 },
  { emoji: "👵", name: "Oma", favoriteIceCream: "apple", patience: 10 },
  { emoji: "👴", name: "Opa", favoriteIceCream: "corn", patience: 9 },
  { emoji: "👱‍♀️", name: "Dame", favoriteIceCream: "berry_mix", patience: 7 },
  { emoji: "🧑", name: "Persoon", favoriteIceCream: "carrot", patience: 5 },
  { emoji: "👩", name: "Vrouw", favoriteIceCream: "tropical_paradise", patience: 12 },
  { emoji: "👨", name: "Man", favoriteIceCream: "autumn_harvest", patience: 8 }
];

// Klant states
const CustomerState = {
  ENTERING: "entering",      // Komt binnen
  WAITING: "waiting",        // Wacht in de rij
  ORDERING: "ordering",      // Aan de beurt bij balie
  MOVING_TO_TABLE: "moving_to_table", // Loopt naar tafeltje
  EATING: "eating",          // Eet aan tafeltje
  LEAVING: "leaving"         // Gaat weg
};

// Spawn een nieuwe klant
function spawnCustomer() {
  if (!gameState.inIceCreamShop) return;
  
  const customerType = customerTypes[Math.floor(Math.random() * customerTypes.length)];
  const customer = {
    id: gameState.nextCustomerId++,
    type: customerType,
    state: CustomerState.ENTERING,
    position: { x: 0, y: 5 }, // Start bij de ingang
    targetPosition: { x: 2, y: 2 }, // Loop naar midden rij positie
    patience: customerType.patience,
    maxPatience: customerType.patience,
    wantedIceCream: customerType.favoriteIceCream,
    moveTimer: 0,
    hasOrdered: false,
    tablePosition: null,
    eatingTimer: 0
  };
  
  gameState.customers.push(customer);
  console.log(`Nieuwe klant ${customer.type.name} is binnengekomen!`);
}

// Update alle klanten
function updateCustomers() {
  if (!gameState.inIceCreamShop) return;
  
  // Update spawn timer
  gameState.customerSpawnTimer++;
  if (gameState.customerSpawnTimer >= 30 && gameState.customers.length < 5) { // Elke 3 seconden (30 * 100ms), max 5 klanten
    spawnCustomer();
    gameState.customerSpawnTimer = 0;
  }
  
  // Update elke klant
  for (let i = gameState.customers.length - 1; i >= 0; i--) {
    const customer = gameState.customers[i];
    updateCustomer(customer);
    
    // Verwijder klanten die weggaan
    if (customer.state === CustomerState.LEAVING && 
        customer.position.x === 0 && customer.position.y === 5) {
      gameState.customers.splice(i, 1);
    }
  }
  
  // Update wachtrij
  updateQueuePositions();
}

// Update een enkele klant
function updateCustomer(customer) {
  customer.moveTimer++;
  
  switch (customer.state) {
    case CustomerState.ENTERING:
      // Beweeg naar de wachtrij
      if (customer.moveTimer >= 5) { // Beweeg elke 0.5 seconde (5 * 100ms)
        moveCustomerTowardsTarget(customer);
        customer.moveTimer = 0;
        
        // Check of klant de rij heeft bereikt
        if (customer.position.x === customer.targetPosition.x && 
            customer.position.y === customer.targetPosition.y) {
          customer.state = CustomerState.WAITING;
          addToQueue(customer);
          console.log(`Klant ${customer.type.name} heeft de rij bereikt`);
        }
      }
      break;
      
    case CustomerState.WAITING:
      // Wacht in de rij, verlies geduld
      customer.patience -= 0.01;
      if (customer.patience <= 0) {
        customer.state = CustomerState.LEAVING;
        customer.targetPosition = { x: 0, y: 5 };
        removeFromQueue(customer);
        showMessage(`${customer.type.name} wordt ongeduldig en gaat weg! 😞`, "error");
      }
      break;
      
    case CustomerState.ORDERING:
      // Wacht op bediening bij de balie
      customer.patience -= 0.005; // Langzamer geduld verlies bij balie
      if (customer.patience <= 0) {
        customer.state = CustomerState.LEAVING;
        customer.targetPosition = { x: 0, y: 5 };
        showMessage(`${customer.type.name} wacht te lang en gaat weg! 😞`, "error");
      }
      break;
      
    case CustomerState.MOVING_TO_TABLE:
      // Beweeg naar tafeltje
      if (customer.moveTimer >= 5) {
        moveCustomerTowardsTarget(customer);
        customer.moveTimer = 0;
        
        if (customer.position.x === customer.targetPosition.x && 
            customer.position.y === customer.targetPosition.y) {
          customer.state = CustomerState.EATING;
          customer.eatingTimer = 600; // 10 seconden eten
        }
      }
      break;
      
    case CustomerState.EATING:
      // Eet aan tafeltje
      customer.eatingTimer--;
      if (customer.eatingTimer <= 0) {
        customer.state = CustomerState.LEAVING;
        customer.targetPosition = { x: 0, y: 5 };
        customer.tablePosition = null; // Maak tafeltje vrij
      }
      break;
      
    case CustomerState.LEAVING:
      // Beweeg naar uitgang
      if (customer.moveTimer >= 5) {
        moveCustomerTowardsTarget(customer);
        customer.moveTimer = 0;
      }
      break;
  }
}

// Beweeg klant richting doel
function moveCustomerTowardsTarget(customer) {
  const dx = customer.targetPosition.x - customer.position.x;
  const dy = customer.targetPosition.y - customer.position.y;
  
  if (Math.abs(dx) > Math.abs(dy)) {
    // Beweeg horizontaal
    customer.position.x += dx > 0 ? 1 : -1;
  } else if (dy !== 0) {
    // Beweeg verticaal
    customer.position.y += dy > 0 ? 1 : -1;
  }
}

// Voeg klant toe aan wachtrij
function addToQueue(customer) {
  gameState.customerQueue.push(customer);
  const queuePosition = gameState.customerQueue.length - 1;
  
  if (queuePosition === 0) {
    // Eerste klant gaat direct naar balie
    moveCustomerToCounter(customer);
  } else {
    // Andere klanten wachten in rij
    const queueX = Math.min(4, queuePosition - 1); // Start vanaf positie 1 in rij
    customer.targetPosition = { x: queueX + 1, y: 2 };
  }
}

// Verwijder klant uit wachtrij
function removeFromQueue(customer) {
  const index = gameState.customerQueue.indexOf(customer);
  if (index !== -1) {
    gameState.customerQueue.splice(index, 1);
    updateQueuePositions();
  }
}

// Update wachtrij posities
function updateQueuePositions() {
  // Verwijder klanten die de winkel hebben verlaten uit de queue
  gameState.customerQueue = gameState.customerQueue.filter(customer => 
    !(customer.state === CustomerState.LEAVING && 
      customer.position.x === 0 && customer.position.y === 5)
  );
  
  // Zoek de eerste wachtende klant en stuur naar balie
  let foundOrderingCustomer = false;
  gameState.customerQueue.forEach((customer, index) => {
    if (!foundOrderingCustomer && customer.state === CustomerState.WAITING) {
      moveCustomerToCounter(customer);
      foundOrderingCustomer = true;
    } else if (customer.state === CustomerState.WAITING) {
      // Andere klanten wachten in rij
      const queuePosition = index - (foundOrderingCustomer ? 1 : 0);
      const queueX = Math.min(4, queuePosition);
      customer.targetPosition = { x: queueX + 1, y: 2 };
    }
  });
}

// Beweeg klant naar balie voor bestelling
function moveCustomerToCounter(customer) {
  customer.state = CustomerState.ORDERING;
  customer.targetPosition = { x: 5, y: 2 }; // Positie voor de balie (x=5 is balie area)
}

// Bedien de klant bij de balie
function serveCurrentCustomer(iceCreamType) {
  const currentCustomer = gameState.customerQueue[0];
  if (!currentCustomer || currentCustomer.state !== CustomerState.ORDERING) {
    showMessage("Er is geen klant om te bedienen!", "error");
    return false;
  }
  
  // Check of je het ijsje hebt
  if (gameState.iceCream[iceCreamType] <= 0) {
    showMessage(`Je hebt geen ${iceCreams[iceCreamType].name}!`, "error");
    return false;
  }
  
  // Verkoop het ijsje
  gameState.iceCream[iceCreamType]--;
  const price = iceCreams[iceCreamType].sellPrice;
  gameState.money += price;
  
  // Extra tip als het de favoriete smaak is
  let tip = 0;
  if (iceCreamType === currentCustomer.wantedIceCream) {
    tip = Math.floor(price * 0.2); // 20% tip
    gameState.money += tip;
    showMessage(`${currentCustomer.type.name} is blij met ${iceCreams[iceCreamType].name}! +€${price} +€${tip} tip! 😊`, "success");
  } else {
    showMessage(`${currentCustomer.type.name} koopt ${iceCreams[iceCreamType].name} voor €${price}! 💰`, "success");
  }
  
  // Zoek een vrij tafeltje
  const table = findFreeTable();
  if (table) {
    currentCustomer.state = CustomerState.MOVING_TO_TABLE;
    currentCustomer.targetPosition = table;
    currentCustomer.tablePosition = table;
  } else {
    // Geen tafeltje vrij, klant gaat direct weg
    currentCustomer.state = CustomerState.LEAVING;
    currentCustomer.targetPosition = { x: 0, y: 5 };
  }
  
  // Verwijder uit wachtrij
  removeFromQueue(currentCustomer);
  return true;
}

// Zoek een vrij tafeltje
function findFreeTable() {
  const tables = [
    { x: 1, y: 1 }, // Klein tafeltje
    { x: 1, y: 3 }, // Groot tafeltje
    { x: 2, y: 1 }, // Extra plaats bij klein tafeltje
    { x: 4, y: 1 }  // Extra plaats bij drankjes tafeltje
  ];
  
  for (const table of tables) {
    // Check of tafeltje bezet is
    const occupied = gameState.customers.some(customer => 
      customer.tablePosition && 
      customer.tablePosition.x === table.x && 
      customer.tablePosition.y === table.y
    );
    
    if (!occupied) {
      return table;
    }
  }
  
  return null; // Geen vrij tafeltje
}

// Get de huidige klant die bediend kan worden
function getCurrentCustomer() {
  if (gameState.customerQueue.length > 0 && 
      gameState.customerQueue[0].state === CustomerState.ORDERING) {
    return gameState.customerQueue[0];
  }
  return null;
}

// Maak functies globaal beschikbaar
window.updateCustomers = updateCustomers;
window.serveCurrentCustomer = serveCurrentCustomer;
window.getCurrentCustomer = getCurrentCustomer;
window.spawnCustomer = spawnCustomer;