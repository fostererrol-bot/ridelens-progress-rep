#!/bin/bash

# RideLens iOS Build & Sync Helper Script
# This script automates the iOS build and sync process

set -e  # Exit on error

echo "🚀 RideLens iOS Build Helper"
echo "=============================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

# Step 1: Build the web app
echo "🔨 Building web app..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi
echo ""

# Step 2: Check if iOS platform exists
if [ ! -d "ios" ]; then
    echo "📱 iOS platform not found. Adding iOS platform..."
    npx cap add ios
    echo "✅ iOS platform added"
    echo ""
fi

# Step 3: Sync to iOS
echo "🔄 Syncing to iOS..."
npx cap sync ios

if [ $? -eq 0 ]; then
    echo "✅ Sync successful"
else
    echo "❌ Sync failed"
    exit 1
fi
echo ""

# Step 4: Copy web assets
echo "📋 Copying web assets..."
npx cap copy ios
echo "✅ Assets copied"
echo ""

# Step 5: Open in Xcode
echo "🎯 Opening Xcode..."
npx cap open ios

echo ""
echo "✅ All done! Xcode should open shortly."
echo ""
echo "Next steps in Xcode:"
echo "1. Select your device or 'Any iOS Device'"
echo "2. Build and run (⌘ + R) for testing"
echo "3. Or archive (Product → Archive) for App Store"
echo ""
