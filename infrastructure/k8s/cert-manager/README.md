# ResidentCement cert-manager Configuration
# This directory contains cert-manager resources for automatic TLS certificate management

## Installation

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Wait for cert-manager to be ready
kubectl wait --for=condition=available --timeout=120s deployment/cert-manager -n cert-manager
kubectl wait --for=condition=available --timeout=120s deployment/cert-manager-webhook -n cert-manager
kubectl wait --for=condition=available --timeout=120s deployment/cert-manager-cainjector -n cert-manager
```

## Configuration

### Option 1: Let's Encrypt (Production)

```bash
# Create the production issuer
kubectl apply -f clusterissuer-letsencrypt.yaml

# Update Helm values to use cert-manager
# In values.yaml, set:
# gateway.ingress.annotations:
#   cert-manager.io/cluster-issuer: "letsencrypt-prod"
```

### Option 2: Self-Signed (Development)

```bash
kubectl apply -f clusterissuer-selfsigned.yaml
```

### Option 3: CA Issuer (Internal PKI)

```bash
# Create CA secret first
kubectl create secret tls ca-key-pair \
  --cert=ca.crt \
  --key=ca.key \
  -n cert-manager

kubectl apply -f clusterissuer-ca.yaml
```

## Usage with Helm

```bash
# Deploy with TLS enabled
helm install resident-cement ./infrastructure/k8s/helm \
  --namespace resident-cement \
  --create-namespace \
  --set gateway.ingress.annotations.\"cert-manager\.io/cluster-issuer\"=letsencrypt-prod
```

## Verification

```bash
# Check certificate status
kubectl get certificates -n resident-cement
kubectl describe certificate resident-cement-tls -n resident-cement

# Check certificate request
kubectl get certificaterequests -n resident-cement

# Check challenges (for ACME)
kubectl get challenges -n resident-cement
```

## Troubleshooting

1. **Certificate not issuing**: Check cert-manager logs
   ```bash
   kubectl logs -n cert-manager deployment/cert-manager
   ```

2. **Challenge failing**: Verify DNS records point to ingress
   ```bash
   kubectl describe challenge <challenge-name> -n resident-cement
   ```

3. **Secret not created**: Check Certificate resource events
   ```bash
   kubectl describe certificate <cert-name> -n resident-cement
   ```
