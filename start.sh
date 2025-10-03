#!/bin/bash
echo "Starting Docker Compose..."
docker-compose up -d

echo "Waiting for containers to start..."
sleep 5

echo "Opening http://localhost in default browser..."
if command -v xdg-open >/dev/null; then
  xdg-open http://localhost
elif command -v open >/dev/null; then
  open http://localhost
else
  echo "Please open http://localhost manually."
fi