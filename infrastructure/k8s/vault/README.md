# ResidentCement Vault Integration

HashiCorp Vault integration for external secret management in Kubernetes.

## Overview

This configuration provides:
- Vault deployment via Helm
- Kubernetes authentication
- External Secrets Operator integration
- Automatic secret synchronization

## Installation

### 1. Install Vault

```bash
# Add HashiCorp Helm repository
helm repo add hashicorp https://helm.releases.hashicorp.com
helm repo update

# Install Vault in development mode (single instance, insecure)
helm install vault hashicorp/vault \
  --namespace vault \
  --create-namespace \
  --set "server.dev.enabled=true"

# For production, use HA mode with Raft storage
helm install vault hashicorp/vault \
  --namespace vault \
  --create-namespace \
  -f vault-ha-values.yaml
```

### 2. Initialize Vault (Production)

```bash
# Exec into Vault pod
kubectl exec -it vault-0 -n vault -- /bin/sh

# Initialize Vault (save the output!)
vault operator init

# Unseal Vault (run 3 times with different keys)
vault operator unseal <unseal-key-1>
vault operator unseal <unseal-key-2>
vault operator unseal <unseal-key-3>

# Login with root token
vault login <root-token>
```

### 3. Enable Kubernetes Authentication

```bash
# Enable Kubernetes auth method
vault auth enable kubernetes

# Configure Kubernetes auth
vault write auth/kubernetes/config \
  token_reviewer_jwt="$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)" \
  kubernetes_host="https://$KUBERNETES_PORT_443_TCP_ADDR:443" \
  kubernetes_ca_cert=@/var/run/secrets/kubernetes.io/serviceaccount/ca.crt

# Create a policy for ResidentCement
vault policy write resident-cement - <<EOF
path "secret/data/resident-cement/*" {
  capabilities = ["read"]
}
path "secret/data/resident-cement/database/*" {
  capabilities = ["read"]
}
EOF

# Create Kubernetes auth role
vault write auth/kubernetes/role/resident-cement \
  bound_service_account_names=resident-cement \
  bound_service_account_namespaces=resident-cement \
  policies=resident-cement \
  ttl=1h
```

### 4. Store Secrets in Vault

```bash
# Database credentials
vault kv put secret/resident-cement/database/postgres \
  password="$(openssl rand -base64 32)"

vault kv put secret/resident-cement/database/mongodb \
  password="$(openssl rand -base64 32)"

vault kv put secret/resident-cement/database/redis \
  password="$(openssl rand -base64 32)"

# Application secrets
vault kv put secret/resident-cement/application \
  jwt-secret="$(openssl rand -base64 64)" \
  api-key="$(openssl rand -hex 32)"

# Payment secrets
vault kv put secret/resident-cement/payment \
  paystack-secret-key="your-paystack-secret-key"
```

### 5. Install External Secrets Operator

```bash
# Add ESO Helm repository
helm repo add external-secrets https://charts.external-secrets.io
helm repo update

# Install ESO
helm install external-secrets external-secrets/external-secrets \
  --namespace external-secrets \
  --create-namespace
```

### 6. Configure Secret Store

```bash
# Apply the ClusterSecretStore
kubectl apply -f vault-secretstore.yaml
```

### 7. Deploy ResidentCement with Vault

```bash
# Install with Vault integration
helm install resident-cement ./infrastructure/k8s/helm \
  --namespace resident-cement \
  --create-namespace \
  --set vault.enabled=true \
  --set vault.address=http://vault.vault.svc.cluster.local:8200
```

## Verification

```bash
# Check Vault status
kubectl exec -it vault-0 -n vault -- vault status

# Check External Secrets
kubectl get externalsecrets -n resident-cement
kubectl get secretstores -n resident-cement

# Verify secrets are synced
kubectl get secrets -n resident-cement
kubectl describe externalsecret resident-cement-secrets -n resident-cement
```

## Secret Rotation

```bash
# Rotate a secret in Vault
vault kv put secret/resident-cement/database/postgres \
  password="$(openssl rand -base64 32)"

# External Secrets will automatically sync the new value
# Pods will need to be restarted to pick up the new secret
kubectl rollout restart deployment/resident-cement-gateway -n resident-cement
```

## Troubleshooting

### Vault is sealed
```bash
kubectl exec -it vault-0 -n vault -- vault operator unseal <unseal-key>
```

### External Secrets not syncing
```bash
# Check ESO logs
kubectl logs -n external-secrets deployment/external-secrets

# Check SecretStore connection
kubectl describe clustersecretstore vault-backend
```

### Permission denied
```bash
# Verify Kubernetes auth
vault read auth/kubernetes/config

# Check role configuration
vault read auth/kubernetes/role/resident-cement
```

## Production Considerations

1. **High Availability**: Use Raft storage with 3+ nodes
2. **Auto-unseal**: Configure auto-unseal with cloud KMS (AWS KMS, Azure Key Vault, GCP KMS)
3. **TLS**: Enable TLS for Vault API
4. **Backup**: Regular snapshots of Raft storage
5. **Monitoring**: Vault metrics to Prometheus/Grafana
6. **Audit Logging**: Enable audit devices

## References

- [Vault on Kubernetes](https://developer.hashicorp.com/vault/docs/platform/k8s)
- [External Secrets Operator](https://external-secrets.io/)
- [Vault Kubernetes Auth](https://developer.hashicorp.com/vault/docs/auth/kubernetes)
