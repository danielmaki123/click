import { db } from '@local/database';
import { z } from 'zod';
export async function menuRoutes(server) {
    server.get('/r/:slug/menu', async (request, reply) => {
        const { slug } = request.params;
        const restaurant = await db.restaurant.findFirst({
            where: {
                slug: {
                    equals: slug,
                    mode: 'insensitive',
                },
            },
            include: {
                categories: {
                    orderBy: {
                        sortOrder: 'asc',
                    },
                    include: {
                        items: {
                            where: {
                                isAvailable: true,
                            },
                        },
                    },
                },
            },
        });
        if (!restaurant) {
            return reply.status(404).send({ error: 'Restaurant not found' });
        }
        if (!restaurant.isOpen) {
            return reply.status(200).send({
                restaurant: {
                    name: restaurant.name,
                    whatsapp: restaurant.whatsapp,
                    currency: restaurant.currency,
                    isOpen: false,
                },
                categories: [],
                message: 'Restaurante cerrado actualmente',
            });
        }
        // Format response exactly as requested
        const response = {
            restaurant: {
                name: restaurant.name,
                whatsapp: restaurant.whatsapp,
                currency: restaurant.currency,
            },
            categories: (restaurant.categories || []).map((cat) => ({
                name: cat.name,
                items: (cat.items || [])
                    .map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price ? Number(item.price) : 0,
                    description: item.description,
                })),
            })),
        };
        return response;
    });
}
//# sourceMappingURL=menu.js.map