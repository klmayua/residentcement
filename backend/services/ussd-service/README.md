# ResidentCement USSD Service

Africa's Talking USSD integration for ResidentCement platform.

## Features

- Complete USSD menu system for cement ordering
- Account balance checking
- Order status tracking
- Distributor locator
- Price checking
- Customer registration
- Support ticket creation

## USSD Menu Structure

```
*384# (or configured shortcode)
├── 1. Check Balance
│   ├── 1. Credit Limit
│   └── 2. Payment History
├── 2. Place Order
│   ├── Select Product
│   ├── Enter Quantity
│   ├── Delivery Address
│   └── Confirm Order
├── 3. Order Status
├── 4. Find Distributor
├── 5. Price Check
├── 6. Register Account
└── 7. Customer Support
```

## Setup

### 1. Africa's Talking Account

1. Register at [africastalking.com](https://account.africastalking.com/)
2. Get API credentials (Username and API Key)
3. Request USSD code allocation
4. Configure webhook URL

### 2. Environment Configuration

```bash
cp .env.example .env
# Edit .env with your AT credentials
```

### 3. Run Locally

```bash
npm install
npm run dev
```

### 4. Test USSD Flow

```bash
# Using curl
curl -X POST http://localhost:4008/ussd \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sessionId=test123" \
  -d "phoneNumber=+2348012345678" \
  -d "networkCode=MTN" \
  -d "serviceCode=*384#" \
  -d "text="

# Continue session
curl -X POST http://localhost:4008/ussd \
  -d "sessionId=test123" \
  -d "phoneNumber=+2348012345678" \
  -d "text=1"
```

## Africa's Talking Webhook Configuration

In your Africa's Talking dashboard:

1. Go to **SMS & USSD** → **USSD**
2. Set **Callback URL**: `https://api.residentcement.com/ussd`
3. Set **Delivery Reports URL**: `https://api.residentcement.com/ussd/delivery`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/ussd` | POST | Africa's Talking webhook |
| `/ussd/test` | POST | Test endpoint |
| `/menus` | GET | Get menu structure |
| `/stats` | GET | Session statistics |

## Response Format

Africa's Talking expects plain text responses:

```
CON Welcome to ResidentCement
1. Check Balance
2. Place Order
3. Order Status
0. Exit

END Thank you for using ResidentCement!
```

- `CON` - Continue session
- `END` - End session

## Production Deployment

The USSD service is included in the production Docker Compose:

```yaml
ussd-service:
  build:
    context: backend/services/ussd-service
  environment:
    - AT_USERNAME=${AT_USERNAME}
    - AT_API_KEY=${AT_API_KEY}
    - AT_SHORTCODE=${AT_SHORTCODE}
```

## Testing Without Africa's Talking

Use the test endpoint to simulate USSD interactions:

```bash
curl -X POST http://localhost:4008/ussd/test \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+2348012345678",
    "text": "2*1*100"
  }'
```

## Troubleshooting

### Session Not Persisting
- Check Redis connection if using Redis for sessions
- Sessions are stored in memory by default (lost on restart)

### Africa's Talking Not Receiving Callbacks
- Verify webhook URL is publicly accessible
- Check firewall rules
- Ensure HTTPS is configured

### Menu Not Displaying Correctly
- Check response format (must start with CON or END)
- Verify Content-Type header is text/plain

## Support

For USSD integration issues:
- Africa's Talking Docs: https://developers.africastalking.com/
- ResidentCement Dev Team: dev@residentcement.com
