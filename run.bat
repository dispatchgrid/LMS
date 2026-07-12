@echo off
set PORT=3000
set WAIT_TIME=5
set PAGE=dataentry

echo Starting server on port %PORT%...
start cmd /k "npm start"