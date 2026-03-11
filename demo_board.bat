@echo off
REM ResidentCement MVP - Board Demo Script
REM Audit Session: forensics1032026
REM Usage: demo_board.bat

setlocal enabledelayedexpansion

echo ============================================
echo [ResidentCement MVP - Board Demo]
echo ============================================
echo.

REM Step 1: Check if image exists
echo [1/4] Checking MVP image...
docker images residentcement-mvp:board-ready --format "{{.Repository}}:{{.Tag}}" | findstr "residentcement-mvp:board-ready" >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] MVP image not found. Please run: docker build -f Dockerfile.mvp -t residentcement-mvp:board-ready .
    pause
    exit /b 1
)
echo [OK] MVP image found

REM Step 2: Stop any existing demo container
echo [2/4] Cleaning up existing containers...
docker stop board-demo 2>nul
docker rm board-demo 2>nul

REM Step 3: Start secure container
echo [3/4] Starting secure container...
docker run -d -p 8080:3001 --name board-demo -e DEMO_MODE=true -e ENV=board-presentation residentcement-mvp:board-ready
if %errorlevel% neq 0 (
    echo [ERROR] Failed to start container
    pause
    exit /b 1
)

REM Wait for container to start
echo [INFO] Waiting for service to start...
timeout /t 10 /nobreak >nul

REM Step 4: Health check
echo [4/4] Running health check...
curl -s http://localhost:8080/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Health check passed
) else (
    echo [WARNING] Health check pending (service may still be starting)
)

echo.
echo ============================================
echo [DEMO READY]
echo ============================================
echo.
echo Access the demo at: http://localhost:8080
echo.
echo To stop the demo, press Ctrl+C then run:
echo   docker stop board-demo
echo.
echo To view logs:
echo   docker logs -f board-demo
echo.
echo ============================================

REM Keep window open
pause

REM Cleanup on exit
echo [INFO] Stopping demo...
docker stop board-demo 2>nul

endlocal
