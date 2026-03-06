# ResidentCement Kubernetes Deployment Guide

## Prerequisites

- Kubernetes cluster (v1.25+)
- kubectl configured
- Helm (optional, for Kafka operator)
- cert-manager (for TLS)
- nginx-ingress controller

## Quick Start

### 1. Create Namespace

```bash
kubectl apply -f namespace.yaml
```

### 2. Create Secrets

```bash
kubectl create secret generic resident-cement-secrets \
  --namespace resident-cement \
  --from-literal=database-url='postgresql://user:pass@postgres:5432/resident_cement' \
  --from-literal=jwt-secret='your-super-secret-jwt-key-change-in-production' \
  --from-literal=postgres-user='resident_cement' \
  --from-literal=postgres-password='secure-password-here' \
  --from-literal=mongo-user='resident_cement' \
  --from-literal=mongo-password='secure-password-here' \
  --from-literal=paystack-secret-key='sk_test_xxxxx'
```

### 3. Deploy Infrastructure

```bash
kubectl apply -f infrastructure.yaml
```

Wait for databases to be ready:

```bash
kubectl rollout status statefulset/postgres -n resident-cement
kubectl rollout status statefulset/mongodb -n resident-cement
kubectl rollout status deployment/redis -n resident-cement
```

### 4. Deploy Microservices

```bash
kubectl apply -f microservices.yaml
```

### 5. Deploy API Gateway

```bash
kubectl apply -f api-gateway.yaml
```

### 6. Deploy Ingress

```bash
kubectl apply -f ingress.yaml
```

## Verification

### Check all pods are running

```bash
kubectl get pods -n resident-cement
```

Expected output:
```
NAME                                READY   STATUS    RESTARTS   AGE
api-gateway-xxxxx                   1/1     Running   0          5m
customer-service-xxxxx              1/1     Running   0          5m
inventory-service-xxxxx             1/1     Running   0          5m
order-service-xxxxx                 1/1     Running   0          5m
payment-service-xxxxx               1/1     Running   0          5m
pricing-service-xxxxx               1/1     Running   0          5m
product-service-xxxxx               1/1     Running   0          5m
postgres-0                          1/1     Running   0          10m
mongodb-0                           1/1     Running   0          10m
redis-xxxxx                         1/1     Running   0          10m
kafka-xxxxx                         1/1     Running   0          10m
zookeeper-xxxxx                     1/1     Running   0          10m
```

### Check services

```bash
kubectl get svc -n resident-cement
```

### Test API Gateway

```bash
# Get external IP
export GATEWAY_IP=$(kubectl get svc api-gateway -n resident-cement -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

# Health check
curl http://$GATEWAY_IP/health
```

## Scaling

### Manual Scaling

```bash
kubectl scale deployment api-gateway --replicas=5 -n resident-cement
kubectl scale deployment customer-service --replicas=3 -n resident-cement
```

### Auto-scaling is configured via HPA

```bash
kubectl get hpa -n resident-cement
```

## Monitoring

### View logs

```bash
kubectl logs -f deployment/api-gateway -n resident-cement
kubectl logs -f deployment/customer-service -n resident-cement
```

### Port forwarding for local access

```bash
# API Gateway
kubectl port-forward svc/api-gateway 3001:80 -n resident-cement

# PostgreSQL
kubectl port-forward svc/postgres 5432:5432 -n resident-cement

# MongoDB
kubectl port-forward svc/mongodb 27017:27017 -n resident-cement
```

## Cleanup

```bash
kubectl delete namespace resident-cement
```

## Production Considerations

1. **Use Managed Databases**: Replace StatefulSets with RDS, Atlas, ElastiCache
2. **Kafka Operator**: Use Strimzi or Confluent Operator for Kafka
3. **Secrets Management**: Use HashiCorp Vault or AWS Secrets Manager
4. **Network Policies**: Implement network policies for service isolation
5. **Pod Security Policies**: Enable PSP or OPA Gatekeeper
6. **Resource Quotas**: Set namespace resource quotas
7. **Backup Strategy**: Implement Velero for cluster backups
8. **Monitoring**: Deploy Prometheus, Grafana, Jaeger
9. **TLS**: Use cert-manager with Let's Encrypt
10. **Service Mesh**: Consider Istio or Linkerd for advanced traffic management

## Troubleshooting

### Pod not starting

```bash
kubectl describe pod <pod-name> -n resident-cement
kubectl logs <pod-name> -n resident-cement
```

### Database connection issues

```bash
# Check database is running
kubectl get statefulset postgres -n resident-cement

# Test connection from within cluster
kubectl run -it --rm debug --image=postgres:16-alpine --restart=Never -n resident-cement -- env | grep POSTGRES
```

### Service discovery issues

```bash
# Check DNS resolution
kubectl run -it --rm dnsutils --image=dnsutils --restart=Never -n resident-cement -- nslookup postgres.resident-cement.svc.cluster.local
```
