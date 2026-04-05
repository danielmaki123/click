import { db } from './packages/database/src/index.js';

async function main() {
  try {
    const restaurants = await db.restaurant.findMany();
    console.log('Success! Found restaurants:', restaurants.length);
    process.exit(0);
  } catch (e) {
    console.error('Failed to connect:', e);
    process.exit(1);
  }
}

main();
