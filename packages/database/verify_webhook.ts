import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const db = new PrismaClient();

async function verify() {
  const order = await db.order.findFirst({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' }
  });

  if (!order) {
    console.error('No pending order found to test.');
    process.exit(1);
  }

  console.log(`Testing Order ID: ${order.id} (Status: ${order.status})`);

  const secret = process.env.MANYCHAT_WEBHOOK_SECRET || 'click_mc_secret_2026';
  const res = await fetch('http://localhost:3001/api/webhooks/manychat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId: order.id,
      action: 'ACCEPT',
      secret: secret
    })
  });

  const data = await res.json();
  console.log('Webhook Response:', JSON.stringify(data, null, 2));

  const updatedOrder = await db.order.findUnique({ where: { id: order.id } });
  console.log(`New Status in DB: ${updatedOrder.status}`);
  console.log(`Accepted At: ${updatedOrder.acceptedAt}`);

  if (updatedOrder.status === 'ACCEPTED' && updatedOrder.acceptedAt) {
    console.log('--- TEST SUCCESS ---');
  } else {
    console.log('--- TEST FAILED ---');
  }
}

verify().finally(() => db.$disconnect());
