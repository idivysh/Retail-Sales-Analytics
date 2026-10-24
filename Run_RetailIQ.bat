@echo off
setlocal

set "PROJECT_ROOT=C:\Users\idivysh\Downloads\Career Portfolio\Projects\Retail Sales Analytics\retail-sales-analytics"
set "VENV_ACTIVATE=C:\venvs\retail\Scripts\activate.bat"

if not exist "%PROJECT_ROOT%\backend\main.py" (
    echo ERROR: Backend not found:
    echo "%PROJECT_ROOT%\backend\main.py"
    echo Please update PROJECT_ROOT in this BAT file if you moved the project.
    pause
    exit /b 1
)

if not exist "%PROJECT_ROOT%\frontend\package.json" (
    echo ERROR: Frontend not found:
    echo "%PROJECT_ROOT%\frontend\package.json"
    echo Please update PROJECT_ROOT in this BAT file if you moved the project.
    pause
    exit /b 1
)

if not exist "%VENV_ACTIVATE%" (
    echo ERROR: Python environment activation file not found:
    echo "%VENV_ACTIVATE%"
    echo Please update VENV_ACTIVATE in this BAT file if your environment is elsewhere.
    pause
    exit /b 1
)

echo Starting RetailIQ local dashboard...

start "RetailIQ Backend - FastAPI" cmd /k "cd /d ""%PROJECT_ROOT%\backend"" && call ""%VENV_ACTIVATE%"" && uvicorn main:app --reload"
start "RetailIQ Frontend - Next.js" cmd /k "cd /d ""%PROJECT_ROOT%\frontend"" && npm run dev"

echo.
echo Backend and frontend are starting in separate windows.
echo Wait a few seconds, then open: http://localhost:3000
echo Backend API: http://127.0.0.1:8000
echo.
echo Keep both windows open while using the local dashboard.
endlocal
