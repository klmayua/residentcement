@echo off
echo =====================================================
echo ResidentCement - Docker Startup and Deployment Script
echo =====================================================
echo.

echo [1/4] Starting Docker Desktop...
start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"

echo [2/4] Waiting for Docker to be ready (this may take 1-2 minutes)...
timeout /t 60 /nobreak

echo [3/4] Checking Docker status...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running. Please check Docker Desktop.
    pause
    exit /b 1
)
echo Docker is running!

echo.
echo [4/4] Deploying ResidentCement...
cd /d "%~dp0"

echo Stopping any existing containers...
docker compose -f docker-compose.yml down --volumes --remove-orphans --timeout 10

echo Building and starting all services...
docker compose -f docker-compose.yml up --build -d --force-recreate

echo.
echo =====================================================
echo Deployment Complete!
echo =====================================================
echo.
echo Services available at:
echo   - API Gateway:    http://localhost:8080
echo   - API Docs:       http://localhost:8080/api-docs
echo   - Health Check:   http://localhost:8080/health
echo   - PostgreSQL:     localhost:5432
echo   - MongoDB:        localhost:27017
echo   - Redis:          localhost:6379
echo   - Kafka:          localhost:9092
echo   - Kafka UI:       http://localhost:8085
echo   - MinIO Console:  http://localhost:9001
echo.
echo To view logs: docker compose -f docker-compose.yml logs -f gateway
echo.
