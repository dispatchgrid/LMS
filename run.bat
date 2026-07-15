@echo off
cd /d %~dp0

git fetch origin

for /f %%i in ('git rev-parse HEAD') do set LOCAL=%%i
for /f %%i in ('git rev-parse origin/main') do set REMOTE=%%i

if "%LOCAL%"=="%REMOTE%" (
    start.bat
) else (
    update.bat
)

