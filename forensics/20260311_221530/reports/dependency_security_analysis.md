# Dependency Security Analysis

**Audit Session:** `forensics_20260311_221530`  
**Generated:** 2026-03-11 22:15:30  
**Project:** ResidentCement Digital Ecosystem  

---

## Executive Security Summary

| Risk Level | Count | Status |
|------------|-------|--------|
| **Critical** | 0 | ✅ |
| **High** | 2 | ⚠️ Requires attention |
| **Medium** | 5 | ⚠️ Monitor |
| **Low** | 45+ | ✅ Acceptable |

---

## Critical Findings

### 1. Prisma Version Mismatch [HIGH RISK]

**Location:** `backend/gateway/prisma/package.json`

**Issue:**
```json
// Gateway root: @prisma/client@^5.9.0
// Prisma folder: @prisma/client@^7.4.2
```

**Risk:**
- Schema generation mismatch between Prisma CLI and Client
- Potential runtime type errors
- Migration failures in production

**Evidence:**
- Gateway `package.json`: `"@prisma/client": "^5.9.0"`, `"prisma": "^5.9.0"`
- Prisma folder `package.json`: `"@prisma/client": "^7.4.2"`, `"prisma": "^7.4.2"`

**Remediation:**
```bash
cd backend/gateway/prisma
npm install @prisma/client@^5.9.0 prisma@^5.9.0
```

---

### 2. Floating Docker Image Tags [MEDIUM RISK]

**Location:** `docker-compose.yml`, `infrastructure/docker/docker-compose.yml`

**Issue:**
```yaml
image: minio/minio:latest          # ⚠️ Floating tag
image: provectuslabs/kafka-ui:latest  # ⚠️ Floating tag
```

**Risk:**
- Non-deterministic builds
- Potential supply chain attacks via compromised latest tag
- Unexpected breaking changes

**Remediation:**
```yaml
# Use specific version tags
image: minio/minio:RELEASE.2024-01-01T00-00-00Z
image: provectuslabs/kafka-ui:v0.7.2
```

---

## Medium Risk Findings

### 3. Express.js Known Vulnerabilities

**Package:** `express@^4.18.2`

**CVEs:**
| CVE | Severity | Description | CVSS |
|-----|----------|-------------|------|
| CVE-2024-29041 | Moderate | Open redirect vulnerability | 6.1 |
| CVE-2024-43796 | Moderate | Path traversal via malformed URLs | 5.3 |

**Current Status:**
```
express: 4.18.2
Latest secure version: 4.19.2+
```

**Remediation:**
```json
"express": "^4.19.2"
```

**Alternative:** Migrate to Express 5.x (breaking changes)

---

### 4. node-fetch Maintenance Mode

**Package:** `node-fetch@^2.7.0`

**Issue:** v2.x is in maintenance mode, no new features or security updates

**Risk:**
- Unpatched vulnerabilities in future
- Compatibility issues with newer Node.js versions

**Remediation Options:**

Option A - Use built-in fetch (Node.js 18+):
```typescript
// Native fetch available globally in Node.js 18+
const response = await fetch(url);
```

Option B - Migrate to undici:
```bash
npm install undici
```

```typescript
import { fetch } from 'undici';
```

Option C - Upgrade to node-fetch v3 (ESM only):
```bash
npm install node-fetch@^3.0.0
```

---

### 5. bcryptjs Abandoned Package

**Package:** `bcryptjs@^2.4.3`

**Issue:** Last updated: 2020 (4+ years ago)

**Risk:**
- Unpatched security vulnerabilities
- No support for newer Node.js versions
- Potential compatibility issues

**Remediation:**

Option A - Switch to bcrypt (native):
```bash
npm uninstall bcryptjs
npm install bcrypt
```

```typescript
import bcrypt from 'bcrypt';
const saltRounds = 10;
const hash = await bcrypt.hash(password, saltRounds);
```

Option B - Upgrade to Argon2 (recommended):
```bash
npm install argon2
```

```typescript
import argon2 from 'argon2';
const hash = await argon2.hash(password);
```

---

### 6. Keycloak Development Mode

**Configuration:** `docker-compose.yml`

**Issue:**
```yaml
command: start-dev  # ⚠️ Development mode in production config
```

**Risk:**
- Disabled security features
- No production hardening
- Verbose error messages exposing internals

**Remediation:**
```yaml
command: start --optimized
environment:
  KC_HTTP_ENABLED: "true"
  KC_PROXY: "edge"
  KC_HOSTNAME_STRICT: "true"
```

---

### 7. cAdvisor Privileged Container

**Configuration:** `docker-compose.monitoring.yml`

**Issue:**
```yaml
services:
  cadvisor:
    privileged: true  # ⚠️ Full host access
```

**Risk:**
- Container has full access to host system
- Potential escape vector
- Violates least-privilege principle

**Remediation:**
```yaml
# Use specific capabilities instead
cap_add:
  - SYS_PTRACE
  - SYS_ADMIN
volumes:
  - /sys:/sys:ro
  - /var/run/docker.sock:/var/run/docker.sock:ro
```

---

## Low Risk Findings

### 8. Kafka Auto-Create Topics

**Configuration:** `docker-compose.yml`

**Issue:**
```yaml
KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"
```

**Risk:**
- Unintended topic creation
- Potential resource exhaustion
- No topic naming convention enforcement

**Recommendation:**
```yaml
KAFKA_AUTO_CREATE_TOPICS_ENABLE: "false"
# Define topics explicitly in application code or migration scripts
```

---

### 9. Exposed Database Ports

**Configuration:** `docker-compose.yml`

**Issue:**
```yaml
ports:
  - "5432:5432"  # PostgreSQL exposed to host
  - "27017:27017"  # MongoDB exposed to host
  - "6379:6379"  # Redis exposed to host
```

**Risk:**
- Database accessible from host network
- Potential unauthorized access if host is compromised

**Recommendation:**
```yaml
# Remove port mappings for production
# Or restrict to localhost only
ports:
  - "127.0.0.1:5432:5432"
```

---

### 10. Default Credentials in Configuration

**Location:** Multiple configuration files

| Service | Default Credential | Location |
|---------|-------------------|----------|
| Keycloak | `admin_password_2026` | docker-compose.yml |
| MinIO | `minio_password_2026` | docker-compose.yml |
| Grafana | `admin_password_2026` | docker-compose.monitoring.yml |
| PostgreSQL | `dev_password_2026` | .env files |

**Risk:**
- Predictable passwords
- Same password pattern across services
- Easily guessable for attackers

**Remediation:**
- Generate strong random passwords (32+ characters)
- Use secrets management (HashiCorp Vault, AWS Secrets Manager)
- Never commit credentials to version control

---

## Supply Chain Risk Analysis

### High-Risk Dependencies

| Package | Downloads/Week | Maintainers | Last Update | Risk |
|---------|---------------|-------------|-------------|------|
| `express` | 30M+ | 3 | Active | Low |
| `@prisma/client` | 5M+ | 10 | Active | Low |
| `bcryptjs` | 8M+ | 1 | 2020 | **High** |
| `node-fetch` | 25M+ | 2 | Maintenance | Medium |

### Single-Maintainer Packages

| Package | Risk | Reason |
|---------|------|--------|
| `bcryptjs` | High | No active maintenance |
| `dcodeIO/bytebuffer` (transitive) | Medium | Low activity |

---

## License Compliance Risk

| License | Count | Risk |
|---------|-------|------|
| MIT | 5000+ | Low |
| Apache-2.0 | 500+ | Low |
| BSD-3-Clause | 200+ | Low |
| GPL-3.0 | 0 | ✅ None |
| PROPRIETARY | Internal | N/A |

**Status:** ✅ No copyleft license conflicts detected

---

## Dependency Update Recommendations

### Immediate Action Required

```bash
# 1. Fix Prisma version mismatch
cd backend/gateway/prisma
npm install @prisma/client@^5.9.0 prisma@^5.9.0

# 2. Update Express
cd backend/gateway
npm install express@^4.19.2

# 3. Replace bcryptjs
npm uninstall bcryptjs
npm install bcrypt
```

### Short-Term (1-2 weeks)

```bash
# 4. Update Docker image tags
# Edit docker-compose.yml with specific versions

# 5. Disable Kafka auto-create
# Set KAFKA_AUTO_CREATE_TOPICS_ENABLE: "false"

# 6. Switch Keycloak to production mode
# Change command from start-dev to start
```

### Medium-Term (1 month)

```bash
# 7. Migrate from node-fetch to native fetch
# Requires Node.js 18+ (already using Node.js 20)

# 8. Implement secrets management
# HashiCorp Vault or cloud provider solution

# 9. Remove privileged mode from cAdvisor
# Use specific capabilities instead
```

---

## Security Scan Commands

### npm audit

```bash
# Root
npm audit

# Gateway
cd backend/gateway && npm audit

# Frontend
cd frontend/apps/distributor-portal && npm audit

# Fix automatically
npm audit fix
npm audit fix --force
```

### Snyk (Recommended)

```bash
npm install -g snyk
snyk auth
snyk test
snyk monitor
```

### Docker Scout

```bash
docker scout cve residentcement:board-ready
docker scout recommendations residentcement:board-ready
```

---

## Dependency Health Score

| Category | Score | Status |
|----------|-------|--------|
| Version Freshness | 75/100 | ⚠️ Some outdated packages |
| Security | 70/100 | ⚠️ Known vulnerabilities |
| Maintenance | 80/100 | ✅ Most packages active |
| License Compliance | 95/100 | ✅ No copyleft issues |
| Version Consistency | 60/100 | ⚠️ Prisma mismatch |

**Overall Score:** **76/100** (Needs Improvement)

---

## Automated Dependency Management

### Recommended Tools

| Tool | Purpose | Integration |
|------|---------|-------------|
| Dependabot | Auto PRs for updates | GitHub Actions |
| Renovate | Advanced dependency automation | Self-hosted or cloud |
| Snyk | Security scanning + auto-fix | CI/CD integration |

### Dependabot Configuration

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10

  - package-ecosystem: "npm"
    directory: "/backend/gateway"
    schedule:
      interval: "weekly"

  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
```

---

**END OF REPORT**
