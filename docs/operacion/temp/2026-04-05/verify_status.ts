import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const lastOrder = await prisma.order.findFirst({
    orderBy: { createdAt: 'desc' },
    include: { items: true }
  });

  console.log('--- Last Order Summary ---');
  console.log(JSON.stringify(lastOrder, null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
