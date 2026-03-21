# ResidentCement Demo Environment Setup Guide

Quick setup guide for demonstrating the ResidentCement platform to stakeholders.

## Quick Start (5 minutes)

```bash
# 1. Clone and setup
git clone https://github.com/klmayua/residentcement.git
cd residentcement

# 2. Install dependencies
npm run install:all

# 3. Start all services
npm run dev

# 4. Open browser
echo "Corporate Website: http://localhost:3001"
echo "Distributor Portal: http://localhost:3000"
echo "API Gateway: http://localhost:4000"
```

## Demo Credentials

| Service | URL | Username | Password |
|---------|-----|----------|----------|
| Distributor Portal | http://localhost:3000 | `demo@residentcement.com` | `password` |
| Admin Dashboard | http://localhost:3002 | `admin@residentcement.com` | `admin123` |
| Grafana | http://localhost:3003 | `admin` | `admin` |

## Demo Scenarios

### 1. Corporate Website (Public-facing)

**URL:** http://localhost:3001

**Features to showcase:**
- Hero section with value proposition
- Product catalog with pricing
- About company and sustainability
- Contact form
- Career listings

**Talking points:**
- "Professional online presence for brand credibility"
- "SEO-optimized for cement-related searches"
- "Integrated with product database for real-time pricing"

### 2. Distributor Portal (B2B Platform)

**URL:** http://localhost:3000

**Demo Flow:**

#### Step 1: Login
- Use demo credentials
- Show dashboard with metrics
- Point out real-time sync indicator

#### Step 2: Browse Products
- Navigate to Products page
- Show retail vs distributor pricing
- Demonstrate category filtering
- Show product details with specs

#### Step 3: Add to Cart
- Add cement bags to cart
- Show quantity selector
- Demonstrate bulk pricing

#### Step 4: Checkout Process
- Go to cart
- Show order summary
- Proceed to checkout
- **Important:** Use Paystack test mode
  - Use test card: `4084 0840 8408 4081`
  - Expiry: Any future date
  - CVV: `000`
- Complete payment
- Show order confirmation

#### Step 5: Order Management
- Go to Orders page
- Show order status
- Demonstrate order tracking

**Talking points:**
- "Complete B2B ordering without calling sales team"
- "Real-time inventory visibility"
- "Credit limit management"
- "Order history and reordering"

### 3. Sales Rep Mobile App (PWA)

**URL:** http://localhost:3004

**Demo Flow:**

#### Step 1: Login
- Show mobile-optimized interface
- Demo offline capability

#### Step 2: Dashboard
- Show today's targets
- Recent activity feed
- Quick actions

#### Step 3: Customer Registration
- Add new customer
- Show GPS check-in
- Demonstrate offline form submission

#### Step 4: Check-in Feature
- Simulate GPS check-in
- Show location tracking
- Demonstrate customer visit logging

**Talking points:**
- "Works offline in areas with poor connectivity"
- "GPS tracking for sales team management"
- "Syncs when connection restored"
- "Reduces paperwork and data entry"

### 4. API Gateway (Backend)

**URL:** http://localhost:4000/api-docs

**Demo:**
- Show Swagger documentation
- Test product API endpoint
- Demonstrate authentication
- Show rate limiting

**Talking points:**
- "RESTful API for third-party integrations"
- "Rate limited and secured"
- "Comprehensive documentation"
- "Can integrate with ERP systems"

### 5. USSD Service (Mobile Feature)

**Demo via curl:**
```bash
# Simulate USSD session
curl -X POST http://localhost:4008/ussd/test \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+2348012345678",
    "text": ""
  }'

# Navigate menu
curl -X POST http://localhost:4008/ussd/test \
  -d '{
    "phoneNumber": "+2348012345678",
    "text": "2"
  }'
```

**Talking points:**
- "Order cement without internet connection"
- "Works on any mobile phone"
- "Reaches customers in remote areas"
- "Integrates with Africa's Talking"

## Demo Checklist

Before the presentation:

- [ ] All services started (`npm run dev`)
- [ ] Test login credentials work
- [ ] Paystack test keys configured
- [ ] Sample data visible (products, orders)
- [ ] Browser tabs prepared:
  - [ ] Corporate Website
  - [ ] Distributor Portal
  - [ ] Mobile App (in mobile view)
  - [ ] API Documentation

## Environment Variables for Demo

Create `.env` file:

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/residentcement"

# Paystack (TEST KEYS ONLY)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_42ee2bc9ec7c0f63cee01d64402a3ff3367a5b2d
PAYSTACK_SECRET_KEY=sk_test_de7b99727c07d3a54c1bf4981f5e624ef3cdcebb

# JWT
JWT_SECRET=demo-secret-key

# Redis (optional for demo)
REDIS_URL=redis://localhost:6379
```

## Troubleshooting

### Services won't start
```bash
# Check if ports are in use
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill existing processes
npx kill-port 3000 3001 4000
```

### Database connection error
```bash
# Start PostgreSQL locally
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16

# Or use SQLite for quick demo
# (modify DATABASE_URL to use SQLite)
```

### Frontend build errors
```bash
# Clear caches
rm -rf node_modules **/node_modules
npm run install:all
npm run build
```

## Presentation Tips

### Opening (2 minutes)
1. Start with Corporate Website - establishes credibility
2. Mention problem: "Nigeria's cement industry lacks digital infrastructure"
3. Solution: "Complete digital transformation platform"

### Core Demo (10 minutes)
1. **Distributor Portal** - Main focus (5 min)
   - Login → Browse → Order → Pay
   - Emphasize ease of use

2. **Mobile Sales App** - Innovation highlight (3 min)
   - Show offline capability
   - GPS check-in feature
   - Emphasize field team empowerment

3. **USSD Service** - Market reach (2 min)
   - Explain no-internet ordering
   - Emphasize rural market penetration

### Closing (2 minutes)
1. Show monitoring dashboard (Grafana)
2. Mention security features
3. Discuss scalability with microservices
4. Open for questions

## Technical Talking Points

### Architecture
- "Microservices architecture for scalability"
- "Each service can be scaled independently"
- "Event-driven with Kafka for real-time updates"

### Security
- "JWT-based authentication"
- "Rate limiting on all endpoints"
- "Input validation with Zod schemas"
- "Security scanning in CI/CD"

### Scalability
- "Docker containers ready for Kubernetes"
- "PostgreSQL for ACID compliance"
- "Redis caching for performance"
- "CDN-ready static assets"

## FAQ Preparation

**Q: How is payment handled?**
A: Integrated with Paystack for secure online payments. Supports cards, bank transfers, and mobile money.

**Q: Can it work offline?**
A: Yes, the Sales Rep App uses PWA technology with IndexedDB. Forms sync when connection is restored.

**Q: What about USSD costs?**
A: Standard USSD rates apply per session. Typically N5-10 per session depending on network.

**Q: Is data secure?**
A: All data encrypted in transit (HTTPS/TLS) and at rest. Compliant with NDPR data protection regulations.

**Q: Can it integrate with our ERP?**
A: Yes, comprehensive REST API with OpenAPI documentation. Webhooks available for real-time updates.

## Post-Demo Actions

1. **Collect feedback** - Note questions and concerns
2. **Schedule follow-up** - Technical deep-dive if needed
3. **Provide access** - Demo credentials for stakeholders to explore
4. **Share documentation** - Links to README, API docs, deployment guide

## Emergency Contacts

- Technical Issues: dev@residentcement.com
- Demo Support: Call/WhatsApp [Support Number]

---

**Last Updated:** March 2024
**Version:** 1.0
