export function formatEuro(value) {
  const num = Number(value || 0);
  try {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    return `${num} €`;
  }
}

export function formatNumber(value) {
  const num = Number(value || 0);
  try {
    return new Intl.NumberFormat('de-DE').format(num);
  } catch {
    return String(num);
  }
}
