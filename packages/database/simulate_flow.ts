import fetch from 'node-fetch';

const API_URL = 'http://localhost:3001/api';
const WEBHOOK_URL = 'http://localhost:3001/api/webhooks/manychat';
const SECRET = process.env.MANYCHAT_WEBHOOK_SECRET || 'click_mc_secret_2026';

async function simulate() {
  console.log('--- STARTING MANYCHAT FLOW SIMULATION ---');

  // 1. Create Order
  const menuRes = await fetch(`${API_URL}/r/casa-antigua/menu`);
  const menu = await menuRes.json();
  const itemId = menu.categories[0].items[0].id;

  const orderRes = await fetch(`${API_URL}/r/casa-antigua/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: "Simulation User",
      customerPhone: "12345678",
      items: [{ menuItemId: itemId, quantity: 1 }]
    })
  });
  const order = await orderRes.json();
  const orderId = order.id;
  console.log(`Step 1: Order Created [${orderId}] - Status: PENDING`);

  // 2. Webhook ACCEPT
  await callWebhook(orderId, 'ACCEPT');
  console.log('Step 2: Webhook ACCEPT sent.');

  // 3. Webhook READY
  await callWebhook(orderId, 'READY');
  console.log('Step 3: Webhook READY sent.');

  // 4. Webhook COMPLETE
  await callWebhook(orderId, 'COMPLETE');
  console.log('Step 4: Webhook COMPLETE sent.');

  console.log('--- SIMULATION FINISHED ---');
}

async function callWebhook(orderId, action) {
  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, action, secret: SECRET })
  });
  const data = await res.json();
  if (data.success) {
    console.log(`Action ${action} result: ${data.newStatus}`);
  } else {
    console.error(`Action ${action} failed:`, data.error);
  }
}

simulate().catch(console.error);
