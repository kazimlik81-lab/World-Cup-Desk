# World Cup Desk Android

Native Android WebView shell for the public World Cup Desk website.

## Requirements

- Android Studio with Android SDK Platform 37 installed.
- JDK 17.
- Gradle 9.4.1 or Android Studio's embedded Gradle runner.

The Android Gradle plugin version is pinned in `android/build.gradle.kts`.

## Debug APK

```powershell
.\scripts\build-android.ps1 -Task assembleDebug -SiteUrl https://your-domain.example
```

Output:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## Play Store bundle

Create `android/keystore.properties` from `android/keystore.properties.example`, point `storeFile` to an absolute `.jks` path, then run:

```powershell
.\scripts\build-android.ps1 -Task bundleRelease -SiteUrl https://your-domain.example
```

Output:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

The site URL must be HTTPS for public release. Local HTTP is allowed only for emulator development hosts such as `10.0.2.2`, `localhost`, and `127.0.0.1`.
