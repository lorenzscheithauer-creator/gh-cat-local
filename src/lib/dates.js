export function toDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function isExpired(item) {
  const raw = item?.enddatum || item?.ablaufdatum || item?.ended_at || item?.end_at;
  const d = toDate(raw);
  if (!d) return false;
  return d.getTime() < Date.now();
}

export function formatDate(value) {
  const d = toDate(value);
  if (!d) return '';
  try {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}
