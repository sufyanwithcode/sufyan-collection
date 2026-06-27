#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  deploy-k8s.sh  —  Apply all Kubernetes manifests in order
#  Usage:  bash k8s/deploy-k8s.sh
# ─────────────────────────────────────────────────────────────
set -e

NAMESPACE="sufyan-collection"
MANIFEST_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🚀  Deploying Sufyan Collection to Kubernetes..."
echo "📁  Manifest directory: $MANIFEST_DIR"
echo ""

# Apply manifests in numbered order
for f in "$MANIFEST_DIR"/*.yaml; do
  echo "▶  Applying: $(basename "$f")"
  kubectl apply -f "$f"
done

echo ""
echo "⏳  Waiting for deployments to be ready..."
kubectl rollout status deployment/sc-mongo     -n "$NAMESPACE" --timeout=120s
kubectl rollout status deployment/sc-backend   -n "$NAMESPACE" --timeout=120s
kubectl rollout status deployment/sc-frontend  -n "$NAMESPACE" --timeout=120s

echo ""
echo "✅  All deployments are ready!"
echo ""
echo "── Access URLs ──────────────────────────────────────────"
echo "  Website     → http://$(minikube ip):30080"
echo "  Prometheus  → http://$(minikube ip):30090"
echo "  Grafana     → http://$(minikube ip):30300  (admin / Grafana@123)"
echo "─────────────────────────────────────────────────────────"
