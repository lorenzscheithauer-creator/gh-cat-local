import { MEDIA_BASE } from '../config/env';

function withBase(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${MEDIA_BASE}/${String(path).replace(/^\/+/, '')}`;
}

export function getImageUrl(item = {}) {
  const candidates = [
    item.bild_url,
    item.image_url,
    item.image,
    item.bild,
    item.thumbnail,
    item.logo,
  ];

  for (const candidate of candidates) {
    const url = withBase(candidate);
    if (url) return url;
  }

  return null;
}

export function getItemImageSource(item = {}) {
  const url = getImageUrl(item);
  return url ? { uri: url } : null;
}
