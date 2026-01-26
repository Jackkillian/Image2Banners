#!/bin/bash
echo Cleaning
rm -rf release/
rm -rf dist/

echo Installing python dependencies
pip3 install -r requirements.txt
pip3 install pyinstaller

echo Installing node dependencies
npm install

echo Building python
pyinstaller app.spec

echo Building electron
npx electron-builder --mac --linux

echo Completed build
