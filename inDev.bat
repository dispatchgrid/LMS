@echo off
cd /d %~dp0

REM Fetch latest info from remote
git fetch origin

REM Compare local HEAD with remote
for /f %%i in ('git rev-parse HEAD') do set LOCAL=%%i
for /f %%i in ('git rev-parse origin/main') do set REMOTE=%%i

if "%LOCAL%"=="%REMOTE%" (
    run.bat
) else (
    update.bat
)

