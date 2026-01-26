@echo off
echo Cleaning
if exist release rmdir /s /q release
if exist dist rmdir /s /q dist

echo Installing python dependencies
pip install -r requirements.txt
pip install pyinstaller

echo Installing node dependencies
npm install

echo Building python
pyinstaller app.spec

echo Building electron
npx electron-builder --win

echo Completed build
