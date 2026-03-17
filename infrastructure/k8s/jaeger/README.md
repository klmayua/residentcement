# ResidentCement Distributed Tracing Setup

## Overview

Distributed tracing provides end-to-end visibility into requests as they flow through the microservices architecture.

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Service   │────▶│  OpenTelemetry   │────▶│   Jaeger    │
│  (Auto-inst)│     │    Collector     │     │    UI       │
└─────────────┘     └──────────────────┘     └─────────────┘
```

## Installation

### 1. Install Jaeger Operator

```bash
# Create observability namespace
kubectl create namespace observability

# Install Jaeger Operator
kubectl create -f https://github.com/jaegertracing/jaeger-operator/releases/download/v1.49.0/jaeger-operator.yaml -n observability

# Wait for operator
kubectl wait --for=condition=available deployment/jaeger-operator -n observability --timeout=120s
```

### 2. Deploy Jaeger

```bash
# Apply Jaeger configuration
kubectl apply -f jaeger.yaml

# Verify deployment
kubectl get jaegers -n observability
kubectl get pods -n observability
```

### 3. Install OpenTelemetry Collector

```bash
# Install OpenTelemetry Operator
kubectl apply -f https://github.com/open-telemetry/opentelemetry-operator/releases/latest/download/opentelemetry-operator.yaml

# Apply collector configuration
kubectl apply -f otel-collector.yaml
```

### 4. Enable Auto-instrumentation

```bash
# Apply auto-instrumentation
kubectl apply -f instrumentation.yaml

# Verify
kubectl get instrumentation -n observability
```

## Service Instrumentation

### Node.js Services

Add to each service's `package.json`:

```json
{
  "dependencies": {
    "@opentelemetry/api": "^1.7.0",
    "@opentelemetry/auto-instrumentations-node": "^0.40.0",
    "@opentelemetry/exporter-trace-otlp-grpc": "^0.45.0",
    "@opentelemetry/sdk-node": "^0.45.0"
  }
}
```

Create `tracing.ts` in each service:

```typescript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: 'http://otel-collector.observability.svc.cluster.local:4317',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME || 'unknown-service',
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.SERVICE_VERSION || '1.0.0',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
  }),
});

sdk.start();

process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
```

Update service entry point:

```typescript
// At the very top of index.ts
import './tracing';

// ... rest of the application
```

## Accessing Jaeger UI

```bash
# Port-forward
kubectl port-forward svc/resident-cement-query 16686:16686 -n observability

# Open browser
open http://localhost:16686
```

Or via Ingress:
- https://jaeger.residentcement.com

## Using Jaeger

### Finding Traces

1. **By Service**: Select a service from the dropdown
2. **By Operation**: Filter by specific operations
3. **By Tags**: Use tags like `http.method=GET` or `error=true`
4. **Time Range**: Select appropriate time window

### Analyzing Traces

- **Trace Timeline**: Visual representation of span durations
- **Span Details**: Click any span to see tags, logs, and process info
- **Dependencies**: View service dependency graph
- **Compare**: Compare traces to identify performance regressions

## Custom Spans

```typescript
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('resident-cement-service');

async function processOrder(orderId: string) {
  const span = tracer.startSpan('processOrder');
  span.setAttribute('order.id', orderId);

  try {
    // ... processing logic
    span.setStatus({ code: SpanStatusCode.OK });
  } catch (error) {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR });
    throw error;
  } finally {
    span.end();
  }
}
```

## Sampling Configuration

### Head-Based Sampling (Default)

Decision made at the start of the trace:

```yaml
# jaeger.yaml
spec:
  sampling:
    options:
      default_strategy:
        type: probabilistic
        param: 0.1  # 10% sampling
```

### Tail-Based Sampling

Decision made after trace completion (requires collector config):

```yaml
# otel-collector.yaml
processors:
  tail_sampling:
    decision_wait: 10s
    num_traces: 100
    expected_new_traces_per_sec: 10
    policies:
      - name: errors
        type: status_code
        status_code: {status_codes: [ERROR]}
      - name: latency
        type: latency
        latency: {threshold_ms: 1000}
```

## Troubleshooting

### No traces appearing

```bash
# Check collector logs
kubectl logs -n observability deployment/otel-collector

# Verify service instrumentation
kubectl logs deployment/resident-cement-gateway | grep -i "opentelemetry"

# Check Jaeger collector
kubectl logs -n observability -l app.kubernetes.io/component=collector
```

### High memory usage

```bash
# Adjust batch processor
kubectl edit opentelemetrycollector resident-cement -n observability
# Increase batch timeout and size
```

## References

- [Jaeger Documentation](https://www.jaegertracing.io/docs/)
- [OpenTelemetry JS](https://opentelemetry.io/docs/instrumentation/js/)
- [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/)
