import { API_BASE } from '../config/env';

function buildUrl(path, params) {
  const cleanPath = String(path || '').replace(/^\/+/, '');
  const url = new URL(`${API_BASE}/${cleanPath}`);

  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
}

export async function getJson(path, params) {
  const res = await fetch(buildUrl(path, params), {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} bei ${path}`);
  }

  return res.json();
}
