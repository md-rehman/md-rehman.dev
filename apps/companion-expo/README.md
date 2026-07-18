# Companion Expo App

This is a companion mobile application built with [Expo](https://expo.dev/) and React Native.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/) (LTS recommended)
- [Yarn](https://yarnpkg.com/) or npm
- An [Expo account](https://expo.dev/) for cloud builds

### 1. Install Dependencies
```bash
yarn install
```

### 2. Environment Variables Setup
This project uses Supabase. To run the app successfully, you must configure your environment variables.

Create a `.env.local` or `.env` file in the root of this app (`apps/companion-expo`):
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### 3. Start Development Server
```bash
yarn start
```
From here, you can press:
- `a` to open on an Android Emulator
- `i` to open on an iOS Simulator
- `w` to open in a web browser

---

## 🏗️ Cloud Builds with EAS (Expo Application Services)

We use EAS to build the standalone iOS and Android applications.

### ⚠️ IMPORTANT: EAS Environment Variables
EAS does **not** read your local `.env` files. If you do not configure your environment variables in EAS, the app will crash on launch because Supabase cannot initialize.

**You must do ONE of the following before running an EAS build:**
1. **Option A (Recommended):** Add `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as Secrets in your [Expo Dashboard](https://expo.dev) under your project settings.
2. **Option B:** Add an `env` block to your `eas.json` profiles with the required keys.

### 🛠️ Build Commands

Ensure you have the EAS CLI installed globally:
```bash
npm install -g eas-cli
```

#### Android Builds
To build a preview APK for Android:
```bash
npx eas-cli build --platform android --profile preview
```
To build a production AAB for the Google Play Store:
```bash
npx eas-cli build --platform android --profile production
```

#### iOS Builds
To build a preview app for iOS (requires Apple Developer Account):
```bash
npx eas-cli build --platform ios --profile preview
```
To build a production IPA for the App Store:
```bash
npx eas-cli build --platform ios --profile production
```

#### Local Release Build Testing
To test a release build locally on a simulator (bypassing EAS cloud):
```bash
npx expo run:ios --configuration Release
# or
npx expo run:android --variant release
```

---

## 📚 Learn More
- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Supabase React Native Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo)
