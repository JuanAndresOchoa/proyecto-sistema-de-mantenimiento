@echo off
echo Clearing electron-builder cache...
rmdir /s /q "%LOCALAPPDATA%\electron-builder\Cache" 2>nul
rmdir /s /q "node_modules\.cache" 2>nul
rmdir /s /q "electron-cache" 2>nul
echo Cache cleared successfully!
echo.
echo Now run: npm run build
pause
