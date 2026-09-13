@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo  Three.js Demo - http://127.0.0.1:5173
echo ========================================
echo.

REM Prefer simple Python http.server (no npm required)
where python >nul 2>nul
if %errorlevel%==0 (
  echo Opening browser in 2 seconds...
  start "" "http://127.0.0.1:5173/"
  python -m http.server 5173 --bind 127.0.0.1
  goto end
)

where py >nul 2>nul
if %errorlevel%==0 (
  echo Opening browser in 2 seconds...
  start "" "http://127.0.0.1:5173/"
  py -3 -m http.server 5173 --bind 127.0.0.1
  goto end
)

echo [ERROR] 未找到 python，请安装 Python 3，或用 VS Code Live Server 打开 index.html
pause
exit /b 1

:end
pause
