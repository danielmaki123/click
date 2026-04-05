import { db, OrderStatus } from '@local/database';
export async function webhookRoutes(fastify) {
    fastify.post('/manychat', async (request, reply) => {
        const { orderId, action, secret } = request.body;
        // 1. Validar Secreto
        const expectedSecret = process.env.MANYCHAT_WEBHOOK_SECRET || 'click_mc_secret_2026';
        if (secret !== expectedSecret) {
            return reply.code(401).send({ error: 'Unauthorized: Invalid secret' });
        }
        // 2. Validar Orden
        if (!orderId) {
            return reply.code(400).send({ error: 'Missing orderId' });
        }
        try {
            const order = await db.order.findUnique({
                where: { id: orderId }
            });
            if (!order) {
                return reply.code(404).send({ error: 'Order not found' });
            }
            // 3. Mapear Acción a Estado
            let newStatus;
            let updateData = {};
            switch (action) {
                case 'ACCEPT':
                    newStatus = OrderStatus.ACCEPTED;
                    updateData.acceptedAt = new Date();
                    break;
                case 'REJECT':
                    newStatus = OrderStatus.REJECTED;
                    break;
                case 'READY':
                    newStatus = OrderStatus.READY;
                    updateData.readyAt = new Date();
                    break;
                case 'COMPLETE':
                    newStatus = OrderStatus.COMPLETED;
                    break;
                default:
                    return reply.code(400).send({ error: 'Invalid action' });
            }
            // 4. Actualizar Orden
            const updatedOrder = await db.order.update({
                where: { id: orderId },
                data: {
                    status: newStatus,
                    ...updateData
                }
            });
            return reply.code(200).send({
                success: true,
                orderId: updatedOrder.id,
                newStatus: updatedOrder.status,
                updatedAt: new Date()
            });
        }
        catch (error) {
            console.error('Webhook error:', error);
            return reply.code(500).send({ error: 'Internal server error' });
        }
    });
}
//# sourceMappingURL=webhooks.js.map