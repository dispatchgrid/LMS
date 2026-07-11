@echo off
set PORT=3000
set WAIT_TIME=10
set PAGE=dataentry

echo Starting server on port %PORT%...
start cmd /k "npm run dev"
echo Waiting %WAIT_TIME% seconds...
timeout /t %WAIT_TIME% /nobreak >nul
start http://localhost:%PORT%/%PAGE%