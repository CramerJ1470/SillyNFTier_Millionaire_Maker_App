// backend/models/TriggerModel.js

// Our in-memory "database" table for tracking active user trade targets
let triggersTable = [];
let nextId = 1;

/**
 * Creates and registers a new stock price trigger.
 * @param {Object} triggerData - The parameters for the trigger
 * @returns {Object} The newly created trigger record
 */
export async function createTrigger({ symbol, targetPrice, type, quantity, accountId }) {
  const newTrigger = {
    id: nextId++,
    symbol: symbol.toUpperCase(),
    targetPrice: parseFloat(targetPrice),
    type: type.toUpperCase(), // 'BUY' or 'SELL'
    quantity: parseInt(quantity, 10),
    accountId,
    isActive: true,
    createdAt: new Date()
  };

  triggersTable.push(newTrigger);
  console.log(`[DB] Created Trigger #${newTrigger.id} for ${newTrigger.symbol}`);
  return newTrigger;
}

/**
 * Retrieves all currently active triggers that the engine needs to monitor.
 * @returns {Array} List of active triggers
 */
export async function getActiveTriggers() {
  // Returns only the items where isActive is true
  return triggersTable.filter(trigger => trigger.isActive === true);
}

/**
 * Deactivates a trigger after it has been executed to prevent double-firing.
 * @param {number} id - The ID of the trigger to turn off
 * @returns {boolean} True if successfully deactivated, false if not found
 */
export async function deactivateTrigger(id) {
  const trigger = triggersTable.find(t => t.id === id);
  if (trigger) {
    trigger.isActive = false;
    trigger.executedAt = new Date();
    console.log(`[DB] Trigger #${id} has been deactivated/executed.`);
    return true;
  }
  return false;
}

/**
 * Debug helper to view the entire internal state of the database.
 * @returns {Array} All triggers (active and inactive)
 */
export async function getAllTriggersDebug() {
  return triggersTable;
}

/**
 * Manually cancels an active trigger by user request.
 * @param {number} id - The ID of the trigger to cancel
 * @returns {boolean} True if successfully canceled
 */
export async function cancelTriggerByUser(id) {
  const trigger = triggersTable.find(t => t.id === parseInt(id, 10));
  if (trigger && trigger.isActive) {
    trigger.isActive = false;
    trigger.status = 'CANCELED_BY_USER';
    trigger.executedAt = new Date();
    console.log(`[DB] Trigger #${id} was MANUALLY canceled by the user.`);
    return true;
  }
  return false;
}