# GewinnHai App – Expo Test + DB-only Betrieb

Diese Version ist als Datenquelle vollständig von der Website entkoppelt.

## Umgesetzt

- keine feste Fallback-API-Domain mehr im App-Code
- kein `go.php`-Redirect mehr in der App
- Teilnahme erfolgt direkt über den externen Link aus der Datenbank
- Support-Mail ist optional und standardmäßig neutral
- Bilder können weiter benutzt werden, auch wenn die Daten direkt aus der DB kommen
- relative Bildpfade können über `EXPO_PUBLIC_MEDIA_BASE` auf deinen Bild-Host zeigen

## Wichtig für die Datenbank

Deine API sollte pro Gewinnspiel mindestens diese Felder liefern:

- `id`
- `clickbait` oder `titel`
- `veranstalter`
- `gesamtwert`
- `anzahl_gewinne`
- `enddatum`
- `teilnahme_url` oder `extern_url` oder `gewinnspiel_url`
- `bild_url` oder `image_url` oder `thumbnail`

## Expo-Test lokal

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. `.env` anlegen

Kopiere `.env.example` nach `.env` und trage deine URLs ein:

```bash
EXPO_PUBLIC_API_BASE=https://www.gewinnhai.de/api
EXPO_PUBLIC_MEDIA_BASE=https://www.gewinnhai.de
EXPO_PUBLIC_SUPPORT_EMAIL=support@gewinnhai.de
```

### 3. App starten

```bash
npx expo start
```

Dann in Expo Go testen:

- Expo Go auf dem Handy installieren
- Handy und Rechner ins gleiche WLAN
- im Terminal den QR-Code mit Expo Go scannen

## Was `EXPO_PUBLIC_MEDIA_BASE` macht

Wenn deine DB bereits komplette Bild-URLs liefert, brauchst du `EXPO_PUBLIC_MEDIA_BASE` nicht.

Wenn in der DB nur relative Pfade stehen, z. B.:

```text
assets/thumbs/bild123.webp
```

wird daraus automatisch:

```text
https://media.deinedomain.de/assets/thumbs/bild123.webp
```

## Deploy für Android mit EAS

### EAS installieren

```bash
npm install -g eas-cli
```

### Login

```bash
eas login
```

### Projekt initialisieren

```bash
eas init
```

Danach die erzeugte `projectId` in `app.json` eintragen.

### Testbuild

```bash
eas build --platform android --profile preview
```

### Store-Build

```bash
eas build --platform android --profile production
```

## Typischer Produktivaufbau

- API auf eigener Domain oder Subdomain, z. B. `api.deinedomain.de`
- Bilder auf eigener Media-Domain oder gleichem Server, z. B. `media.deinedomain.de`
- App greift nur auf API + Bilder zu, nicht auf Webseitenlogik

## Vor echtem Release noch erledigen

- echtes Impressum einsetzen
- echte Datenschutzerklärung einsetzen
- eigenes API-Hosting final setzen
- prüfen, dass in der DB immer ein externer Teilnahme-Link vorhanden ist
