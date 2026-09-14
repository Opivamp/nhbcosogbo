@echo off
title Push NHBC Osogbo to GitHub
color 0b
echo ================================================================
echo   NEW HERITAGE BAPTIST CHURCH (NHBC OSOGBO) - GITHUB PUSH
echo   Target: https://github.com/Opivamp/nhbcosogbo.git
echo ================================================================
echo.
echo Setting up environment...
set "PATH=C:\Users\Acer\.tools\git\cmd;C:\Users\Acer\.tools\git\mingw64\bin;%PATH%"
cd /d "C:\Users\Acer\.gemini\antigravity\scratch\nhbc-osogbo"

echo Pushing code to branch 'main'...
echo (If prompted, please sign in with your GitHub account in your browser)
echo.
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ================================================================
    echo   SUCCESS! Your project is now live on GitHub:
    echo   https://github.com/Opivamp/nhbcosogbo
    echo ================================================================
) else (
    echo.
    echo Something went wrong. Please check your internet connection or login.
)
echo.
pause
