GewinnHai mobile-optimierte Kategorie-Bilder

Diese PNGs sind für mobile Geräte verkleinert und komprimiert,
damit Expo/Android weniger laggt und schneller startet.

Einspielen:
  cd ~/Downloads/gh-cat-local
  unzip -o ~/Downloads/gewinnhai-hq-category-mobile-optimized.zip -d .
  npx expo start --clear --go

Für APK/AAB Build:
  npm install
  npx expo install
  npx eas-cli@latest build --platform android --profile preview
