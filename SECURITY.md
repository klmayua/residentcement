# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability within ResidentCement, please send an email to security@residentcement.com. All security vulnerabilities will be promptly addressed.

## Security Scanning

This project includes automated security scanning:

### Dependency Scanning
Run locally:
```bash
# Unix/Linux/macOS
./scripts/security-scan.sh

# Windows
.\scripts\security-scan.ps1
```

### Container Scanning
Docker images are scanned using Trivy in CI/CD:
```bash
# Install Trivy first
# Scan a specific image
trivy image resident-cement/gateway:latest
```

### CI/CD Security
Security scans run automatically on:
- Every pull request to main
- Every push to main or develop
- Weekly scheduled scans

## Security Measures

### Authentication
- JWT-based authentication with refresh tokens
- Password hashing using bcrypt
- Rate limiting on auth endpoints

### Data Protection
- All data encrypted in transit (HTTPS/TLS)
- Database connections use SSL
- PII data handling compliant with NDPR

### API Security
- Input validation using Zod schemas
- Rate limiting on all endpoints
- CORS configured appropriately
- Helmet.js for security headers

### Infrastructure
- Non-root user in Docker containers
- Security scanning in CI/CD
- Dependency updates automated via Dependabot

## Current Security Status

Last security scan: (run `npm audit` to update)

| Service | Status |
|---------|--------|
| Gateway | ⏳ Pending |
| Distributor Portal | ⏳ Pending |
| Corporate Website | ⏳ Pending |
| Sales Rep App | ⏳ Pending |

## Vulnerability Severity

- **CRITICAL**: Fix immediately
- **HIGH**: Fix within 24 hours
- **MEDIUM**: Fix within 1 week
- **LOW**: Fix in next release cycle
