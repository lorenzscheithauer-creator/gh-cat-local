import { getJson } from './apiClient';
import { normalizeItem, normalizeItems } from '../lib/normalizers';

export async function fetchHome() {
  const data = await getJson('home.php');

  return {
    stats: {
      total_value: Number(data?.stats?.total_value || 0),
      active_count: Number(data?.stats?.active_count || 0),
      prize_count: Number(data?.stats?.prize_count || 0),
    },
    top3: {
      items: normalizeItems(data?.top3?.items || []),
    },
    newest: {
      items: normalizeItems(data?.newest?.items || []),
    },
    ending_soon: {
      items: normalizeItems(data?.ending_soon?.items || []),
    },
    raw: data,
  };
}

export async function fetchStats(cat) {
  const data = await getJson('stats.php', cat ? { cat } : undefined);

  return {
    total_value: Number(data?.total_value || 0),
    active_count: Number(data?.active_count || 0),
    prize_count: Number(data?.prize_count || 0),
    raw: data,
  };
}

export async function fetchTop10() {
  const data = await getJson('top10.php');
  return {
    items: normalizeItems(data?.items || []),
    raw: data,
  };
}

export async function fetchTop3() {
  const data = await getJson('top3.php');
  return {
    items: normalizeItems(data?.items || []),
    raw: data,
  };
}

export async function fetchNewest(limit = 10) {
  const data = await getJson('newest.php', { limit });
  return {
    items: normalizeItems(data?.items || []),
    raw: data,
  };
}

export async function fetchSearch(params = {}) {
  const q = String(params?.q ?? '').trim();
  const page = Number(params?.page || 1);
  const perPage = Number(params?.per_page || params?.perPage || 10);

  if (!q) {
    const data = await getJson('list.php', {
      cat: params?.cat || 'alle',
      page,
      per_page: perPage,
    });

    return {
      q: '',
      page: Number(data?.page || page),
      per_page: Number(data?.per_page || perPage),
      total: Number(data?.total || 0),
      items: normalizeItems(data?.items || []),
      raw: data,
    };
  }

  const data = await getJson('search.php', {
    ...params,
    q,
    page,
    per_page: perPage,
  });

  return {
    q: data?.q || q,
    page: Number(data?.page || page),
    per_page: Number(data?.per_page || perPage),
    total: Number(data?.total || 0),
    items: normalizeItems(data?.items || []),
    raw: data,
  };
}

export async function fetchItem(id) {
  const data = await getJson('item.php', { id });
  return normalizeItem(data?.item || {});
}

export async function fetchVeranstalter(nameOrNothing, page = 1, perPage = 10) {
  if (typeof nameOrNothing === 'string' && nameOrNothing.trim()) {
    return fetchVeranstalterItems(nameOrNothing.trim(), page, perPage);
  }

  const data = await getJson('veranstalter.php');
  return {
    total: Number(data?.total || 0),
    items: Array.isArray(data?.items) ? data.items : [],
    raw: data,
  };
}

export async function fetchVeranstalterItems(name, page = 1, perPage = 50) {
  const trimmed = String(name || '').trim();

  let data = await getJson('veranstalter.php', {
    veranstalter: trimmed,
    page,
    per_page: perPage,
  });

  let items = normalizeItems(data?.items || []);

  if ((!items || items.length === 0) && trimmed) {
    const fallback = await getJson('search.php', {
      q: trimmed,
      page: 1,
      per_page: perPage,
    });

    const fallbackItems = normalizeItems(fallback?.items || []).filter(
      (item) => String(item?.veranstalter || '').trim().toLowerCase() === trimmed.toLowerCase()
    );

    data = {
      veranstalter: trimmed,
      page: 1,
      per_page: perPage,
      total: fallbackItems.length,
      items: fallbackItems.map((x) => x.raw || x),
    };
    items = fallbackItems;
  }

  const activeItems = items.filter((item) => item?.active === true || item?.raw?.active === true || item?.raw?.active === 1 || item?.raw?.active === '1');
  const inactiveItems = items.filter((item) => !(item?.active === true || item?.raw?.active === true || item?.raw?.active === 1 || item?.raw?.active === '1'));

  return {
    veranstalter: trimmed,
    page: Number(data?.page || page),
    per_page: Number(data?.per_page || perPage),
    total: Number(data?.total || items.length),
    featured: activeItems[0] || items[0] || null,
    active: { items: activeItems },
    inactive: { items: inactiveItems },
    items,
    raw: data,
  };
}

export async function fetchKategorieItems(slug, page = 1, perPage = 10) {
  const data = await getJson('list.php', {
    cat: slug || 'alle',
    page,
    per_page: perPage,
  });

  const allItems = normalizeItems(data?.items || []);
  const activeItems = allItems.filter((item) => item?.raw?.active === true || item?.raw?.active === 1 || item?.raw?.active === '1');
  const inactiveItems = allItems.filter((item) => !(item?.raw?.active === true || item?.raw?.active === 1 || item?.raw?.active === '1'));

  return {
    page: Number(data?.page || page),
    per_page: Number(data?.per_page || perPage),
    total: Number(data?.total || allItems.length),
    featured: activeItems[0] || allItems[0] || null,
    active: {
      items: activeItems,
    },
    inactive: {
      items: inactiveItems,
    },
    raw: data,
  };
}
