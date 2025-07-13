// Klanten systeem voor de ijssalon
// Beheert beweging, bestelling en betaling van klanten

// Verschillende klant types met emoji's en voorkeuren
const customerTypes = [
  { emoji: "👧", name: "Sanne", favoriteIceCream: "strawberry", patience: 8 },
  { emoji: "👦", name: "Daan", favoriteIceCream: "vanilla", patience: 6 },
  { emoji: "👵", name: "Gerda", favoriteIceCream: "apple", patience: 10 },
  { emoji: "👴", name: "Henk", favoriteIceCream: "corn", patience: 9 },
  { emoji: "👱‍♀️", name: "Lisa", favoriteIceCream: "berry_mix", patience: 7 },
  { emoji: "🧑", name: "Robin", favoriteIceCream: "carrot", patience: 5 },
  { emoji: "👩", name: "Sophie", favoriteIceCream: "tropical_paradise", patience: 12 },
  { emoji: "👨", name: "Mark", favoriteIceCream: "autumn_harvest", patience: 8 },
  { emoji: "👩‍🦰", name: "Emma", favoriteIceCream: "veggie_surprise", patience: 9 },
  { emoji: "🧔", name: "Tom", favoriteIceCream: "summer_festival", patience: 6 },
  { emoji: "👩‍🦳", name: "Anouk", favoriteIceCream: "golden_treasure", patience: 11 },
];

// Klant states
const CustomerState = {
  ENTERING: "entering", // Komt binnen
  WAITING: "waiting", // Wacht in de rij
  ORDERING: "ordering", // Aan de beurt bij balie
  MOVING_TO_TABLE: "moving_to_table", // Loopt naar tafeltje
  EATING: "eating", // Eet aan tafeltje
  LEAVING: "leaving", // Gaat weg
};

// Spawn een nieuwe klant
function spawnCustomer() {
  if (!gameState.inIceCreamShop) return;

  const customerType = customerTypes[Math.floor(Math.random() * customerTypes.length)];

  // Kies een willekeurig ijsje dat de klant wil, met hogere kans op favoriet
  let wantedIceCream;
  const availableIceCreams = Object.keys(iceCreams);

  if (Math.random() < 0.6) {
    // 60% kans op favoriet ijsje
    wantedIceCream = customerType.favoriteIceCream;
  } else {
    // 40% kans op willekeurig ander ijsje
    wantedIceCream = availableIceCreams[Math.floor(Math.random() * availableIceCreams.length)];
  }

  const customer = {
    id: gameState.nextCustomerId++,
    type: customerType,
    state: CustomerState.ENTERING,
    position: { x: 0, y: 5 }, // Start bij de ingang
    targetPosition: { x: 2, y: 2 }, // Loop naar midden rij positie
    patience: customerType.patience,
    maxPatience: customerType.patience,
    wantedIceCream: wantedIceCream,
    favoriteIceCream: customerType.favoriteIceCream, // Bewaar ook het originele favoriet
    moveTimer: 0,
    hasOrdered: false,
    tablePosition: null,
    eatingTimer: 0,
  };

  gameState.customers.push(customer);
  console.log(`Nieuwe klant ${customer.type.name} is binnengekomen en wil ${iceCreams[wantedIceCream].name}!`);
}

// Update alle klanten
function updateCustomers() {
  if (!gameState.inIceCreamShop) return;

  // Update spawn timer
  gameState.customerSpawnTimer++;
  if (gameState.customerSpawnTimer >= 30 && gameState.customers.length < 5) {
    // Elke 3 seconden (30 * 100ms), max 5 klanten
    spawnCustomer();
    gameState.customerSpawnTimer = 0;
  }

  // Update elke klant
  for (let i = gameState.customers.length - 1; i >= 0; i--) {
    const customer = gameState.customers[i];
    updateCustomer(customer);

    // Verwijder klanten die weggaan
    if (customer.state === CustomerState.LEAVING && customer.position.x === 0 && customer.position.y === 5) {
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
      if (customer.moveTimer >= 5) {
        // Beweeg elke 0.5 seconde (5 * 100ms)
        moveCustomerTowardsTarget(customer);
        customer.moveTimer = 0;

        // Check of klant de rij heeft bereikt
        if (customer.position.x === customer.targetPosition.x && customer.position.y === customer.targetPosition.y) {
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
      // Als klant nog niet bij balie is, beweeg verder
      if (customer.position.x !== customer.targetPosition.x || customer.position.y !== customer.targetPosition.y) {
        if (customer.moveTimer >= 5) {
          moveCustomerTowardsTarget(customer);
          customer.moveTimer = 0;
        }
      }

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

        if (customer.position.x === customer.targetPosition.x && customer.position.y === customer.targetPosition.y) {
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
  // Laat updateQueuePositions de posities bepalen
  updateQueuePositions();
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
  gameState.customerQueue = gameState.customerQueue.filter(
    (customer) => !(customer.state === CustomerState.LEAVING && customer.position.x === 0 && customer.position.y === 5)
  );

  // Fix: reset alle klanten behalve de eerste terug naar waiting state
  let orderingCount = 0;
  gameState.customerQueue.forEach((customer) => {
    if (customer.state === CustomerState.ORDERING) {
      if (orderingCount === 0) {
        // Eerste ordering klant mag blijven
        orderingCount++;
      } else {
        // Andere klanten terug naar waiting
        customer.state = CustomerState.WAITING;
      }
    }
  });

  // Tel hoeveel klanten er al aan de balie/in de rij staan
  let waitingCount = 0;
  orderingCount = 0;

  gameState.customerQueue.forEach((customer) => {
    if (customer.state === CustomerState.ORDERING) {
      orderingCount++;
    } else if (customer.state === CustomerState.WAITING) {
      if (waitingCount === 0 && orderingCount === 0) {
        // Alleen als er nog niemand bij de balie staat
        moveCustomerToCounter(customer);
      } else if (waitingCount <= 8) {
        // Rij posities: x=4,3,2,1 met elk max 2 klanten (y=2 en y=3)
        const queueIndex = waitingCount - 1; // 0-7 voor 8 rij posities
        const queueX = 4 - Math.floor(queueIndex / 2); // x=4,4,3,3,2,2,1,1
        const queueY = (queueIndex % 2) + 2; // y=2,3,2,3,2,3,2,3
        customer.targetPosition = { x: queueX, y: queueY };
      } else {
        // Te veel klanten - laat ze verder bij de ingang wachten
        customer.targetPosition = { x: 0, y: 2 + (waitingCount % 3) }; // Verdeel over y=2,3,4
      }
      waitingCount++;
    }
  });
}

// Beweeg klant naar balie voor bestelling
function moveCustomerToCounter(customer) {
  customer.state = CustomerState.ORDERING;
  customer.targetPosition = { x: 5, y: 2 }; // Positie voor de balie (links van balie)
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

  // Check of klant dit ijsje wil
  if (iceCreamType !== currentCustomer.wantedIceCream) {
    showMessage(
      `${currentCustomer.type.name} wil geen ${iceCreams[iceCreamType].name}, maar ${
        iceCreams[currentCustomer.wantedIceCream].name
      }! 😕`,
      "error"
    );
    return false;
  }

  // Verkoop het ijsje
  gameState.iceCream[iceCreamType]--;
  const price = iceCreams[iceCreamType].sellPrice;
  gameState.money += price;

  // Extra tip als het ook hun favoriete smaak is
  let tip = 0;
  if (iceCreamType === currentCustomer.favoriteIceCream) {
    tip = Math.floor(price * 0.3); // 30% extra tip voor favoriet
    gameState.money += tip;
    showMessage(
      `${currentCustomer.type.name} is heel blij met hun favoriete ${iceCreams[iceCreamType].name}! +€${price} +€${tip} extra tip! 😍`,
      "success"
    );
  } else {
    showMessage(`${currentCustomer.type.name} koopt ${iceCreams[iceCreamType].name} voor €${price}! 😊`, "success");
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
    { x: 4, y: 1 }, // Extra plaats bij drankjes tafeltje
  ];

  for (const table of tables) {
    // Check of tafeltje bezet is
    const occupied = gameState.customers.some(
      (customer) =>
        customer.tablePosition && customer.tablePosition.x === table.x && customer.tablePosition.y === table.y
    );

    if (!occupied) {
      return table;
    }
  }

  return null; // Geen vrij tafeltje
}

// Get de huidige klant die bediend kan worden
function getCurrentCustomer() {
  if (gameState.customerQueue.length > 0 && gameState.customerQueue[0].state === CustomerState.ORDERING) {
    return gameState.customerQueue[0];
  }
  return null;
}

// Maak functies globaal beschikbaar
window.updateCustomers = updateCustomers;
window.serveCurrentCustomer = serveCurrentCustomer;
window.getCurrentCustomer = getCurrentCustomer;
window.spawnCustomer = spawnCustomer;
