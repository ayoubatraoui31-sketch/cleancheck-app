#!/bin/bash
set -e

echo "🧹 CleanCheck Pro — Build APK Android"
echo "======================================"

if ! command -v java &> /dev/null; then
    echo "❌ Java non trouvé. Installez JDK 17+"
    exit 1
fi

echo "📦 Étape 1/4 : Build Next.js (export statique)..."
npm run build

echo "📱 Étape 2/4 : Synchronisation Capacitor..."
npx cap sync android

echo "⚙️  Étape 3/4 : Vérification configuration Android..."

if [ ! -f "cleancheck.keystore" ]; then
    echo "🔐 Keystore non trouvé. Création..."
    keytool -genkey -v \
        -keystore cleancheck.keystore \
        -alias cleancheck \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000 \
        -dname "CN=CleanCheck, OU=Pro, O=CleanCheck, L=Paris, C=FR" \
        -storepass cleancheck \
        -keypass cleancheck
    echo "✅ Keystore créé"
fi

echo "🔨 Étape 4/4 : Compilation APK..."
cd android
./gradlew assembleRelease

echo ""
echo "✅ BUILD TERMINÉ !"
echo "📁 APK : android/app/build/outputs/apk/release/app-release-unsigned.apk"
