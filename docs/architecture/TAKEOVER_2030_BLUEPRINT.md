# ResidentCement 2030 Evidence-Backed Takeover Blueprint

## Zero-Guesswork Operating Rule
Every decision in this blueprint is anchored to observed repository evidence as of 2026-03-08.
Inferences are explicitly labeled as Inference.

## Evidence Ledger
- backend/gateway/src/index.ts: Gateway exposes api routes and runs on port 3001. Decision: keep gateway as single northbound entrypoint.
- backend/services/*/src/index.ts: Services run on isolated ports 3002-3007. Decision: lock service autonomy with boundary checks.
- backend/services/events/src/consumer.ts: Kafka topics consumed across order, customer, inventory, payment, product. Decision: treat events service as integration layer, not domain owner.
- frontend/apps/distributor-portal/src/lib/api.ts: Frontend base URL points to gateway localhost:3001. Decision: preserve gateway-first traffic policy.
- frontend/apps/admin-dashboard/src/lib/api.ts: UI uses en-NG locale and NGN currency formatting. Decision: keep Nigeria-first defaults with global expansion paths.
- backend/services/payment-service/src/index.ts: Paystack integration and NGN default are implemented. Decision: use Nigeria-local rail by default with multi-rail abstraction.
- infrastructure/docker/docker-compose.yml: Core infra includes PostgreSQL, MongoDB, Redis, Kafka, Keycloak, MinIO. Decision: keep polyglot data/event model with explicit ownership.

## Modular Product Structure (Implemented Contract)
1. Experience modules: frontend/apps/distributor-portal, frontend/apps/admin-dashboard
2. Platform entry module: backend/gateway
3. Domain service modules: customer, order, product, inventory, pricing, payment
4. Event integration module: backend/services/events
5. Shared platform modules: backend/shared/kernel, backend/shared/kafka-client

## Afrocentric-Global Product Guardrails
1. Nigeria-present defaults remain first-class (NGN, en-NG, Paystack).
2. Global extension is additive, not replacement.
3. Domain semantics stay local-first.

## Verified Risks Requiring Launch Action
1. Distributor portal calls /api/v1/warehouses, but gateway mounts do not include /api/v1/warehouses.
2. Admin dashboard calls /api/v1/dashboard/stats, but gateway has no mounted dashboard route.
3. Playwright execution currently fails because the CLI is missing in tests workspace.

## Inference Layer (Explicit)
- Inference: Modular split is mature for phased launch, but route-contract drift between frontend and gateway is an immediate reliability blocker.
- Inference: CI boundary verification will prevent route drift reintroduction.
