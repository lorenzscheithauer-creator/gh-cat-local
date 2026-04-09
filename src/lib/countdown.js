function parseDateSafe(value) {
  if (!value) return null;
  const s = String(value).trim();
  if (!s) return null;
  const d = new Date(s.length === 10 ? `${s}T23:59:59` : s);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function getCountdownLabel(enddatum) {
  const end = parseDateSafe(enddatum);
  if (!end) return null;

  const diff = end.getTime() - Date.now();
  if (diff <= 0) return 'Abgelaufen';

  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days > 0) return `${days} T ${hours} Std`;
  return `${hours} Std`;
}
