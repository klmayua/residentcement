const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo user
  const passwordHash = await bcrypt.hash('password123', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@residentcement.com' },
    update: {},
    create: {
      email: 'demo@residentcement.com',
      passwordHash,
      firstName: 'Demo',
      lastName: 'User',
      phone: '+2348012345678',
      role: 'DISTRIBUTOR',
      isActive: true,
      customer: {
        create: {
          companyName: 'Demo Cement Distributors',
          address: '123 Lagos Road',
          city: 'Lagos',
          state: 'Lagos',
          country: 'Nigeria',
          phone: '+2348012345678',
          tier: 'GOLD',
          creditLimit: 5000000,
          outstandingBalance: 0,
        },
      },
    },
  });

  console.log('Created demo user:', user.email);

  // Create products
  const products = [
    {
      name: 'Resident Cement 42.5R',
      sku: 'RCC-42.5R-50',
      description: 'Premium grade cement for general construction',
      category: 'CEMENT',
      grade: '42.5R',
      unit: 'bag',
      unitSize: 50,
      basePrice: 4500,
      currency: 'NGN',
      status: 'active',
    },
    {
      name: 'Resident Cement 32.5R',
      sku: 'RCC-32.5R-50',
      description: 'Standard grade cement for masonry work',
      category: 'CEMENT',
      grade: '32.5R',
      unit: 'bag',
      unitSize: 50,
      basePrice: 4200,
      currency: 'NGN',
      status: 'active',
    },
    {
      name: 'Resident Cement 52.5R',
      sku: 'RCC-52.5R-50',
      description: 'High strength cement for specialized construction',
      category: 'CEMENT',
      grade: '52.5R',
      unit: 'bag',
      unitSize: 50,
      basePrice: 5200,
      currency: 'NGN',
      status: 'active',
    },
    {
      name: 'Resident Pozzolana 32.5N',
      sku: 'RPC-32.5N-50',
      description: 'Environmentally friendly cement with fly ash',
      category: 'POZZOLANA',
      grade: '32.5N',
      unit: 'bag',
      unitSize: 50,
      basePrice: 4100,
      currency: 'NGN',
      status: 'active',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    });
    console.log('Created product:', product.name);
  }

  // Create depots
  const depots = [
    { name: 'Lagos Depot', code: 'LAG-001', city: 'Lagos', state: 'Lagos' },
    { name: 'Abuja Depot', code: 'ABJ-001', city: 'Abuja', state: 'FCT' },
    { name: 'Port Harcourt Depot', code: 'PH-001', city: 'Port Harcourt', state: 'Rivers' },
    { name: 'Kano Depot', code: 'KAN-001', city: 'Kano', state: 'Kano' },
  ];

  for (const depot of depots) {
    await prisma.depot.upsert({
      where: { code: depot.code },
      update: {},
      create: depot,
    });
    console.log('Created depot:', depot.name);
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
