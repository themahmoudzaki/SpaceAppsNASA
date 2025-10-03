@echo off
echo Starting Docker Compose...
docker-compose up -d

echo Waiting for containers to start...
timeout /t 5 >nul

echo Opening http://localhost in default browser...
start http://localhost

echo Done.