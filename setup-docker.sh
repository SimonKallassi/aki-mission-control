#!/usr/bin/env bash
# Run this script with sudo to install Docker and start Mission Control
# Usage: sudo bash setup-docker.sh

set -e

echo "=== Installing Docker ==="
curl -fsSL https://get.docker.com | sh
usermod -aG docker simon

echo "=== Starting containers ==="
cd "$(dirname "$0")"
docker compose up --build -d

echo "=== Waiting for health ==="
sleep 15
docker compose ps

echo "=== Health checks ==="
curl -sf http://localhost:8000/health && echo " ✅ Backend OK" || echo " ❌ Backend not ready"
curl -sf http://localhost:3000 && echo " ✅ Frontend OK" || echo " ❌ Frontend not ready"

echo ""
echo "Done! Open http://localhost:3000 to access Mission Control."
echo "Toggle the 🏢 Pixel Office panel in the top bar of the dashboard."
