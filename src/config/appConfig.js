export const APP_NAME = 'GewinnHai';
export const APP_SCHEME = 'gewinnhai';

const rawApiBase = (process.env.EXPO_PUBLIC_API_BASE || 'https://www.gewinnhai.de/api').trim();
export const API_BASE = rawApiBase.replace(/\/$/, '');
export const API_BASE_CONFIGURED = API_BASE.length > 0;

export const SUPPORT = {
  email: (process.env.EXPO_PUBLIC_SUPPORT_EMAIL || 'support@gewinnhai.de').trim(),
};

export const MEDIA = {
  base: (process.env.EXPO_PUBLIC_MEDIA_BASE || 'https://www.gewinnhai.de').trim().replace(/\/$/, ''),
};

export const LEGAL = {
  about: {
    title: 'Über GewinnHai',
    body: `GewinnHai bündelt laufende Gewinnspiele übersichtlich in einer mobilen Ansicht. So findest du neue Aktionen schneller, filterst nach Kategorien und springst direkt zur Teilnahme.`,
  },
  tips: {
    title: 'Tipps für Gewinnspiele',
    body: `• Teilnahmebedingungen kurz prüfen\n• Fristen im Blick behalten\n• Nur gültige Kontaktdaten verwenden\n• Benachrichtigungen auch im Spam-Ordner prüfen\n• Bei attraktiven Aktionen lieber früh teilnehmen`,
  },
  safety: {
    title: 'Seriöse Gewinnspiele erkennen',
    body: `Verlässliche Gewinnspiele nennen den Veranstalter klar, haben nachvollziehbare Bedingungen und ein eindeutiges Enddatum. Vorsicht ist angebracht, wenn unnötig viele Daten abgefragt werden oder Kosten verschleiert bleiben.`,
  },
  mistakes: {
    title: 'Häufige Fehler vermeiden',
    body: `• Frist verpasst\n• Kontaktdaten falsch eingegeben\n• Teilnahmebedingungen überlesen\n• Gewinnbenachrichtigungen übersehen\n• Ausschlüsse bei Mehrfachteilnahme ignoriert`,
  },
  impressum: {
    title: 'Impressum',
    body: `GewinnHai\nKontakt: ${SUPPORT.email || 'support@gewinnhai.de'}\n\nDie vollständigen Anbieterangaben und rechtlich verbindlichen Informationen werden vom Betreiber von GewinnHai bereitgestellt.`,
  },
  privacy: {
    title: 'Datenschutz',
    body: `GewinnHai verarbeitet nur die Daten, die für App-Nutzung, Suche und Weiterleitung zur Teilnahme nötig sind. Weitere Informationen zu Verantwortlichen, Speicherfristen und Kontaktwegen stellt der Betreiber von GewinnHai bereit.`,
  },
};
