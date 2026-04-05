import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main() {
  const order = await db.order.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { id: true, orderNumber: true, status: true }
  });
  console.log(JSON.stringify(order, null, 2));
}

main().finally(() => db.$disconnect());
