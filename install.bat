@echo off
echo === Character Counter Extension Installer ===
echo.

echo 1. Installing dependencies...
call npm install

if %ERRORLEVEL% neq 0 (
    echo Error: npm install failed
    pause
    exit /b 1
)

echo.
echo 2. Compiling TypeScript...
call npm run compile

if %ERRORLEVEL% neq 0 (
    echo Error: TypeScript compilation failed
    pause
    exit /b 1
)

echo.
echo 3. Extension successfully built!
echo.
echo Next steps:
echo - Press F5 to test in Extension Development Host
echo - Or copy the extension folder to your VS Code extensions directory
echo.
echo Extension files:
echo - package.json (extension manifest)
echo - out/extension.js (compiled extension)
echo - README.md (documentation)
echo.

pause
