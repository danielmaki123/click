// packages/database/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. RESTAURANTE
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: 'casa-antigua' },
    update: {},
    create: {
      slug: 'casa-antigua',
      name: 'Casa Antigua',
      whatsapp: '50588888888',
      isOpen: true,
      currency: 'NIO',
    },
  });

  // 2. CATEGORÍAS
  const categories = [
    { name: 'Entradas', sortOrder: 1 },
    { name: 'Maki Party', sortOrder: 2 },
    { name: 'Sushi Clásico', sortOrder: 3 },
    { name: 'Sushi Apanado', sortOrder: 4 },
    { name: 'Especialidades', sortOrder: 5 },
    { name: 'Asados', sortOrder: 6 },
    { name: 'Pizzas', sortOrder: 7 },
    { name: 'Tacos', sortOrder: 8 },
    { name: 'Teppanyaki', sortOrder: 9 },
    { name: 'Burgers', sortOrder: 10 },
    { name: 'Bebidas', sortOrder: 11 },
    { name: 'Cervezas', sortOrder: 12 },
  ];

  const dbCats: { id: string; name: string }[] = [];
  for (const cat of categories) {
    const existing = await prisma.category.findFirst({
      where: {
        restaurantId: restaurant.id,
        name: cat.name,
      },
      select: { id: true },
    });

    const dbCat = existing
      ? await prisma.category.update({
          where: { id: existing.id },
          data: { sortOrder: cat.sortOrder },
        })
      : await prisma.category.create({
          data: {
            restaurantId: restaurant.id,
            name: cat.name,
            sortOrder: cat.sortOrder,
          },
        });
    dbCats.push(dbCat);
  }

  const findCatId = (name: string) => dbCats.find(c => c.name === name)!.id;

  // 3. PRODUCTOS (81 items planos)
  
  const products = [
    // Entradas (6)
    { cat: 'Entradas', sku: 'EN-01', name: 'Camarones Tempura', desc: 'Camarones empanizados en panko', price: 289.95 },
    { cat: 'Entradas', sku: 'EN-02', name: 'Gyozas', desc: '5 dumplings rellenos de cerdo', price: 289.95 },
    { cat: 'Entradas', sku: 'EN-03', name: 'Kushiague', desc: '3 brochetas de queso empanizadas', price: 289.95 },
    { cat: 'Entradas', sku: 'EN-04', name: 'Edamame', desc: 'Vainas de soja al vapor', price: 225.95 },
    { cat: 'Entradas', sku: 'EN-05', name: 'Maki Bomb', desc: 'Croqueta de arroz rellena de tartar', price: 325.95 },
    { cat: 'Entradas', sku: 'EN-06', name: 'Ebi Tempura', desc: 'Langostinos en tempura', price: 325.95 },

    // Maki Party (7)
    { cat: 'Maki Party', sku: 'MP-10', name: 'Maki Party 10 piezas', desc: '5 clásicos y 5 apanados', price: 365.95 },
    { cat: 'Maki Party', sku: 'MP-20', name: 'Maki Party 20 piezas', desc: 'Mix de clásicos, apanados y especialidades', price: 695.95 },
    { cat: 'Maki Party', sku: 'MP-30', name: 'Maki Party 30 piezas', desc: 'Premium + entrada cortesía', price: 1175.95 },
    { cat: 'Maki Party', sku: 'MP-60', name: 'Maki Party 60 piezas', desc: 'Selección completa para compartir', price: 2135.95 },
    { cat: 'Maki Party', sku: 'MP-80', name: 'Maki Party 80 piezas', desc: 'El gran banquete', price: 2885.95 },
    { cat: 'Maki Party', sku: 'DP-10', name: 'Bento Party', desc: '10 piezas + 2 medias entradas', price: 495.95 },
    { cat: 'Maki Party', sku: 'BP-10', name: 'Bento Deluxe', desc: '10 especialidades + 2 medias entradas', price: 645.95 },

    // Sushi Clásico (8)
    { cat: 'Sushi Clásico', sku: 'S-CL-01', name: 'Philadelphia', desc: 'Salmón, queso crema y sésamo', price: 355.95 },
    { cat: 'Sushi Clásico', sku: 'S-CL-02', name: 'Rainbow', desc: 'Variedad de salmón, atún y aguacate', price: 355.95 },
    { cat: 'Sushi Clásico', sku: 'S-CL-03', name: 'Green Dragon', desc: 'Camarón tempura, pepino, aguacate', price: 355.95 },
    { cat: 'Sushi Clásico', sku: 'S-CL-04', name: 'Veggie', desc: 'Pepino, aguacate, zanahoria', price: 355.95 },
    { cat: 'Sushi Clásico', sku: 'S-CL-05', name: 'California', desc: 'Másago, cangrejo, pepino', price: 355.95 },
    { cat: 'Sushi Clásico', sku: 'S-CL-06', name: 'Sushirrito', desc: 'Burrito tamaño grande de sushi', price: 585.95 },
    { cat: 'Sushi Clásico', sku: 'S-CL-07', name: 'HosoMakis 18 pcs', desc: '18 piezas de maki fino tradicional', price: 465.95 },
    { cat: 'Sushi Clásico', sku: 'S-CL-08', name: 'Phila Shrimp', desc: 'Camarón, queso crema, pepino', price: 355.95 },

    // Sushi Apanado (5)
    { cat: 'Sushi Apanado', sku: 'S-AP-01', name: 'Hot California', desc: 'Rollo apanado, queso crema, aguacate', price: 385.95 },
    { cat: 'Sushi Apanado', sku: 'S-AP-02', name: 'Tempura', desc: 'Camarón, queso crema, apanado', price: 385.95 },
    { cat: 'Sushi Apanado', sku: 'S-AP-03', name: 'Hot Tuna', desc: 'Tartar de atún picante, apanado', price: 385.95 },
    { cat: 'Sushi Apanado', sku: 'S-AP-04', name: 'Maki Maki', desc: 'Salmón, queso crema, apanado', price: 385.95 },
    { cat: 'Sushi Apanado', sku: 'S-AP-05', name: 'Sushirrito Tempura', desc: 'Burrito frito en tempura', price: 585.95, avail: false },

    // Especialidades (8)
    { cat: 'Especialidades', sku: 'S-ES-01', name: 'Nakiri', desc: 'Salmón, atún, kanikama, masago', price: 425.95 },
    { cat: 'Especialidades', sku: 'S-ES-02', name: 'Sakura Roll', desc: 'Aguacate, salmón, camarón tempura', price: 425.95 },
    { cat: 'Especialidades', sku: 'S-ES-03', name: 'Rainbow Special', desc: 'Premium: salmón, atún, aguacate, camarón', price: 425.95 },
    { cat: 'Especialidades', sku: 'S-ES-04', name: 'Red Dragon', desc: 'Camarón tempura, kanikama', price: 425.95 },
    { cat: 'Especialidades', sku: 'S-ES-05', name: 'Philadelphia Special', desc: 'Doble salmón (fuera y dentro)', price: 425.95 },
    { cat: 'Especialidades', sku: 'S-ES-06', name: 'Spicy Tuna', desc: 'Atún picante, tempura crujiente', price: 425.95 },
    { cat: 'Especialidades', sku: 'S-ES-07', name: 'Fancy', desc: 'Salmón, atún, aguacate, masago', price: 425.95 },
    { cat: 'Especialidades', sku: 'S-ES-08', name: 'Kumiko', desc: 'Mix: camarón tempura, salmón, atún', price: 425.95 },

    // Asados (4)
    { cat: 'Asados', sku: 'A-CH-10', name: 'Churrasco 10 OZ', desc: 'Lomo fino tierno', price: 520.00 },
    { cat: 'Asados', sku: 'A-NY-16', name: 'New York Steak 16 OZ', desc: 'Corte premium a la parrilla', price: 740.00 },
    { cat: 'Asados', sku: 'A-RB-16', name: 'Prime Ribs Steak 16 OZ', desc: 'Rib Eye jugoso', price: 740.00 },
    { cat: 'Asados', sku: 'A-CE-EMP', name: 'Camarones Empanizados', desc: 'Camarones jumbo con papas', price: 795.00 },

    // Pizzas (12)
    { cat: 'Pizzas', sku: 'P-MAR-01', name: 'Margherita', desc: 'Tomate, mozzarella, albahaca', price: 490.00 },
    { cat: 'Pizzas', sku: 'P-MAR-02', name: 'Marinara', desc: 'Tomate, orégano, ajo', price: 420.00 },
    { cat: 'Pizzas', sku: 'P-PEP-01', name: 'Pepperoni Miele', desc: 'Pepperoni con miel picante', price: 540.00 },
    { cat: 'Pizzas', sku: 'P-SAL-01', name: 'Salame e Cipolla', desc: 'Salame italiano, cebolla morada', price: 580.00 },
    { cat: 'Pizzas', sku: 'P-MAR-G', name: 'Margherita Genovesa', desc: 'Mozzarella, cherry, pesto', price: 640.00 },
    { cat: 'Pizzas', sku: 'P-PRO-01', name: 'Prosciutto Parmeggiano', desc: 'Prosciutto di Parma, parmesano', price: 640.00 },
    { cat: 'Pizzas', sku: 'P-PES-01', name: 'Pesto & Funghi', desc: 'Pesto, hongos frescos', price: 640.00 },
    { cat: 'Pizzas', sku: 'P-ALE-01', name: 'Alessandra', desc: 'Pesto, rúcula, mozzarella', price: 640.00 },
    { cat: 'Pizzas', sku: 'P-SPE-01', name: 'Speziata', desc: 'Salame, jalapeños', price: 640.00 },
    { cat: 'Pizzas', sku: 'P-CON-01', name: 'La Contadina', desc: 'Chorizo italiano, papas', price: 640.00 },
    { cat: 'Pizzas', sku: 'P-FOR-01', name: 'Formaggio', desc: 'Cuatro quesos', price: 680.00 },
    { cat: 'Pizzas', sku: 'P-DIA-01', name: 'Diavola', desc: 'Pepperoni picante, especias', price: 680.00 },

    // Tacos (10)
    { cat: 'Tacos', sku: 'TB01', name: 'Gueros de Birria', desc: 'Res cocida a fuego lento', price: 345.95 },
    { cat: 'Tacos', sku: 'TB02', name: 'Gueros al Pastor (Cerdo)', desc: 'Puerco marinado', price: 325.95, avail: false },
    { cat: 'Tacos', sku: 'TB03', name: 'Gueros al Pastor (Pollo)', desc: 'Pechuga marinada', price: 325.95, avail: false },
    { cat: 'Tacos', sku: 'TB04', name: 'Gueros de Carnita', desc: 'Cerdo confitado', price: 325.95, avail: false },
    { cat: 'Tacos', sku: 'TB05', name: 'Gueros de Suadero', desc: 'Corte de res suave', price: 345.95, avail: false },
    { cat: 'Tacos', sku: 'TB06', name: 'Gueros de Cochinita', desc: 'Cerdo en achiote', price: 325.95, avail: false },
    { cat: 'Tacos', sku: 'TB09', name: 'Gueros de Asada', desc: 'Res a la plancha', price: 325.95, avail: false },
    { cat: 'Tacos', sku: 'TB07', name: 'Quesabirria', desc: 'Tortilla con queso y birria', price: 425.95, avail: false },
    { cat: 'Tacos', sku: 'TB08', name: 'Quesadilla', desc: 'Tortilla con queso y carne', price: 385.00 },
    { cat: 'Tacos', sku: 'TM01', name: 'Gueros Mixtos (12 Tacos)', desc: '12 tacos, 3 carnes a elegir', price: 985.95 },

    // Teppanyaki (6)
    { cat: 'Teppanyaki', sku: 'T-YA-01', name: 'Yakimeshi', desc: 'Arroz frito con vegetales y proteína', price: 385.95 },
    { cat: 'Teppanyaki', sku: 'T-YA-02', name: 'Yakimeshi Mixto', desc: 'Arroz frito con dos proteínas', price: 485.95 },
    { cat: 'Teppanyaki', sku: 'T-LO-01', name: 'Lomito Saltado', desc: 'Res salteada al wok', price: 425.95 },
    { cat: 'Teppanyaki', sku: 'T-PA-01', name: 'Pollo Agridulce Individual', desc: 'Pechuga empanizada, salsa agridulce', price: 395.95 },
    { cat: 'Teppanyaki', sku: 'T-PA-02', name: 'Pollo Agridulce Compartir', desc: 'Bandeja grande para grupos', price: 525.25 },
    { cat: 'Teppanyaki', sku: 'T-CA-01', name: 'Camarones Agridulce', desc: 'Camarones con vegetales', price: 525.95 },

    // Burgers (2)
    { cat: 'Burgers', sku: 'B-DS-01', name: 'One Burger Double', desc: '2 carnes smash, mozzarella', price: 305.00 },
    { cat: 'Burgers', sku: 'B-TS-01', name: 'One Burger Triple', desc: '3 carnes smash, triple queso', price: 365.00 },

    // Bebidas (5)
    { cat: 'Bebidas', sku: 'BEB-01', name: 'Té de Limón', desc: 'Té frío natural', price: 89.95 },
    { cat: 'Bebidas', sku: 'BEB-02', name: 'Jamaica', desc: 'Agua fresca natural', price: 89.95 },
    { cat: 'Bebidas', sku: 'BEB-03', name: 'Calala', desc: 'Agua de maracuyá', price: 89.95 },
    { cat: 'Bebidas', sku: 'BEB-04', name: 'Tamarindo', desc: 'Pulpa de tamarindo', price: 89.95 },
    { cat: 'Bebidas', sku: 'BEB-05', name: 'Limonada', desc: 'Limonada clásica', price: 89.95 },

    // Bebidas (11)
    { cat: 'Bebidas', sku: 'BEB-06', name: 'Coca Cola', desc: 'Lata 355ml', price: 95.00 },
    { cat: 'Bebidas', sku: 'BEB-07', name: 'Coca Cola Zero', desc: 'Lata 355ml', price: 95.00 },
    { cat: 'Bebidas', sku: 'BEB-08', name: 'Agua Mineral', desc: 'Botella 600ml', price: 75.00 },
    { cat: 'Bebidas', sku: 'BEB-09', name: 'Agua Natural', desc: 'Botella 600ml', price: 65.00 },
    { cat: 'Bebidas', sku: 'BEB-10', name: 'Fresca', desc: 'Lata 355ml', price: 95.00 },
    { cat: 'Bebidas', sku: 'BEB-11', name: 'Sprite', desc: 'Lata 355ml', price: 95.00 },

    // Cervezas (2)
    { cat: 'Cervezas', sku: 'CER-01', name: 'Santiago Apostol', desc: 'Artesanal rubia', price: 165.00 },
    { cat: 'Cervezas', sku: 'CER-02', name: 'Guardabarranco', desc: 'Artesanal ámbar', price: 165.00 },
  ];

  // Keep seed deterministic on repeated runs.
  await prisma.menuItem.deleteMany({ where: { restaurantId: restaurant.id } });

  for (const p of products) {
    await prisma.menuItem.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: findCatId(p.cat),
        sku: p.sku,
        name: p.name,
        description: p.desc,
        price: p.price,
        isAvailable: p.avail !== undefined ? p.avail : true,
      }
    });
  }

  console.log(`✅ Seed completado: ${products.length} productos en Casa Antigua`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
