export function normalizeItem(item = {}) {
  return {
    id: item.id ?? item.ID ?? null,
    titel: item.titel ?? item.clickbait ?? item.title ?? '',
    beschreibung: item.beschreibung ?? item.description ?? '',
    kategorie: item.kategorie ?? item.category ?? '',
    veranstalter: item.veranstalter ?? item.anbieter ?? item.provider ?? item.partner ?? '',
    gesamtwert: Number(item.gesamtwert ?? item.wert ?? item.value ?? 0),
    enddatum: item.enddatum ?? item.ablaufdatum ?? item.ended_at ?? null,
    bild: item.bild ?? item.image ?? item.image_url ?? item.bild_url ?? null,
    gewinne: item.gewinne ?? '',
    aktiv: item.aktiv ?? null,
    raw: item,
  };
}

export function normalizeItems(items) {
  if (!Array.isArray(items)) return [];
  return items.map(normalizeItem);
}
