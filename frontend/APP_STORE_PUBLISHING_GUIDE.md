# RideLens - Apple App Store Publishing Guide

## 📋 Complete Checklist for App Store Submission

This guide will walk you through the entire process of publishing RideLens to the Apple App Store.

---

## Part 1: Prerequisites & Setup (Do This First!)

### Step 1: Create Apple Developer Account
**Cost:** $99 USD per year

1. Go to https://developer.apple.com/programs/enroll/
2. Sign in with your Apple ID (or create one)
3. Choose Individual or Organization account
4. Complete the enrollment form
5. Pay the $99 annual fee
6. Wait for approval (usually 24-48 hours)

**⚠️ IMPORTANT:** You cannot proceed with iOS app submission without an active Apple Developer Account.

---

### Step 2: Install Required Software

You'll need a Mac computer with:

1. **macOS** (latest version recommended)
2. **Xcode** (latest version from Mac App Store)
   ```bash
   # Install Xcode from App Store or run:
   xcode-select --install
   ```
3. **Node.js & npm** (already installed if you're developing the app)
4. **CocoaPods** (for iOS dependencies)
   ```bash
   sudo gem install cocoapods
   ```

---

## Part 2: Prepare Your RideLens App for iOS

### Step 3: Generate iOS Project Files

From your project root directory:

```bash
# Install dependencies
npm install

# Add iOS platform (creates ios folder)
npx cap add ios

# Build the web app
npm run build

# Sync web assets to iOS project
npx cap sync ios
```

This will create an `ios/` folder with your Xcode project.

---

### Step 4: Configure App Identity

#### A. Update Bundle Identifier
Edit `capacitor.config.ts`:

```typescript
const config: CapacitorConfig = {
  appId: 'com.esfdesigns.ridelens', // Change this to your unique ID
  appName: 'RideLens',
  webDir: 'dist',
  // ... rest of config
};
```

**Bundle ID Rules:**
- Must be unique across all App Store apps
- Use reverse domain notation: `com.yourcompany.appname`
- Only lowercase letters, numbers, hyphens, and periods
- Example: `com.esfdesigns.ridelens`

#### B. Update App Information
You'll need this information ready:

- **App Name:** RideLens
- **Subtitle:** Ride Data Insight
- **Description:** (Prepare your full App Store description)
- **Keywords:** zwift, cycling, ride data, progress tracking, fitness
- **Category:** Health & Fitness (or Sports)
- **Age Rating:** 4+ (or appropriate rating)

---

### Step 5: Create App Icons

Apple requires specific icon sizes. You need:

| Size | Purpose |
|------|---------|
| 1024x1024 | App Store |
| 180x180 | iPhone Pro Max |
| 167x167 | iPad Pro |
| 152x152 | iPad |
| 120x120 | iPhone |
| 87x87 | iPhone (settings) |
| 80x80 | iPad (spotlight) |
| 76x76 | iPad |
| 58x58 | iPhone (settings) |
| 40x40 | iPad (spotlight) |

**Tools to generate icons:**
- https://www.appicon.co/
- https://icon.kitchen/
- Or use Capacitor CLI: `npx capacitor-assets generate`

Place icons in: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

---

### Step 6: Create App Screenshots

Apple requires screenshots for different device sizes:

**Required Sizes:**
- 6.9" Display (iPhone 16 Pro Max): 1320 x 2868 pixels
- 6.7" Display (iPhone 14 Pro Max): 1290 x 2796 pixels
- 5.5" Display (iPhone 8 Plus): 1242 x 2208 pixels
- 12.9" iPad Pro: 2048 x 2732 pixels
- 6.5" Display: 1284 x 2778 pixels

**What to capture:**
1. Dashboard showing ride statistics
2. Import screenshots feature
3. Trends/charts view
4. History page
5. Between-report comparison (your key feature!)

**Tips:**
- Use Xcode Simulator to capture clean screenshots
- Add text overlays highlighting key features (optional)
- Show the app in action with real data
- Keep them clean and professional

---

## Part 3: Configure iOS Project in Xcode

### Step 7: Open Project in Xcode

```bash
# Open the iOS project
npx cap open ios
```

This opens Xcode with your project.

---

### Step 8: Configure Signing & Capabilities

1. In Xcode, click on your project name in the left sidebar
2. Select your app target under "TARGETS"
3. Go to "Signing & Capabilities" tab
4. Check "Automatically manage signing"
5. Select your Apple Developer Team from dropdown
6. Xcode will generate a provisioning profile

**Required Capabilities for RideLens:**
- None specifically required (unless you use camera, location, etc.)

---

### Step 9: Update App Information in Xcode

1. **General Tab:**
   - Display Name: `RideLens`
   - Bundle Identifier: `com.esfdesigns.ridelens` (match capacitor.config.ts)
   - Version: `1.0.0` (or your version)
   - Build: `1` (increment for each submission)

2. **Info.plist Settings:**
   Add these keys if you access device features:
   ```xml
   <!-- If you use photo library -->
   <key>NSPhotoLibraryUsageDescription</key>
   <string>RideLens needs access to import ride screenshots from your photo library</string>
   
   <!-- If you use camera -->
   <key>NSCameraUsageDescription</key>
   <string>RideLens needs camera access to capture ride screenshots</string>
   ```

---

### Step 10: Test on Real Device

1. Connect your iPhone to your Mac
2. In Xcode, select your device from the device dropdown
3. Click the "Play" button to build and run
4. Test all features:
   - Screenshot upload
   - Data extraction
   - Dashboard views
   - Trend charts
   - Navigation

**Fix any issues before proceeding!**

---

## Part 4: App Store Connect Setup

### Step 11: Create App in App Store Connect

1. Go to https://appstoreconnect.apple.com/
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - **Platform:** iOS
   - **Name:** RideLens
   - **Primary Language:** English
   - **Bundle ID:** Select `com.esfdesigns.ridelens`
   - **SKU:** `ridelens-001` (unique identifier)
   - **User Access:** Full Access

---

### Step 12: Complete App Information

#### A. App Information Section
- **Name:** RideLens
- **Subtitle:** Transform ride screenshots into insights
- **Privacy Policy URL:** (You'll need to create one)
- **Category:** Health & Fitness
- **Secondary Category:** Sports (optional)

#### B. Pricing and Availability
- **Price:** Free (or set your price)
- **Availability:** All countries (or select specific)

#### C. App Privacy
You'll need to answer questions about data collection:
- Do you collect data? (Probably YES if using Supabase)
- What types? (Ride data, user account info)
- How is it used? (App functionality)
- Is it linked to identity? (YES if user accounts)

**Create a simple privacy policy:**
```
Privacy Policy for RideLens

RideLens collects and stores:
- User account information (email)
- Ride screenshots uploaded by users
- Extracted ride data from screenshots

This data is:
- Stored securely on Supabase servers
- Only accessible by you
- Not shared with third parties
- Not used for advertising

You can delete your data anytime through Settings.

Contact: [your email]
```

Host this on a public URL and add it to App Store Connect.

---

### Step 13: Prepare Version Information

For your 1.0.0 submission:

**What's New in This Version:**
```
Welcome to RideLens!

Transform your ride screenshots into structured data and meaningful trends.

Features:
• Upload ride screenshots
• Automatic data extraction
• Between-report comparisons
• Track career progress
• Beautiful, readable dashboards
• Offline-capable Progressive Web App

Start understanding your ride progress today!
```

**Description:**
```
RideLens — Ride Data Insight

RideLens transforms your own ride screenshots into structured data and meaningful trends, helping you see progress clearly over time rather than isolated numbers.

HOW IT WORKS:
1. Upload your ride screenshots directly into the app
2. Key metrics are extracted and stored in a clean, consistent format
3. Track trends and compare reports to understand what's improving

KEY FEATURES:
• Between-report comparisons — see what changed since the last snapshot, not just cumulative totals
• User-controlled data — all data is uploaded by you, nothing is pulled from external systems
• Calm, readable dashboards — built to be understandable at a glance
• Career progress, performance metrics, and training status tracking
• Progressive Web App — works offline and syncs when connected

RideLens is an independent project by ESF Designs Vision, built with an engineering mindset. Not affiliated with or endorsed by Zwift. User-provided data only.

Built for riders who want to see their progress, not just their stats.
```

**Keywords:** (max 100 characters, comma-separated)
```
cycling,ride data,progress,tracking,fitness,training,zwift,statistics,analytics,dashboard
```

**Support URL:** Your website or GitHub repo
**Marketing URL:** (optional)

---

### Step 14: Upload Screenshots & Previews

1. In App Store Connect, go to your app
2. Click version "1.0" → "iOS App" → "Screenshots"
3. Upload screenshots for each device size (from Step 6)
4. Optionally add app preview videos (15-30 seconds)

---

## Part 5: Build & Submit

### Step 15: Archive Your App

1. In Xcode, select "Any iOS Device (arm64)" as the destination
2. Go to: **Product** → **Archive**
3. Wait for build to complete (5-10 minutes)
4. The Organizer window will open automatically

---

### Step 16: Upload to App Store Connect

1. In Organizer, select your archive
2. Click "Distribute App"
3. Select "App Store Connect"
4. Click "Upload"
5. Select your distribution options:
   - Include bitcode: NO (not needed anymore)
   - Upload symbols: YES (for crash reports)
   - Manage version: Automatically
6. Click "Next" → "Upload"
7. Wait for upload to complete (10-20 minutes)

---

### Step 17: Submit for Review

1. Go back to App Store Connect
2. Find your app → Version "1.0"
3. Click "Build" → Select your uploaded build
4. Complete all required sections (should show checkmarks)
5. Click "Submit for Review"

**Review Questions:**
- Does your app access third-party content? NO (user provides own data)
- Does your app use encryption? YES (HTTPS standard encryption)
- Is your app designed to encourage minors to share info? NO

---

### Step 18: Wait for Review

- **Typical wait time:** 1-3 days
- **What Apple reviews:**
  - App functionality
  - Content appropriateness
  - Compliance with guidelines
  - Performance and crashes

**Common rejection reasons:**
- Crashes on launch
- Missing functionality
- Poor privacy policy
- Misleading screenshots
- Use of third-party trademarks without permission

---

## Part 6: After Approval

### Step 19: Release Your App

Once approved, you'll receive an email. You can:

1. **Automatically release** (app goes live immediately)
2. **Manually release** (you choose when)
3. **Schedule release** (specific date/time)

---

### Step 20: Monitor & Update

**Post-launch checklist:**
- Monitor App Store Connect for:
  - Crash reports
  - User reviews
  - Download statistics
- Respond to user reviews
- Plan updates based on feedback

**Updating your app:**
1. Make changes to code
2. Increment version or build number
3. Build → Archive → Upload
4. Create new version in App Store Connect
5. Submit for review again

---

## 🚨 Common Issues & Solutions

### Issue: "Failed to register bundle identifier"
**Solution:** Change your Bundle ID in capacitor.config.ts and Xcode

### Issue: "No provisioning profiles found"
**Solution:** Check you're signed into Xcode with correct Apple ID

### Issue: "App crashes on launch"
**Solution:** Check Console in Xcode for error messages. Often CORS or API issues.

### Issue: "Invalid Bundle Structure"
**Solution:** Ensure all required icons are present

### Issue: "This bundle is invalid"
**Solution:** Check that CFBundleVersion is numeric (like "1" not "1.0")

---

## 📱 Quick Command Reference

```bash
# Install dependencies
npm install

# Build web app
npm run build

# Add iOS platform (first time only)
npx cap add ios

# Sync changes to iOS
npx cap sync ios

# Open in Xcode
npx cap open ios

# Update dependencies
npx cap update ios
```

---

## 🔗 Important Links

- **Apple Developer:** https://developer.apple.com/
- **App Store Connect:** https://appstoreconnect.apple.com/
- **App Store Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Human Interface Guidelines:** https://developer.apple.com/design/human-interface-guidelines/
- **Capacitor iOS Docs:** https://capacitorjs.com/docs/ios

---

## ✅ Pre-Submission Checklist

Before hitting "Submit for Review":

- [ ] Apple Developer Account active ($99 paid)
- [ ] App runs on real device without crashes
- [ ] All icons present (1024x1024 required)
- [ ] Screenshots uploaded for all required sizes
- [ ] Privacy Policy URL active and accessible
- [ ] Support URL working
- [ ] App description complete and accurate
- [ ] Keywords optimized
- [ ] Version number set (e.g., 1.0.0)
- [ ] Build number set (e.g., 1)
- [ ] Correct bundle identifier
- [ ] Signing configured in Xcode
- [ ] All app features working
- [ ] Tested on multiple iOS versions
- [ ] No crashes or major bugs
- [ ] Complies with App Store Guidelines

---

## 📞 Need Help?

If you get stuck:
1. Check Apple Developer Forums: https://developer.apple.com/forums/
2. Capacitor Discord: https://discord.gg/UPYsMjQjsy
3. Stack Overflow with tags: `ios`, `capacitor`, `app-store-connect`

---

## 🎉 You're Ready!

Follow these steps carefully, and your RideLens app will be live on the App Store soon!

**Estimated Total Time:**
- First time: 4-6 hours (setup + submission)
- Updates: 1-2 hours

**Good luck with your submission! 🚀**

---

*Last updated: January 2025*
*For RideLens by ESF Designs Vision*
