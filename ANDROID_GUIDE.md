# 📱 Guide d'installation Android — CleanCheck Pro

## Prérequis

- **Node.js 18+**
- **Android Studio** (SDK 33+)
- **JDK 17**
- **Appareil Android** ou émulateur

---

## Étape 1 : Installer

```bash
cd cleancheck-pro
npm install
```

## Étape 2 : Configurer

```bash
cp .env.example .env.local
# Remplir : DATABASE_URL, CLERK_*, SUPABASE_*, CLOUDINARY_*
```

## Étape 3 : Initialiser Capacitor (1ère fois)

```bash
npm run build
npx cap init CleanCheckPro com.cleancheck.pro --web-dir out
npx cap add android
npx cap sync
```

## Étape 4 : Ouvrir Android Studio

```bash
npx cap open android
```

Puis : **File → Sync Project with Gradle Files** → **Run → Run 'app'**

## Étape 5 : Build APK Release

```bash
chmod +x scripts/build-apk.sh
./scripts/build-apk.sh
```

L'APK signé sera dans `android/app/build/outputs/apk/release/`

---

## 🔧 Permissions configurées

| Permission | Usage |
|------------|-------|
| `CAMERA` | 📷 Photos constats |
| `ACCESS_FINE_LOCATION` | 📍 GPS précis |
| `POST_NOTIFICATIONS` | 🔔 Push |
| `READ/WRITE_EXTERNAL_STORAGE` | 💾 Photos |

---

## 🚀 Déploiement rapide

```bash
# Debug sur device
npx cap run android --livereload --external

# Install APK
adb install -r android/app/build/outputs/apk/release/app-release-unsigned.apk
```
