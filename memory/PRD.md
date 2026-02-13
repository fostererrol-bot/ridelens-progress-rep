# RideLens — Ride Data Insight

## Original Problem Statement
Deploy the RideLens application (React + Vite project) as a web app. Source code hosted at: `https://github.com/fostererrol-bot/ridelens-progress-rep`

## Product Overview
RideLens transforms ride screenshots into structured data with features including:
- Report comparisons
- User-controlled data uploads
- Dashboards

## Tech Stack
- **Frontend:** React + Vite + TypeScript + Expo (for PWA/web)
- **Backend:** Supabase (external)
- **Deployment:** Emergent (Kubernetes) with EAS update step
- **Package Manager:** Yarn (enforced)

## What's Been Implemented

### Session - Feb 2025
| Date | Task | Status |
|------|------|--------|
| Feb 13 | Pre-installed `expo-updates@~29.0.16` to prevent EAS auto-install (commit `7baf120`) | ✅ Done |
| Feb 13 | Created `.npmrc` with `package-manager=yarn` to force yarn | ✅ Done |
| Feb 13 | Pushed `yarn.lock` to force yarn in EAS builds (commit `b76ae8b`) | ✅ Done |
| Earlier | Added `packageManager: "yarn@1.22.22"` to package.json | ✅ Done |
| Earlier | Deleted `bun.lockb` and added to `.gitignore` | ✅ Done |

## Current Issues

### P0 - Deployment (IN PROGRESS - Awaiting User Verification)
- **Issue:** `spawn bun ENOENT` error during EAS update step when installing expo-updates
- **Root Cause:** Expo CLI defaulted to `bun` when auto-installing expo-updates
- **Fix Applied:** 
  1. Pre-installed expo-updates in dependencies
  2. Added .npmrc to force yarn
  3. Updated yarn.lock
- **Status:** Awaiting user to trigger new deployment with commit `7baf120`

### P1 - Preview URL (NOT STARTED)
- **Issue:** `ERR_NGROK_3200` error on preview URL
- **Cause:** Vite dev server not exposed to public internet
- **Status:** Will address after deployment is confirmed working

## Prioritized Backlog

### P0 (Critical)
- [ ] Verify deployment succeeds with new fixes (commit `7baf120`)

### P1 (High)
- [ ] Fix preview URL if still needed after successful deployment

### P2 (Medium)
- [ ] Code cleanup and optimization

### P3 (Future)
- [ ] Apple App Store publishing

## Repository
- GitHub: `https://github.com/fostererrol-bot/ridelens-progress-rep`
- Branch: `main`
- Latest Commit: `7baf120` (Fix: Pre-install expo-updates and add .npmrc)

## Files Modified for Deployment Fix
- `package.json` - Added expo-updates dependency
- `.npmrc` - Created with `package-manager=yarn`
- `yarn.lock` - Updated with new dependency
- `.gitignore` - Contains `bun.lockb`

## 3rd Party Integrations
- **Supabase:** Backend and authentication
- **GitHub:** Source control for deployments
- **EAS:** Build and deployment pipeline (Expo Application Services)

## Critical Notes for Future Sessions
- This is a **Vite web app with Expo** for PWA capabilities, NOT a native mobile app
- Always ensure `yarn.lock` is present and `package-lock.json`/`bun.lockb` are removed
- The user has repeatedly provided old logs - always verify log timestamps match recent commits
