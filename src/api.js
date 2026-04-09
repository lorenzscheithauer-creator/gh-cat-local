export { API_BASE, MEDIA_BASE } from './config/env';
export { formatEuro, formatNumber } from './lib/formatters';
export { formatDate, isExpired } from './lib/dates';
export { getImageUrl, getItemImageSource } from './lib/media';
export { normalizeItem, normalizeItems } from './lib/normalizers';

export {
  fetchHome,
  fetchStats,
  fetchTop10,
  fetchTop3,
  fetchNewest,
  fetchSearch,
  fetchItem,
  fetchVeranstalter,
  fetchVeranstalterItems,
  fetchKategorieItems,
} from './services/gewinnspielService';

export function getTitle(item = {}) {
  return item?.titel || item?.clickbait || item?.title || '';
}

export function getVeranstalter(item = {}) {
  return item?.veranstalter || item?.anbieter || item?.partner || '';
}

export function getGesamtwert(item = {}) {
  return Number(item?.gesamtwert || item?.wert || item?.value || 0);
}

export function getEndDatum(item = {}) {
  return item?.enddatum || item?.ablaufdatum || '';
}

export function getKategorie(item = {}) {
  return item?.kategorie || item?.category || '';
}

export function getKategorieParts(item = {}) {
  return String(getKategorie(item))
    .split(/[;,|/]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

export function getPrimaryKategorie(item = {}) {
  return getKategorieParts(item)[0] || getKategorie(item) || '';
}

export function getCategoryLabel(category = '') {
  return String(category || '').trim() || 'Allgemein';
}

export function getTeilnahmeUrl(item = {}) {
  return (
    item?.teilnahme_url ||
    item?.teilnahmeUrl ||
    item?.url ||
    item?.link ||
    item?.gewinnspiel_link ||
    ''
  );
}

export function getTeilnahmeText(item = {}) {
  return (
    item?.teilnahme_text ||
    item?.teilnahmeText ||
    item?.cta ||
    'Jetzt teilnehmen'
  );
}

export function getKurzbeschreibung(item = {}) {
  return item?.kurzbeschreibung || item?.summary || item?.zusammenfassung || '';
}

export function getBeschreibung(item = {}) {
  return (
    item?.beschreibung ||
    item?.details ||
    item?.zusammenfassung ||
    item?.kurzbeschreibung ||
    ''
  );
}

export function getPrizeCount(item = {}) {
  return Number(item?.anzahl_gewinne || item?.prize_count || 0);
}
