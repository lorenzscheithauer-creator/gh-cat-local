import { getJson } from './apiClient';
import { normalizeItem, normalizeItems } from '../lib/normalizers';

export async function fetchSearch(params = {}) {
  const data = await getJson('search.php', params);
  if (Array.isArray(data)) return normalizeItems(data);
  if (Array.isArray(data?.items)) return normalizeItems(data.items);
  return [];
}

export async function fetchItem(id) {
  const data = await getJson('item.php', { id });
  return normalizeItem(data?.item || data);
}

export async function fetchVeranstalter() {
  const data = await getJson('veranstalter.php');
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

export async function fetchVeranstalterItems(name) {
  const data = await getJson('veranstalter_items.php', { veranstalter: name });
  if (Array.isArray(data)) return normalizeItems(data);
  if (Array.isArray(data?.items)) return normalizeItems(data.items);
  return [];
}

export async function fetchKategorieItems(slug) {
  const data = await getJson('kategorie_items.php', { slug });

  return {
    featured: data?.featured ? normalizeItem(data.featured) : null,
    active: {
      items: normalizeItems(data?.active?.items || []),
    },
    inactive: {
      items: normalizeItems(data?.inactive?.items || []),
    },
  };
}

export async function fetchHome() {
  const data = await getJson('home.php');
  return {
    newest: normalizeItems(data?.newest || data?.latest || data?.items || []),
    top: normalizeItems(data?.top || data?.top10 || []),
    featured: normalizeItems(data?.featured || []),
    raw: data,
  };
}

export async function fetchStats() {
  const data = await getJson('list.php');

  return {
    total_value: Number(
      data?.total_value ??
      data?.gesamtwert ??
      data?.stats?.total_value ??
      0
    ),
    active_count: Number(
      data?.active_count ??
      data?.aktiv ??
      data?.stats?.active_count ??
      0
    ),
    ended_count: Number(
      data?.ended_count ??
      data?.abgelaufen ??
      data?.stats?.ended_count ??
      0
    ),
    total_count: Number(
      data?.total_count ??
      data?.gesamt ??
      data?.stats?.total_count ??
      0
    ),
    raw: data,
  };
}


export async function fetchTop10() {
  const data = await getJson('top10.php');
  if (Array.isArray(data)) return normalizeItems(data);
  if (Array.isArray(data?.items)) return normalizeItems(data.items);
  if (Array.isArray(data?.top10)) return normalizeItems(data.top10);
  return [];
}
