import { db } from '@local/database';
async function main() {
    const lastOrder = await db.order.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { items: true }
    });
    console.log('--- Last Order Summary ---');
    console.log(JSON.stringify(lastOrder, null, 2));
}
main()
    .catch((e) => console.error(e))
    .finally(async () => await db.$disconnect());
//# sourceMappingURL=verify_status.js.map