# ResidentCement Falco Runtime Security

[Falco](https://falco.org/) is a cloud-native runtime security tool that detects anomalous activity in containers and Kubernetes.

## Installation

### 1. Install Falco via Helm

```bash
# Add Falco Helm repository
helm repo add falcosecurity https://falcosecurity.github.io/charts
helm repo update

# Install Falco
helm install falco falcosecurity/falco \
  --namespace falco \
  --create-namespace \
  --set falcosidekick.enabled=true \
  --set falcosidekick.webui.enabled=true \
  --set falcosidekick.config.slack.webhookurl="YOUR_SLACK_WEBHOOK" \
  --set collectors.containerd.enabled=true
```

### 2. Apply Custom Rules

```bash
# Create ConfigMap with custom rules
kubectl create configmap resident-cement-falco-rules \
  --from-file=resident-cement-rules.yaml \
  -n falco

# Mount the rules in Falco DaemonSet
kubectl patch daemonset falco -n falco --type='json' -p='[
  {
    "op": "add",
    "path": "/spec/template/spec/volumes/-",
    "value": {
      "name": "custom-rules",
      "configMap": {
        "name": "resident-cement-falco-rules"
      }
    }
  },
  {
    "op": "add",
    "path": "/spec/template/spec/containers/0/volumeMounts/-",
    "value": {
      "name": "custom-rules",
      "mountPath": "/etc/falco/rules.d/resident-cement-rules.yaml",
      "subPath": "resident-cement-rules.yaml"
    }
  }
]'
```

### 3. Verify Installation

```bash
# Check Falco pods
kubectl get pods -n falco

# View Falco logs
kubectl logs -n falco -l app=falco

# Check Falco sidekick UI
kubectl port-forward svc/falco-falcosidekick-ui 2802:2802 -n falco
# Open http://localhost:2802 in browser
```

## Custom Rules

The `resident-cement-rules.yaml` includes:

| Rule | Priority | Description |
|------|----------|-------------|
| Privilege Escalation | CRITICAL | Detects privilege escalation attempts |
| Sensitive File Access | WARNING | Monitors access to /etc/shadow, secrets |
| Unexpected Outbound | NOTICE | Detects external connections |
| Shell in Container | WARNING | Detects shell spawning |
| Crypto Mining | CRITICAL | Detects mining processes |
| Database Credential Access | WARNING | Monitors credential file access |
| Unauthorized K8s API | NOTICE | Detects unauthorized API access |
| Large File Write | NOTICE | Detects potential data exfiltration |
| Reverse Shell | CRITICAL | Detects reverse shell attempts |
| Package Management | NOTICE | Monitors package installations |

## Integration with Alerting

### Slack Notifications

```bash
helm upgrade falco falcosecurity/falco \
  --namespace falco \
  --set falcosidekick.enabled=true \
  --set falcosidekick.config.slack.webhookurl="https://hooks.slack.com/services/YOUR/WEBHOOK/URL" \
  --set falcosidekick.config.slack.minimumpriority="warning"
```

### Prometheus Metrics

```bash
helm upgrade falco falcosecurity/falco \
  --namespace falco \
  --set falcosidekick.enabled=true \
  --set falcosidekick.config.prometheus.enabled=true
```

### AlertManager

```bash
helm upgrade falco falcosecurity/falco \
  --namespace falco \
  --set falcosidekick.enabled=true \
  --set falcosidekick.config.alertmanager.hostport="http://alertmanager:9093"
```

## Testing Rules

```bash
# Trigger a test event (shell in container)
kubectl exec -it deployment/resident-cement-gateway -- /bin/sh -c "echo 'Falco test'"

# Check Falco logs for the event
kubectl logs -n falco -l app=falco | grep "Shell spawned"
```

## Troubleshooting

### Falco not detecting events

```bash
# Check Falco is running
kubectl get pods -n falco

# Verify rules are loaded
kubectl exec -it daemonset/falco -n falco -- falco -L

# Check for rule syntax errors
kubectl logs -n falco -l app=falco | grep -i error
```

### High CPU/Memory Usage

```bash
# Adjust Falco buffer sizes
helm upgrade falco falcosecurity/falco \
  --namespace falco \
  --set falco.jsonOutput=true \
  --set falco.fileOutput.enabled=false
```

## References

- [Falco Documentation](https://falco.org/docs/)
- [Falco Rules](https://falco.org/docs/rules/)
- [Falcosidekick](https://github.com/falcosecurity/falcosidekick)
