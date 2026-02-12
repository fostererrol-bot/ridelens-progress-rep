# RideLens - Pre-Submission Technical Checklist

## 📱 iOS App Store Submission Checklist for RideLens

Use this checklist to ensure your app is ready for submission.

---

## 1. Apple Developer Account

- [ ] Enrolled in Apple Developer Program ($99/year paid)
- [ ] Account status: Active
- [ ] Team ID available
- [ ] Logged into Xcode with Apple ID

---

## 2. App Identity & Configuration

### Bundle Identifier
- [ ] Unique bundle ID chosen: `com.esfdesigns.ridelens`
- [ ] Bundle ID updated in `capacitor.config.ts`
- [ ] Bundle ID updated in Xcode project
- [ ] Bundle ID registered in App Store Connect

### App Information
- [ ] **App Name:** RideLens
- [ ] **Display Name:** RideLens
- [ ] **Version:** 1.0.0
- [ ] **Build Number:** 1
- [ ] **Category:** Health & Fitness
- [ ] **Subtitle:** Ride Data Insight

---

## 3. Icons & Visual Assets

### App Icon (Required)
- [ ] 1024x1024 px App Store icon (no transparency, no alpha channel)
- [ ] Icon set for all iOS sizes generated
- [ ] Icons placed in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- [ ] Icon verified in Xcode (no warnings)

**Generate icons:** 
```bash
# Option 1: Use online tool
# Upload 1024x1024 to https://www.appicon.co/

# Option 2: Use Capacitor CLI
npx capacitor-assets generate --ios
```

### Splash Screen
- [ ] Splash screen configured in `capacitor.config.ts`
- [ ] Splash screen displays correctly on launch

---

## 4. App Screenshots

Required device sizes and count:

### iPhone Screenshots (Required)
- [ ] 6.9" Display (iPhone 16 Pro Max): 1320 x 2868 px - **Minimum 3 screenshots**
- [ ] 6.7" Display (iPhone 14 Pro Max): 1290 x 2796 px - **Minimum 3 screenshots**
- [ ] 5.5" Display (iPhone 8 Plus): 1242 x 2208 px - **Minimum 3 screenshots**

### iPad Screenshots (If supporting iPad)
- [ ] 12.9" iPad Pro: 2048 x 2732 px - **Minimum 3 screenshots**

### Screenshot Content Ideas for RideLens:
1. **Dashboard** - Show ride statistics and progress overview
2. **Import Feature** - Demonstrate screenshot upload functionality
3. **Trends Chart** - Display data visualization with charts
4. **Comparison View** - Show between-report comparison (your key feature!)
5. **History** - List of past rides/reports

**Capture screenshots:**
```bash
# Open simulator
open -a Simulator

# Use: Device → Screenshot (Cmd + S)
# Or use Xcode screenshot tool
```

---

## 5. App Store Content

### Description (Prepared)
- [ ] Full app description written (max 4000 characters)
- [ ] Highlights key feature: between-report comparisons
- [ ] Clearly states: user-controlled data
- [ ] Mentions: not affiliated with Zwift
- [ ] Professional and clear

### Keywords (Prepared)
- [ ] Keywords researched (max 100 characters)
- [ ] Suggested: `cycling,ride,data,tracking,fitness,training,progress,zwift,analytics,dashboard`

### What's New (Version 1.0)
- [ ] Release notes written
- [ ] Features highlighted
- [ ] Benefits clear to users

### URLs
- [ ] **Support URL:** Working and accessible
- [ ] **Marketing URL:** (optional) Working if provided
- [ ] **Privacy Policy URL:** Created and hosted publicly

---

## 6. Privacy Policy

Required for App Store submission. Must include:

- [ ] What data is collected (user account, ride data, screenshots)
- [ ] How data is used (app functionality, user's own viewing)
- [ ] How data is stored (Supabase, secure)
- [ ] Is data shared with third parties (NO)
- [ ] User rights (delete data, export data)
- [ ] Contact information

**Example template:** See `PRIVACY_POLICY_TEMPLATE.md` (to be created)

**Where to host:**
- GitHub Pages
- Your own website
- Simple hosting service

---

## 7. App Permissions & Info.plist

Based on RideLens features, you'll need:

### Photo Library Access (Required for Screenshot Import)
- [ ] `NSPhotoLibraryUsageDescription` added to Info.plist
- [ ] Description clear and user-friendly: "Import ride screenshots from your photo library"

### Camera Access (If you allow capturing screenshots in-app)
- [ ] `NSCameraUsageDescription` added to Info.plist
- [ ] Description: "Capture ride screenshots directly in the app"

**Add to `ios/App/App/Info.plist`:**
```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>Import ride screenshots from your photo library</string>

<key>NSCameraUsageDescription</key>
<string>Capture ride screenshots directly</string>
```

---

## 8. Signing & Provisioning

- [ ] Automatic signing enabled in Xcode
- [ ] Team selected correctly
- [ ] Provisioning profile generated (automatic)
- [ ] Valid signing certificate present
- [ ] No signing errors in Xcode

---

## 9. Build Configuration

### In Xcode:
- [ ] Scheme set to "Release" for archiving
- [ ] Deployment target set (iOS 14.0+ recommended)
- [ ] Architectures: arm64 (for device)
- [ ] Build settings reviewed (no warnings)

### Build Settings to Check:
- [ ] **Code Signing Identity:** Apple Distribution
- [ ] **Enable Bitcode:** No (deprecated by Apple)
- [ ] **Strip Debug Symbols During Copy:** Yes (for Release)

---

## 10. Testing & Quality Assurance

### Device Testing
- [ ] Tested on real iPhone device (not just simulator)
- [ ] Tested on iPhone (small screen)
- [ ] Tested on iPhone Pro Max (large screen)
- [ ] Tested on iPad (if supporting tablets)

### Functionality Testing
- [ ] App launches without crashes
- [ ] All navigation works correctly
- [ ] Screenshot import works
- [ ] Data extraction functioning
- [ ] Dashboard displays correctly
- [ ] Charts render properly
- [ ] Settings accessible
- [ ] Login/authentication works (if applicable)
- [ ] Data persistence works
- [ ] Offline functionality (if applicable)

### Performance Testing
- [ ] No memory leaks
- [ ] Smooth animations (60 fps)
- [ ] Fast app launch time (< 3 seconds)
- [ ] No excessive battery drain
- [ ] Network requests don't hang

### Edge Cases
- [ ] No internet connection handled gracefully
- [ ] Empty states display correctly (no data yet)
- [ ] Error messages clear and helpful
- [ ] Loading states shown appropriately

---

## 11. Backend & API Configuration

Since RideLens uses Supabase:

- [ ] Supabase project configured and active
- [ ] API keys correctly set in environment variables
- [ ] Database tables created and accessible
- [ ] Row-level security (RLS) policies configured
- [ ] Authentication working correctly
- [ ] API endpoints respond correctly
- [ ] CORS configured for mobile app

**Check API connection:**
```bash
# Test API endpoint
curl https://your-supabase-project.supabase.co/rest/v1/your-table
```

---

## 12. Legal & Compliance

- [ ] App complies with App Store Review Guidelines
- [ ] No use of private APIs
- [ ] No misleading claims or content
- [ ] Terms of Service created (if needed)
- [ ] Age rating appropriate (likely 4+)
- [ ] GDPR compliant (if targeting EU)

### Trademark Considerations
- [ ] "Zwift" mentioned as reference only (not in app name)
- [ ] Disclaimer included: "Not affiliated with or endorsed by Zwift"
- [ ] No use of Zwift logos or copyrighted assets

---

## 13. App Store Connect Setup

### App Creation
- [ ] App created in App Store Connect
- [ ] Correct Bundle ID selected
- [ ] SKU assigned (unique identifier)
- [ ] Primary language set

### Version Information
- [ ] Version 1.0 created
- [ ] All required fields completed
- [ ] Screenshots uploaded for all required sizes
- [ ] App icon uploaded (1024x1024)
- [ ] Description and keywords entered

### App Privacy Questionnaire
- [ ] Data collection questions answered
- [ ] Data types listed correctly
- [ ] Usage purposes specified
- [ ] Privacy nutrition label configured

### Pricing & Availability
- [ ] Price tier selected (Free or Paid)
- [ ] Territories selected
- [ ] Available date set

---

## 14. Build Upload

- [ ] Archive created successfully in Xcode
- [ ] No warnings during archive
- [ ] Build validated before upload
- [ ] Build uploaded to App Store Connect
- [ ] Build appears in App Store Connect (wait ~20 mins)
- [ ] Build selected for version 1.0

---

## 15. Pre-Submission Review

### App Store Review Information
- [ ] Demo account credentials provided (if app requires login)
- [ ] Notes for reviewer added (if needed)
- [ ] Contact information correct

### Content Rights
- [ ] Confirm you have rights to all content
- [ ] Third-party content properly attributed
- [ ] Open source licenses included (if applicable)

### Export Compliance
- [ ] Encryption questions answered
- [ ] Typically: "Uses standard HTTPS encryption only" → YES

---

## 16. Final Submission

- [ ] All sections show green checkmarks in App Store Connect
- [ ] Build selected
- [ ] "Submit for Review" button clicked
- [ ] Submission confirmation received

---

## 17. Post-Submission

- [ ] Confirmation email received from Apple
- [ ] App status: "Waiting for Review"
- [ ] Monitoring App Store Connect for updates
- [ ] Prepared to respond to review feedback

### Expected Timeline:
- Review typically takes **1-3 days**
- Could be faster (24 hours) or longer (up to 7 days)

### Possible Statuses:
- **Waiting for Review** → In queue
- **In Review** → Being reviewed
- **Pending Developer Release** → Approved! (you choose when to release)
- **Ready for Sale** → Live on App Store
- **Rejected** → Needs fixes (check Resolution Center)

---

## 18. If Rejected

- [ ] Read rejection reason carefully
- [ ] Check Resolution Center in App Store Connect
- [ ] Fix issues mentioned
- [ ] Increment build number
- [ ] Upload new build
- [ ] Resubmit with resolution notes

Common rejection reasons:
- Crashes on launch
- Incomplete functionality
- Missing privacy policy
- Misleading screenshots
- Use of trademarks without permission

---

## 🎯 Quick Status Check

Run through these before submitting:

```bash
# 1. Verify Capacitor config
cat capacitor.config.ts | grep appId

# 2. Build web app
npm run build

# 3. Sync to iOS
npx cap sync ios

# 4. Check iOS project
npx cap open ios

# In Xcode:
# - Verify Bundle ID
# - Check signing status
# - Archive → Validate → Upload
```

---

## ✅ Ready to Submit?

All checkboxes checked? You're ready to submit RideLens to the App Store!

**Estimated timeline:**
- Setup: 2-3 hours
- Testing: 1-2 hours
- Asset preparation: 2-3 hours
- Submission: 30 minutes
- Review wait: 1-3 days

**Total: ~1 week from start to live**

---

## 📞 Support Resources

- **Apple Developer Forums:** https://developer.apple.com/forums/
- **App Store Review Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Capacitor Discord:** https://discord.gg/UPYsMjQjsy
- **Supabase Discord:** https://discord.supabase.com/

---

**Good luck with your RideLens launch! 🚀🚴‍♂️**

*Last updated: January 2025*
