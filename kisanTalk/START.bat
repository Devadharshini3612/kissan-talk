@echo off
REM Start Backend Server
echo Starting KisanTalk Backend Server...
start cmd /k "cd /d %~dp0backend && node .\server.js"

REM Wait for backend to start
timeout /t 3

REM Start Frontend
echo Starting KisanTalk Frontend...
start cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ========================================
echo KisanTalk is starting!
echo ========================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo ========================================
echo Please wait for both servers to start...
echo.

pause
