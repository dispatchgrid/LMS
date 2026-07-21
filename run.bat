@echo off
git fetch origin
git reset --hard origin/main
call npm install
timeout /t 5 /nobreak >nul
call start.bat
