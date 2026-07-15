@echo off
cd /d %~dp0

REM Fetch latest info from remote
git fetch origin

REM Compare local HEAD with remote
for /f %%i in ('git rev-parse HEAD') do set LOCAL=%%i
for /f %%i in ('git rev-parse origin/main') do set REMOTE=%%i

if "%LOCAL%"=="%REMOTE%" (
    echo No new commits. Continuing...
    REM Put your normal workflow here
) else (
    echo New commits detected! Doing something else...
    REM Put your update logic here (e.g., git pull, notify, etc.)
)

pause
