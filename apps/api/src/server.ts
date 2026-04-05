// apps/api/src/server.ts
import fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { db } from '@local/database';

dotenv.config();

const server = fastify({ logger: true });

import { menuRoutes } from './routes/menu.js';
import { orderRoutes } from './routes/orders.js';
import { webhookRoutes } from './routes/webhooks.js';

// Configuration
server.register(cors, {
  origin: 'http://localhost:3000',
});

// Register routes
server.register(menuRoutes, { prefix: '/api' });
server.register(orderRoutes, { prefix: '/api' });
server.register(webhookRoutes, { prefix: '/api/webhooks' });

// Health check
server.get('/health', async () => {
  try {
    await db.$queryRaw`SELECT 1`;
    return { status: 'ok', database: 'connected' };
  } catch (err) {
    server.log.error(err);
    return { status: 'error', database: 'disconnected' };
  }
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 API ready at http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
