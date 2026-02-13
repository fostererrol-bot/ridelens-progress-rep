# 🔧 RideLens iOS Publishing - Troubleshooting Guide

## Common Problems and Solutions

This guide covers the most common issues you'll encounter when publishing RideLens to the App Store.

---

## 🚫 Cannot Build or Sync Issues

### Problem: `npx cap add ios` fails
**Error:** "Capacitor not found" or similar

**Solutions:**
```bash
# 1. Install Capacitor globally
npm install -g @capacitor/cli

# 2. Or use local installation
npx cap --version  # Check if installed

# 3. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

### Problem: `npm run build` fails
**Error:** Various TypeScript or build errors

**Solutions:**
```bash
# 1. Check for syntax errors in your code
npm run lint

# 2. Clear cache and rebuild
rm -rf dist node_modules
npm install
npm run build

# 3. Check Node version
node --version  # Should be 16+ recommended

# 4. Update dependencies (use with caution)
npm update
```

---

### Problem: `npx cap sync ios` fails
**Error:** "Capacitor config not found"

**Solutions:**
1. Verify `capacitor.config.ts` exists in project root
2. Check config format:
```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.esfdesigns.ridelens',
  appName: 'RideLens',
  webDir: 'dist',
  // ...
};

export default config;
```
3. Ensure `dist` folder exists (run `npm run build` first)

---

## 🔐 Signing & Provisioning Issues

### Problem: "No matching provisioning profiles found"
**In Xcode, signing tab shows errors**

**Solutions:**

1. **Check Apple ID login:**
   - Xcode → Settings → Accounts
   - Verify your Apple ID is listed and signed in
   - If not, click "+" and add your Apple Developer account

2. **Enable automatic signing:**
   - Select your target in Xcode
   - Signing & Capabilities tab
   - ✅ Check "Automatically manage signing"
   - Select your Team from dropdown

3. **Clear derived data:**
   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData/*
   ```

4. **Restart Xcode** (seriously, this fixes a lot!)

---

### Problem: "Failed to create provisioning profile"
**Xcode can't generate profile automatically**

**Solutions:**

1. **Check Bundle ID:**
   - Must be unique across ALL apps on App Store
   - Try a different one: `com.yourname.ridelens`
   - Update in both Xcode AND `capacitor.config.ts`

2. **Verify Developer Account:**
   - Go to https://developer.apple.com/account/
   - Check: "Membership" → Active
   - If expired, renew ($99/year)

3. **Manual provisioning (advanced):**
   - Go to https://developer.apple.com/account/resources/profiles/
   - Create provisioning profile manually
   - Download and double-click to install

---

### Problem: "Untrusted Developer" on iPhone
**App installs but won't open**

**Solution:**
On your iPhone:
1. Settings → General → VPN & Device Management
2. Find your developer certificate
3. Tap → Trust "[Your Name]"
4. Confirm

---

## 📱 Device Testing Issues

### Problem: "iPhone is busy: Preparing debugger support"
**Xcode shows iPhone but can't install**

**Solutions:**
1. **Wait** - This is normal the first time (2-5 minutes)
2. **Unlock iPhone** - Must be unlocked and screen on
3. **Trust computer:**
   - On iPhone: "Trust This Computer?" → Trust
   - Enter passcode if prompted
4. **Restart both:**
   - Disconnect iPhone
   - Restart Xcode
   - Restart iPhone
   - Reconnect

---

### Problem: App crashes immediately on device
**Works in simulator but crashes on real iPhone**

**Solutions:**

1. **Check Console for errors:**
   - Xcode → View → Debug Area → Show Debug Area (⌘⇧Y)
   - Look for error messages in console

2. **Common causes:**
   - **API connection issues:** Check Supabase URL and keys
   - **CORS errors:** Ensure Supabase allows mobile app domain
   - **Missing permissions:** Add to Info.plist (see below)
   - **Memory issues:** Check for memory leaks

3. **Add required permissions to Info.plist:**
   ```xml
   <key>NSPhotoLibraryUsageDescription</key>
   <string>Import ride screenshots</string>
   
   <key>NSAppTransportSecurity</key>
   <dict>
       <key>NSAllowsArbitraryLoads</key>
       <false/>
   </dict>
   ```

4. **Check network requests:**
   - Use Charles Proxy or similar to inspect network calls
   - Verify API endpoints are correct for production

---

### Problem: App works but photos can't be selected
**Photo picker doesn't appear**

**Solution:**
Add to `ios/App/App/Info.plist`:
```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>RideLens needs access to import ride screenshots from your photo library</string>
```

Then rebuild and reinstall.

---

## 🏗️ Build & Archive Issues

### Problem: "No such module" errors during build
**Build fails with missing module errors**

**Solutions:**

1. **Install CocoaPods dependencies:**
   ```bash
   cd ios/App
   pod install
   cd ../..
   ```

2. **Clean and rebuild:**
   - Xcode → Product → Clean Build Folder (⌘⇧K)
   - Xcode → Product → Build (⌘B)

3. **Update pods:**
   ```bash
   cd ios/App
   pod update
   cd ../..
   ```

---

### Problem: Archive fails with generic error
**"Archive failed" with no specific reason**

**Solutions:**

1. **Ensure "Any iOS Device" is selected:**
   - Top toolbar in Xcode
   - Should say "Any iOS Device (arm64)"
   - NOT a simulator or specific device

2. **Check scheme:**
   - Product → Scheme → Edit Scheme
   - Run → Build Configuration → Release
   - Archive → Build Configuration → Release

3. **Clean and rebuild:**
   - Product → Clean Build Folder (⌘⇧K)
   - Wait 10 seconds
   - Product → Archive (⌘⇧B)

---

### Problem: "This bundle is invalid"
**Upload to App Store Connect fails**

**Solutions:**

1. **Check Info.plist values:**
   - CFBundleVersion must be numeric: "1" not "1.0"
   - CFBundleShortVersionString can be: "1.0.0"

2. **Verify icon set:**
   - All required icon sizes present
   - 1024x1024 icon has NO transparency
   - No alpha channel

3. **Check Bundle ID:**
   - Matches App Store Connect exactly
   - All lowercase
   - No spaces or special characters

---

## 📤 Upload Issues

### Problem: Upload to App Store Connect fails
**"An error occurred uploading to App Store Connect"**

**Solutions:**

1. **Check internet connection:**
   - Stable, fast connection required
   - VPN can cause issues - try disabling

2. **Try uploading via Xcode Organizer:**
   - Window → Organizer (⌘⇧⌥O)
   - Select archive
   - Distribute App → App Store Connect → Upload
   - Follow prompts

3. **Use Application Loader (alternative):**
   - Export IPA from Xcode
   - Upload via Transporter app (Mac App Store)

4. **Check Apple system status:**
   - https://developer.apple.com/system-status/
   - App Store Connect might be down

---

### Problem: Build uploaded but not appearing
**Build shows in Xcode but not App Store Connect**

**Solutions:**

1. **Wait longer:**
   - Processing can take 20-60 minutes
   - Check your email for processing completion

2. **Check for email from Apple:**
   - Look for errors or warnings
   - Could be invalid binary

3. **Verify in App Store Connect:**
   - My Apps → Your App → TestFlight tab
   - Should appear here first

---

## 🍎 App Store Connect Issues

### Problem: Can't create app in App Store Connect
**Bundle ID not available in dropdown**

**Solutions:**

1. **Register Bundle ID first:**
   - https://developer.apple.com/account/resources/identifiers/
   - Click "+" to register new Bundle Identifier
   - Use: `com.esfdesigns.ridelens`
   - Wait 5 minutes, then try creating app again

2. **Ensure Bundle ID isn't already used:**
   - Search App Store for your Bundle ID
   - If exists, must use different ID

---

### Problem: "App Name Not Available"
**RideLens name already taken**

**Solutions:**

1. **Try variations:**
   - "RideLens - Ride Data"
   - "RideLens Progress"
   - "RideLens Tracker"

2. **Check availability:**
   - Search App Store before deciding
   - Name can be up to 30 characters

---

### Problem: Missing required screenshot sizes
**Can't submit without all screenshot sizes**

**Solutions:**

1. **Use Xcode Simulator:**
   ```bash
   # Open simulator
   open -a Simulator
   
   # Select device:
   # - iPhone 16 Pro Max (6.9")
   # - iPhone 14 Pro Max (6.7")
   # - iPhone 8 Plus (5.5")
   
   # Take screenshot: Device → Screenshot (⌘S)
   ```

2. **Resize existing screenshots:**
   - Use online tool: https://www.appscreenshots.com/
   - Or Figma/Sketch/Photoshop

3. **Generate from templates:**
   - https://screenshots.pro/
   - https://www.appure.io/

---

## 🔒 Privacy & Permissions Issues

### Problem: "Privacy Policy URL Required"
**Can't submit without privacy policy**

**Solutions:**

1. **Use provided template:**
   - See `PRIVACY_POLICY_TEMPLATE.md`
   - Fill in your information

2. **Host on GitHub Pages:**
   ```bash
   # Create gh-pages branch
   git checkout -b gh-pages
   git push origin gh-pages
   
   # Enable in Settings → Pages
   # URL: https://yourusername.github.io/ridelens-privacy
   ```

3. **Alternative hosting:**
   - Netlify (free)
   - Vercel (free)
   - Your own domain

---

### Problem: "Missing usage description"
**App rejected for missing permission descriptions**

**Solution:**
Add to `ios/App/App/Info.plist`:
```xml
<!-- For photo access -->
<key>NSPhotoLibraryUsageDescription</key>
<string>Import ride screenshots from your photo library to track progress</string>

<!-- For camera (if used) -->
<key>NSCameraUsageDescription</key>
<string>Capture ride screenshots directly within the app</string>
```

**Requirements:**
- Must be clear and user-friendly
- Explain WHY you need permission
- Under 10 words if possible
- Must be truthful

---

## ⚠️ App Review Issues

### Problem: App Rejected - "Crashes on Launch"
**Apple reviewer says app crashes**

**Solutions:**

1. **Test on real device first:**
   - Never submit without device testing
   - Test on oldest supported iOS version
   - Test with fresh install (delete and reinstall)

2. **Check for missing credentials:**
   - Provide demo account if login required
   - Include in "Review Notes" section

3. **Verify API endpoints:**
   - Ensure production URLs are correct
   - Test API availability from external network

---

### Problem: App Rejected - "Incomplete App"
**Apple says app doesn't do enough**

**Solutions:**

1. **Add more features:**
   - RideLens should have all features working:
     - Screenshot upload
     - Data extraction
     - Dashboard
     - History
     - Trends

2. **Improve description:**
   - Clearly explain what app does
   - Show value proposition
   - Include screenshots demonstrating features

---

### Problem: App Rejected - "Misleading"
**Apple says app is misleading about Zwift affiliation**

**Solution:**
Add clear disclaimer:
- In app description: "Not affiliated with or endorsed by Zwift"
- On login/landing screen
- In settings → About section
- Cannot use "Zwift" in app name

---

### Problem: App Rejected - "Guideline 4.3 - Spam"
**Apple says app is similar to other apps**

**Solutions:**

1. **Highlight uniqueness:**
   - Between-report comparisons (unique feature!)
   - User-controlled data upload
   - Focus on progress, not just stats

2. **Add unique features:**
   - Something competitors don't have
   - Unique visualization approach
   - Special algorithms

3. **Appeal:**
   - If truly unique, write appeal explaining why
   - Resolution Center in App Store Connect

---

## 🐛 Runtime Issues

### Problem: Supabase connection fails on device
**App can't connect to database**

**Solutions:**

1. **Check Supabase URL:**
   - Must be HTTPS
   - Verify in `capacitor.config.ts` or env variables
   - Test URL in browser

2. **Configure CORS:**
   - Supabase Dashboard → Settings → API
   - Add allowed origins (or use wildcard for testing)

3. **Check API keys:**
   - Anon key vs Service key
   - Should use Anon key in mobile app
   - Verify key is correct and active

---

### Problem: Images not loading
**Screenshots display broken or not at all**

**Solutions:**

1. **Check image format:**
   - PNG, JPG, JPEG supported
   - WebP might not work on older iOS

2. **Verify storage permissions:**
   - Supabase Storage bucket set to public (for user's own images)
   - Or proper RLS policies

3. **Check image URLs:**
   - Must be HTTPS
   - Must be accessible from mobile
   - Test URL in mobile Safari

---

## 🔄 Update Issues

### Problem: Can't submit update
**"Build already exists" error**

**Solution:**
Increment build number:
1. Xcode → Target → General → Identity
2. Build: Change from "1" to "2" (or next number)
3. Archive again

**Note:** You can keep version "1.0.0" and just increment build number.

---

### Problem: Update not showing for users
**New version submitted but users don't see update**

**Solutions:**

1. **Check release status:**
   - App Store Connect → Your App → Version
   - Status should be "Ready for Sale"

2. **Phased release:**
   - Apple may be releasing gradually
   - Can disable: Version → Phased Release → Turn Off

3. **User needs to update manually:**
   - Auto-update can take 1-7 days
   - Users can manually check for updates in App Store

---

## 🆘 Emergency Issues

### Problem: Critical bug in live app
**Users reporting crashes or data loss**

**Immediate actions:**

1. **Fix the bug:**
   - Priority one - stop everything else
   - Test thoroughly on device

2. **Expedited review:**
   - Increment build number
   - Upload fixed version
   - In review notes: "Critical bug fix for [specific issue]"
   - May get faster review (but not guaranteed)

3. **Communicate:**
   - Respond to reviews explaining fix is coming
   - Post on social media if appropriate
   - Email affected users if possible

---

## 📞 Getting Help

If you're still stuck after trying these solutions:

### Apple Resources
- **Developer Forums:** https://developer.apple.com/forums/
  - Post your specific issue
  - Include error messages and screenshots

- **Technical Support:**
  - Available with Apple Developer account
  - Submit support request: https://developer.apple.com/support/

### Community Resources
- **Stack Overflow:** Tag with `ios`, `capacitor`, `app-store-connect`
- **Capacitor Discord:** https://discord.gg/UPYsMjQjsy
- **Reddit:** r/iOSProgramming

### Capacitor Resources
- **Docs:** https://capacitorjs.com/docs/ios
- **GitHub Issues:** https://github.com/ionic-team/capacitor/issues
- **Community Forum:** https://forum.ionicframework.com/

### Supabase Resources
- **Docs:** https://supabase.com/docs
- **Discord:** https://discord.supabase.com/
- **Support:** support@supabase.io

---

## 🔍 Debugging Tips

### Enable Verbose Logging

**In Xcode:**
1. Edit Scheme → Run → Arguments
2. Add environment variable: `OS_ACTIVITY_MODE` = `disable`
3. This makes console logs cleaner

**In your app:**
```javascript
// Add detailed logging
console.log('[RideLens] Component mounted');
console.log('[RideLens] API call started:', endpoint);
console.error('[RideLens] Error occurred:', error);
```

### Check Crash Reports

**In Xcode:**
- Window → Organizer → Crashes
- Download crash reports from device

**In App Store Connect:**
- App Analytics → Crashes
- Available after app is live

### Network Debugging

Use Charles Proxy or Proxyman:
1. Install on Mac
2. Install certificate on iPhone
3. Monitor all network requests
4. Identify failing API calls

---

## ✅ Prevention Checklist

Avoid issues by checking these BEFORE submitting:

- [ ] Tested on real device (not just simulator)
- [ ] Tested on multiple iOS versions (if possible)
- [ ] All API endpoints work from external network
- [ ] All images load correctly
- [ ] No hardcoded localhost URLs
- [ ] Environment variables set correctly
- [ ] Proper error handling for network failures
- [ ] Loading states for all async operations
- [ ] Permissions requested with clear descriptions
- [ ] No crashes during normal use
- [ ] Privacy policy hosted and accessible
- [ ] Terms of service (if applicable)
- [ ] Disclaimer about Zwift affiliation
- [ ] All features work without crashes
- [ ] App works offline (if applicable)
- [ ] Data persists correctly
- [ ] Icons all present and correct
- [ ] Screenshots accurate and high quality
- [ ] Description clear and accurate
- [ ] Demo account credentials provided (if needed)

---

## 📊 Issue Severity Guide

**🔴 Critical - Stop Everything**
- App crashes on launch
- Data loss
- Security vulnerability
- Privacy violation

**🟡 Important - Fix Soon**
- Feature doesn't work
- Poor performance
- UI broken on some devices
- API errors

**🟢 Minor - Fix When Possible**
- Visual glitches
- Small UI inconsistencies
- Nice-to-have features
- Code optimization

---

Remember: Almost every issue has been encountered and solved by someone before. Don't give up - you're closer than you think! 🚀

---

*If you find a solution not listed here, consider contributing to help others!*
