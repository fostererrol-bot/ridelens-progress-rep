# RideLens iOS Quick Start Guide

## 🚀 Get Your App Running on iOS in 30 Minutes

This is a condensed version focusing on technical steps only.

---

## Prerequisites

✅ Mac computer with macOS  
✅ Xcode installed (from Mac App Store)  
✅ Node.js and npm installed  
✅ Apple Developer Account ($99/year)  

---

## Step-by-Step Commands

### 1. Install CocoaPods (one-time setup)
```bash
sudo gem install cocoapods
```

### 2. Navigate to your project
```bash
cd /path/to/ridelens-progress-rep
```

### 3. Install dependencies
```bash
npm install
```

### 4. Add iOS platform (first time only)
```bash
npx cap add ios
```

This creates the `ios/` folder with your Xcode project.

### 5. Build your web app
```bash
npm run build
```

### 6. Sync web assets to iOS
```bash
npx cap sync ios
```

Run this command **every time** you make changes to your web code.

### 7. Open in Xcode
```bash
npx cap open ios
```

---

## In Xcode: Essential Configuration

### A. Update Bundle Identifier

1. Click project name in left sidebar
2. Select "App" target
3. **General** tab → **Identity**
4. Change Bundle Identifier to: `com.esfdesigns.ridelens`
   (or your unique identifier)

### B. Configure Signing

1. **Signing & Capabilities** tab
2. Check ✅ "Automatically manage signing"
3. Select your **Team** (your Apple Developer account)

### C. Update Info.plist (if needed)

If your app accesses photos, add:

1. Right-click `Info.plist` → Open As → Source Code
2. Add before `</dict>`:

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>Import ride screenshots from your photo library</string>
```

---

## Test on Device

### 1. Connect iPhone to Mac

### 2. Trust Developer Certificate (first time)
On iPhone: **Settings** → **General** → **VPN & Device Management** → Trust your developer certificate

### 3. Select Device in Xcode
Top toolbar: Change "iPhone Simulator" to your actual device

### 4. Build and Run
Press **⌘ + R** or click ▶️ Play button

---

## Build for App Store

### 1. Select "Any iOS Device"
Top toolbar: Change device to "Any iOS Device (arm64)"

### 2. Archive
**Product** → **Archive** (or ⌘ + Shift + B)

Wait 5-10 minutes for build.

### 3. Distribute
1. Organizer window opens
2. Click **Distribute App**
3. Select **App Store Connect**
4. Click **Upload**
5. Accept defaults → **Upload**

Wait 10-20 minutes for upload to complete.

---

## After Upload: App Store Connect

### 1. Visit App Store Connect
https://appstoreconnect.apple.com/

### 2. Create App (first time only)
- **My Apps** → **+** → **New App**
- Fill in: Name, Bundle ID, SKU

### 3. Complete App Information
- Upload screenshots
- Add description
- Set privacy policy URL
- Choose category

### 4. Select Build
- Version → **Build** section
- Select your uploaded build

### 5. Submit for Review
Click **Submit for Review**

---

## Common Issues & Quick Fixes

### ❌ "No bundle identifier found"
**Fix:** Update `capacitor.config.ts`:
```typescript
appId: 'com.esfdesigns.ridelens',
```
Then run: `npx cap sync ios`

### ❌ "Provisioning profile not found"
**Fix:** In Xcode:
- Signing & Capabilities
- Uncheck and recheck "Automatically manage signing"

### ❌ "App crashes on device"
**Fix:** Check Console (Cmd + Shift + C) for errors. Usually API/CORS issues.

### ❌ "Icons missing"
**Fix:** Generate icons:
```bash
npx capacitor-assets generate --ios
```

---

## Update Workflow (After First Build)

When you make changes:

```bash
# 1. Build web app
npm run build

# 2. Sync to iOS
npx cap sync ios

# 3. Increment build number in Xcode
# General → Identity → Build: 2 (then 3, 4, 5...)

# 4. Archive again
# Product → Archive → Distribute
```

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `capacitor.config.ts` | Main Capacitor config (Bundle ID, app name) |
| `package.json` | Dependencies and build scripts |
| `ios/App/App.xcodeproj` | Xcode project file |
| `ios/App/App/Info.plist` | iOS app permissions and metadata |
| `dist/` | Built web assets (synced to iOS) |

---

## Helpful Commands

```bash
# Check Capacitor status
npx cap doctor

# Update Capacitor
npx cap update ios

# Clean and rebuild
rm -rf ios/App/App/public
npx cap sync ios

# View Capacitor logs (when app running)
npx cap run ios -l
```

---

## Need More Help?

📖 **Full Guide:** See `APP_STORE_PUBLISHING_GUIDE.md`  
🔗 **Capacitor Docs:** https://capacitorjs.com/docs/ios  
💬 **Discord:** https://discord.gg/UPYsMjQjsy  

---

## ✅ Quick Checklist

Before submitting:

- [ ] Bundle ID is unique
- [ ] Signing configured
- [ ] Tested on real device
- [ ] All icons present (1024x1024)
- [ ] Privacy policy created
- [ ] Screenshots ready
- [ ] No crashes
- [ ] Build number incremented

---

**You're ready to ship! 🚀**
