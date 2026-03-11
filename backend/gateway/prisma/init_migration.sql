-- ResidentCement Database Initialization Script
-- Creates all schemas and tables for the microservices architecture

-- Create schemas for each microservice
CREATE SCHEMA IF NOT EXISTS customer;
CREATE SCHEMA IF NOT EXISTS inventory;
CREATE SCHEMA IF NOT EXISTS pricing;
CREATE SCHEMA IF NOT EXISTS payment;
CREATE SCHEMA IF NOT EXISTS product;
CREATE SCHEMA IF NOT EXISTS "order";
CREATE SCHEMA IF NOT EXISTS public;

-- Set search path
SET search_path TO public, customer, inventory, pricing, payment, product, "order";

-- ============================================
-- PUBLIC SCHEMA - Core Tables
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS public."user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'DISTRIBUTOR',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE IF NOT EXISTS public.session (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit log
CREATE TABLE IF NOT EXISTS public.audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public."user"(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CUSTOMER SCHEMA
-- ============================================

CREATE TABLE IF NOT EXISTS customer.customer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES public."user"(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50),
    tier VARCHAR(50) NOT NULL DEFAULT 'BRONZE',
    credit_limit DECIMAL(15,2) DEFAULT 0,
    credit_balance DECIMAL(15,2) DEFAULT 0,
    billing_address TEXT,
    shipping_address TEXT,
    contact_person VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_customer_user_id ON customer.customer(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_tier ON customer.customer(tier);
CREATE INDEX IF NOT EXISTS idx_customer_company ON customer.customer(company_name);

-- ============================================
-- PRODUCT SCHEMA
-- ============================================

CREATE TABLE IF NOT EXISTS product.product (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    base_price DECIMAL(15,2) NOT NULL,
    unit VARCHAR(50) NOT NULL DEFAULT 'TON',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product.depot (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    capacity DECIMAL(15,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_sku ON product.product(sku);
CREATE INDEX IF NOT EXISTS idx_product_category ON product.product(category);
CREATE INDEX IF NOT EXISTS idx_depot_code ON product.depot(code);

-- ============================================
-- INVENTORY SCHEMA
-- ============================================

CREATE TABLE IF NOT EXISTS inventory.inventory_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES product.product(id) ON DELETE CASCADE,
    depot_id UUID NOT NULL REFERENCES product.depot(id) ON DELETE CASCADE,
    quantity DECIMAL(15,2) NOT NULL DEFAULT 0,
    reserved_quantity DECIMAL(15,2) DEFAULT 0,
    available_quantity DECIMAL(15,2) DEFAULT 0,
    reorder_level DECIMAL(15,2) DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory.inventory_item(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_depot ON inventory.inventory_item(depot_id);
CREATE INDEX IF NOT EXISTS idx_inventory_available ON inventory.inventory_item(available_quantity);

-- ============================================
-- ORDER SCHEMA
-- ============================================

CREATE TABLE IF NOT EXISTS "order"."order" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customer.customer(id),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    shipping_address TEXT,
    billing_address TEXT,
    notes TEXT,
    created_by UUID REFERENCES public."user"(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS "order".order_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES "order"."order"(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES product.product(id),
    quantity DECIMAL(15,2) NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    total_price DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_order_customer ON "order"."order"(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_status ON "order"."order"(status);
CREATE INDEX IF NOT EXISTS idx_order_number ON "order"."order"(order_number);
CREATE INDEX IF NOT EXISTS idx_order_item_order ON "order".order_item(order_id);
CREATE INDEX IF NOT EXISTS idx_order_item_product ON "order".order_item(product_id);

-- ============================================
-- PRICING SCHEMA
-- ============================================

CREATE TABLE IF NOT EXISTS pricing.quote (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customer.customer(id),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    subtotal DECIMAL(15,2) NOT NULL,
    tier_discount DECIMAL(15,2) DEFAULT 0,
    volume_discount DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID REFERENCES public."user"(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    converted_to_order_id UUID REFERENCES "order"."order"(id),
    converted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS pricing.quote_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID NOT NULL REFERENCES pricing.quote(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES product.product(id),
    quantity DECIMAL(15,2) NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    tier_discount_percent DECIMAL(5,2) DEFAULT 0,
    volume_discount_percent DECIMAL(5,2) DEFAULT 0,
    total_price DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quote_customer ON pricing.quote(customer_id);
CREATE INDEX IF NOT EXISTS idx_quote_status ON pricing.quote(status);
CREATE INDEX IF NOT EXISTS idx_quote_number ON pricing.quote(quote_number);

-- ============================================
-- PAYMENT SCHEMA
-- ============================================

CREATE TABLE IF NOT EXISTS payment.payment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_reference VARCHAR(100) UNIQUE NOT NULL,
    order_id UUID REFERENCES "order"."order"(id),
    quote_id UUID REFERENCES pricing.quote(id),
    customer_id UUID NOT NULL REFERENCES customer.customer(id),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'NGN',
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    method VARCHAR(50) NOT NULL,
    provider VARCHAR(50),
    provider_reference VARCHAR(255),
    metadata JSONB,
    paid_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    refunded_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payment_order ON payment.payment(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_customer ON payment.payment(customer_id);
CREATE INDEX IF NOT EXISTS idx_payment_reference ON payment.payment(payment_reference);
CREATE INDEX IF NOT EXISTS idx_payment_status ON payment.payment(status);

-- ============================================
-- SHIPMENT TABLE (Public Schema)
-- ============================================

CREATE TABLE IF NOT EXISTS public.shipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES "order"."order"(id),
    tracking_number VARCHAR(100) UNIQUE,
    carrier VARCHAR(100),
    vehicle_registration VARCHAR(20),
    driver_name VARCHAR(100),
    driver_phone VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    origin_address TEXT,
    destination_address TEXT,
    scheduled_pickup TIMESTAMP WITH TIME ZONE,
    actual_pickup TIMESTAMP WITH TIME ZONE,
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_shipment_order ON public.shipment(order_id);
CREATE INDEX IF NOT EXISTS idx_shipment_tracking ON public.shipment(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipment_status ON public.shipment(status);

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Insert default admin user (password: admin123)
INSERT INTO public."user" (id, email, password_hash, role, first_name, last_name)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'admin@residentcement.com', '$2a$10$rH0zGvJlz5qF6qQlz5qF6qQlz5qF6qQlz5qF6qQlz5qF6qQlz5qF6', 'ADMIN', 'System', 'Admin')
ON CONFLICT (email) DO NOTHING;

-- Insert default products
INSERT INTO product.product (id, name, sku, description, category, base_price, unit)
VALUES 
    ('10000000-0000-0000-0000-000000000001', 'Portland Cement 42.5N', 'CEM-POR-425', 'High-strength Portland cement for construction', 'CEMENT', 45000.00, 'TON'),
    ('10000000-0000-0000-0000-000000000002', 'Portland Cement 32.5N', 'CEM-POR-325', 'Standard Portland cement for general construction', 'CEMENT', 42000.00, 'TON'),
    ('10000000-0000-0000-0000-000000000003', 'Limestone Aggregates 20mm', 'AGG-LIM-020', 'Crushed limestone aggregates for concrete', 'AGGREGATE', 15000.00, 'TON'),
    ('10000000-0000-0000-0000-000000000004', 'Pozzolana Cement', 'CEM-POZ-001', 'Volcanic ash blended cement', 'POZZOLANA', 40000.00, 'TON')
ON CONFLICT (sku) DO NOTHING;

-- Insert default depot
INSERT INTO product.depot (id, name, code, address, city, state, capacity)
VALUES 
    ('20000000-0000-0000-0000-000000000001', 'Main Distribution Center', 'MDC-001', '1 Industrial Avenue', 'Calabar', 'Cross River', 10000.00)
ON CONFLICT (code) DO NOTHING;

COMMIT;
