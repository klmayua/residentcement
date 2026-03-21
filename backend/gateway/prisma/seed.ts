/**
 * Database Seed Script for ResidentCement Platform
 * 
 * Populates database with sample data for development and testing
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ===========================================================================
  // 1. Create Admin User
  // ===========================================================================
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD environment variable is required");
  }
  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@residentcement.com' },
    update: {},
    create: {
      id: 'user_admin_001',
      email: 'admin@residentcement.com',
      name: 'System Administrator',
      passwordHash: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  console.log('✅ Created admin user');

  // ===========================================================================
  // 2. Create Sample Customers
  // ===========================================================================
  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { email: 'demo.distributors@residentcement.com' },
      update: {},
      create: {
        id: 'cust_001',
        name: 'Demo Distributors Ltd',
        email: 'demo.distributors@residentcement.com',
        phone: '+234-800-123-4567',
        address: '1 Industrial Avenue, Ikeja',
        city: 'Lagos',
        state: 'Lagos State',
        lga: 'Ikeja',
        tier: 'PLATINUM',
        status: 'ACTIVE',
        creditLimit: 10000000,
        contactPerson: 'Adebayo Johnson',
        contactEmail: 'adebayo@demodist.com',
        contactPhone: '+234-801-234-5678',
      },
    }),
    prisma.customer.upsert({
      where: { email: 'buildmax@example.com' },
      update: {},
      create: {
        id: 'cust_002',
        name: 'BuildMax Nigeria',
        email: 'buildmax@example.com',
        phone: '+234-800-234-5678',
        address: '15 Construction Road',
        city: 'Abuja',
        state: 'FCT',
        lga: 'Municipal',
        tier: 'GOLD',
        status: 'ACTIVE',
        creditLimit: 5000000,
        contactPerson: 'Fatima Ibrahim',
      },
    }),
    prisma.customer.upsert({
      where: { email: 'cement.world@example.com' },
      update: {},
      create: {
        id: 'cust_003',
        name: 'Cement World Enterprises',
        email: 'cement.world@example.com',
        phone: '+234-800-345-6789',
        address: '23 Market Street',
        city: 'Kano',
        state: 'Kano State',
        lga: 'Kano Municipal',
        tier: 'SILVER',
        status: 'ACTIVE',
        creditLimit: 2000000,
        contactPerson: 'Musa Abdullahi',
      },
    }),
    prisma.customer.upsert({
      where: { email: 'stronghold@example.com' },
      update: {},
      create: {
        id: 'cust_004',
        name: 'Stronghold Builders',
        email: 'stronghold@example.com',
        phone: '+234-800-456-7890',
        address: '5 Builder\'s Way',
        city: 'Port Harcourt',
        state: 'Rivers State',
        lga: 'Port Harcourt',
        tier: 'GOLD',
        status: 'ACTIVE',
        creditLimit: 4000000,
        contactPerson: 'Chioma Okonkwo',
      },
    }),
    prisma.customer.upsert({
      where: { email: 'eagle.cement@example.com' },
      update: {},
      create: {
        id: 'cust_005',
        name: 'Eagle Cement Distributors',
        email: 'eagle.cement@example.com',
        phone: '+234-800-567-8901',
        address: '10 Eagle Road',
        city: 'Ibadan',
        state: 'Oyo State',
        lga: 'Ibadan North',
        tier: 'STANDARD',
        status: 'ACTIVE',
        creditLimit: 1000000,
        contactPerson: 'Tunde Bakare',
      },
    }),
  ]);

  console.log('✅ Created 5 sample customers');

  // ===========================================================================
  // 3. Create Products
  // ===========================================================================
  const products = await Promise.all([
    prisma.product.upsert({
      where: { sku: 'RCC-42.5R-50' },
      update: {},
      create: {
        id: 'prod_001',
        name: 'Resident Cement 42.5R',
        sku: 'RCC-42.5R-50',
        description: 'High-quality Portland cement for all construction needs',
        category: 'CEMENT',
        status: 'ACTIVE',
        basePrice: 4500,
        costPrice: 3500,
        unitOfMeasure: 'bag',
        weight: 50,
        brand: 'Resident',
        tags: ['cement', 'construction', 'building'],
        isTaxable: true,
        taxRate: 7.5,
        minOrderQty: 50,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'RCC-32.5R-50' },
      update: {},
      create: {
        id: 'prod_002',
        name: 'Resident Cement 32.5R',
        sku: 'RCC-32.5R-50',
        description: 'Standard grade cement for masonry work',
        category: 'CEMENT',
        status: 'ACTIVE',
        basePrice: 4200,
        costPrice: 3300,
        unitOfMeasure: 'bag',
        weight: 50,
        brand: 'Resident',
        tags: ['cement', 'masonry'],
        isTaxable: true,
        taxRate: 7.5,
        minOrderQty: 50,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'RCC-52.5R-50' },
      update: {},
      create: {
        id: 'prod_003',
        name: 'Resident Cement 52.5R',
        sku: 'RCC-52.5R-50',
        description: 'High strength cement for specialized construction',
        category: 'CEMENT',
        status: 'ACTIVE',
        basePrice: 5200,
        costPrice: 4000,
        unitOfMeasure: 'bag',
        weight: 50,
        brand: 'Resident',
        tags: ['cement', 'high-strength'],
        isTaxable: true,
        taxRate: 7.5,
        minOrderQty: 50,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'RPC-32.5N-50' },
      update: {},
      create: {
        id: 'prod_004',
        name: 'Resident Pozzolana 32.5N',
        sku: 'RPC-32.5N-50',
        description: 'Environmentally friendly cement with fly ash',
        category: 'CEMENT',
        status: 'ACTIVE',
        basePrice: 4100,
        costPrice: 3200,
        unitOfMeasure: 'bag',
        weight: 50,
        brand: 'Resident',
        tags: ['cement', 'eco-friendly'],
        isTaxable: true,
        taxRate: 7.5,
        minOrderQty: 50,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'CONCRETE-READY' },
      update: {},
      create: {
        id: 'prod_005',
        name: 'Ready-Mix Concrete (per cubic meter)',
        sku: 'CONCRETE-READY',
        description: 'High-strength ready-mix concrete',
        category: 'CONCRETE',
        status: 'ACTIVE',
        basePrice: 45000,
        costPrice: 38000,
        unitOfMeasure: 'cubic_meter',
        weight: 2400,
        tags: ['concrete', 'ready-mix'],
        isTaxable: true,
        taxRate: 7.5,
        minOrderQty: 1,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'AGG-GRANITE-20MM' },
      update: {},
      create: {
        id: 'prod_006',
        name: 'Granite Chippings 20mm',
        sku: 'AGG-GRANITE-20MM',
        description: '20mm granite chippings for concrete',
        category: 'AGGREGATE',
        status: 'ACTIVE',
        basePrice: 25000,
        costPrice: 20000,
        unitOfMeasure: 'ton',
        weight: 1000,
        tags: ['aggregate', 'granite'],
        isTaxable: true,
        taxRate: 7.5,
        minOrderQty: 5,
      },
    }),
  ]);

  console.log('✅ Created 6 sample products');

  // ===========================================================================
  // 4. Create Warehouses
  // ===========================================================================
  const warehouses = await Promise.all([
    prisma.warehouse.upsert({
      where: { code: 'WH-LAG-001' },
      update: {},
      create: {
        id: 'wh_001',
        name: 'Lagos Main Warehouse',
        code: 'WH-LAG-001',
        type: 'DISTRIBUTION',
        address: '100 Warehouse Road, Ikeja',
        city: 'Lagos',
        state: 'Lagos State',
        lga: 'Ikeja',
        capacity: 10000,
        currentUtilization: 65,
        isActive: true,
        managerName: 'Emmanuel Okafor',
        managerPhone: '+234-802-345-6789',
      },
    }),
    prisma.warehouse.upsert({
      where: { code: 'WH-ABJ-001' },
      update: {},
      create: {
        id: 'wh_002',
        name: 'Abuja Distribution Center',
        code: 'WH-ABJ-001',
        type: 'DISTRIBUTION',
        address: '50 Industrial Layout',
        city: 'Abuja',
        state: 'FCT',
        lga: 'Municipal',
        capacity: 8000,
        currentUtilization: 45,
        isActive: true,
        managerName: 'Aisha Mohammed',
        managerPhone: '+234-803-456-7890',
      },
    }),
    prisma.warehouse.upsert({
      where: { code: 'WH-PH-001' },
      update: {},
      create: {
        id: 'wh_003',
        name: 'Port Harcourt Warehouse',
        code: 'WH-PH-001',
        type: 'DISTRIBUTION',
        address: '25 Trans-Amadi Road',
        city: 'Port Harcourt',
        state: 'Rivers State',
        lga: 'Port Harcourt',
        capacity: 6000,
        currentUtilization: 55,
        isActive: true,
        managerName: 'Bassey Edet',
        managerPhone: '+234-804-567-8901',
      },
    }),
  ]);

  console.log('✅ Created 3 warehouses');

  // ===========================================================================
  // 5. Create Inventory
  // ===========================================================================
  const inventory = await Promise.all([
    prisma.inventory.upsert({
      where: { productId_warehouseId: { productId: 'prod_001', warehouseId: 'wh_001' } },
      update: {},
      create: {
        id: 'inv_001',
        productId: 'prod_001',
        warehouseId: 'wh_001',
        batchNumber: 'BATCH-2026-001',
        quantity: 5000,
        reservedQuantity: 500,
        availableQuantity: 4500,
        reorderLevel: 1000,
        reorderQuantity: 3000,
        status: 'AVAILABLE',
        unitCost: 2800,
        location: 'A-01-01',
      },
    }),
    prisma.inventory.upsert({
      where: { productId_warehouseId: { productId: 'prod_001', warehouseId: 'wh_002' } },
      update: {},
      create: {
        id: 'inv_002',
        productId: 'prod_001',
        warehouseId: 'wh_002',
        batchNumber: 'BATCH-2026-002',
        quantity: 3000,
        reservedQuantity: 200,
        availableQuantity: 2800,
        reorderLevel: 800,
        reorderQuantity: 2000,
        status: 'AVAILABLE',
        unitCost: 2800,
        location: 'B-02-01',
      },
    }),
    prisma.inventory.upsert({
      where: { productId_warehouseId: { productId: 'prod_002', warehouseId: 'wh_001' } },
      update: {},
      create: {
        id: 'inv_003',
        productId: 'prod_002',
        warehouseId: 'wh_001',
        quantity: 2000,
        reservedQuantity: 100,
        availableQuantity: 1900,
        reorderLevel: 500,
        reorderQuantity: 1500,
        status: 'AVAILABLE',
        unitCost: 1450,
      },
    }),
    prisma.inventory.upsert({
      where: { productId_warehouseId: { productId: 'prod_003', warehouseId: 'wh_001' } },
      update: {},
      create: {
        id: 'inv_004',
        productId: 'prod_003',
        warehouseId: 'wh_001',
        quantity: 80, // Low stock!
        reservedQuantity: 10,
        availableQuantity: 70,
        reorderLevel: 100,
        reorderQuantity: 500,
        status: 'AVAILABLE',
        unitCost: 2750,
      },
    }),
  ]);

  console.log('✅ Created inventory records');

  // ===========================================================================
  // 6. Create Sample Orders
  // ===========================================================================
  const orders = await Promise.all([
    prisma.order.upsert({
      where: { orderNumber: 'ORD-2026-001' },
      update: {},
      create: {
        id: 'ord_001',
        orderNumber: 'ORD-2026-001',
        customerId: 'cust_001',
        status: 'COMPLETED',
        priority: 'NORMAL',
        source: 'WEB',
        subtotal: 350000,
        tax: 26250,
        discount: 0,
        shippingCost: 5000,
        total: 381250,
        currency: 'NGN',
        shippingAddress: '1 Industrial Avenue, Ikeja',
        shippingCity: 'Lagos',
        shippingState: 'Lagos State',
        shippingLga: 'Ikeja',
        items: {
          create: {
            id: 'oi_001',
            productId: 'prod_001',
            productName: 'Resident Cement 42.5R',
            sku: 'RCC-42.5R-50',
            quantity: 100,
            unitPrice: 4500,
            discount: 0,
            tax: 33750,
            total: 483750,
            fulfilledQty: 100,
            status: 'DELIVERED',
          },
        },
      },
    }),
    prisma.order.upsert({
      where: { orderNumber: 'ORD-2026-002' },
      update: {},
      create: {
        id: 'ord_002',
        orderNumber: 'ORD-2026-002',
        customerId: 'cust_002',
        status: 'IN_TRANSIT',
        priority: 'HIGH',
        source: 'PHONE',
        subtotal: 170000,
        tax: 12750,
        discount: 5000,
        shippingCost: 3000,
        total: 180750,
        currency: 'NGN',
        shippingAddress: '15 Construction Road',
        shippingCity: 'Abuja',
        shippingState: 'FCT',
        items: {
          create: {
            id: 'oi_002',
            productId: 'prod_003',
            productName: 'Resident Cement 32.5R',
            sku: 'RCC-32.5R-50',
            quantity: 50,
            unitPrice: 4200,
            discount: 5000,
            tax: 15750,
            total: 220750,
            fulfilledQty: 50,
            status: 'SHIPPED',
          },
        },
      },
    }),
    prisma.order.upsert({
      where: { orderNumber: 'ORD-2026-003' },
      update: {},
      create: {
        id: 'ord_003',
        orderNumber: 'ORD-2026-003',
        customerId: 'cust_003',
        status: 'PENDING',
        priority: 'NORMAL',
        source: 'WEB',
        subtotal: 108000,
        tax: 8100,
        total: 116100,
        currency: 'NGN',
        shippingAddress: '23 Market Street',
        shippingCity: 'Kano',
        shippingState: 'Kano State',
        items: {
          create: {
            id: 'oi_003',
            productId: 'prod_002',
            productName: 'Resident Cement 32.5R',
            sku: 'RCC-32.5R-50',
            quantity: 60,
            unitPrice: 4200,
            total: 264600,
            fulfilledQty: 0,
            status: 'PENDING',
          },
        },
      },
    }),
  ]);

  console.log('✅ Created 3 sample orders');

  // ===========================================================================
  // 7. Create Sample Payments
  // ===========================================================================
  const payments = await Promise.all([
    prisma.payment.upsert({
      where: { paymentReference: 'PAY-2026-001' },
      update: {},
      create: {
        id: 'pay_001',
        paymentReference: 'PAY-2026-001',
        orderId: 'ord_001',
        customerId: 'cust_001',
        amount: 381250,
        currency: 'NGN',
        method: 'BANK_TRANSFER',
        status: 'COMPLETED',
        provider: 'Paystack',
        providerReference: 'T123456789',
        paidAt: new Date('2026-02-15'),
      },
    }),
    prisma.payment.upsert({
      where: { paymentReference: 'PAY-2026-002' },
      update: {},
      create: {
        id: 'pay_002',
        paymentReference: 'PAY-2026-002',
        orderId: 'ord_002',
        customerId: 'cust_002',
        amount: 90000,
        currency: 'NGN',
        method: 'CARD',
        status: 'COMPLETED',
        provider: 'Paystack',
        paidAt: new Date('2026-02-20'),
      },
    }),
  ]);

  console.log('✅ Created 2 sample payments');

  // ===========================================================================
  // 8. Create Pricing Rules
  // ===========================================================================
  const pricingRules = await Promise.all([
    prisma.pricingRule.upsert({
      where: { id: 'rule_001' },
      update: {},
      create: {
        id: 'rule_001',
        name: 'Volume Discount - 10% off 100+ bags',
        description: '10% discount for orders of 100 bags or more',
        ruleType: 'PERCENTAGE',
        scope: 'GLOBAL',
        value: 10,
        valueType: 'PERCENTAGE',
        minQuantity: 100,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        isActive: true,
        priority: 1,
        stackable: false,
      },
    }),
    prisma.pricingRule.upsert({
      where: { id: 'rule_002' },
      update: {},
      create: {
        id: 'rule_002',
        name: 'Platinum Tier - 15% discount',
        description: 'Special pricing for Platinum tier customers',
        ruleType: 'PERCENTAGE',
        scope: 'CUSTOMER_TIER',
        scopeValue: 'PLATINUM',
        customerTier: 'PLATINUM',
        value: 15,
        valueType: 'PERCENTAGE',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        isActive: true,
        priority: 2,
        stackable: true,
      },
    }),
    prisma.pricingRule.upsert({
      where: { id: 'rule_003' },
      update: {},
      create: {
        id: 'rule_003',
        name: 'Gold Tier - 10% discount',
        description: 'Special pricing for Gold tier customers',
        ruleType: 'PERCENTAGE',
        scope: 'CUSTOMER_TIER',
        scopeValue: 'GOLD',
        customerTier: 'GOLD',
        value: 10,
        valueType: 'PERCENTAGE',
        startDate: new Date('2026-01-01'),
        isActive: true,
        priority: 2,
        stackable: true,
      },
    }),
  ]);

  console.log('✅ Created 3 pricing rules');

  // ===========================================================================
  // Summary
  // ===========================================================================
  console.log('\n📊 Seed Summary:');
  console.log('  - Users: 1 (admin)');
  console.log('  - Customers: 5');
  console.log('  - Products: 6');
  console.log('  - Warehouses: 3');
  console.log('  - Inventory Records: 4');
  console.log('  - Orders: 3');
  console.log('  - Payments: 2');
  console.log('  - Pricing Rules: 3');
  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📝 Login Credentials:');
  console.log('  Email: admin@residentcement.com');
  console.log('  Password: <set via ADMIN_PASSWORD environment variable>');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
