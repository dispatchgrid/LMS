@echo off
git fetch origin
git reset --hard origin/main
npm install
timeout /t 5 /nobreak >nul
start.bat
