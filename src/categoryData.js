export const CATEGORY_IMAGE_MAP = {
  alle: require('../assets/categories/allehai.png'),
  technik: require('../assets/categories/technikhai.png'),
  computer: require('../assets/categories/computerhai.png'),
  urlaub: require('../assets/categories/urlaubhai.png'),
  reisen: require('../assets/categories/reisehai.png'),
  fernseher: require('../assets/categories/fernsehhai.png'),
  bargeld: require('../assets/categories/bargeldhai.png'),
  fahrrad: require('../assets/categories/fahrradhai.png'),
  haus: require('../assets/categories/haushai.png'),
  kosmetik: require('../assets/categories/kosmetikhai.png'),
  baby: require('../assets/categories/babyhai.png'),
  buecher: require('../assets/categories/buecherhai.png'),
  mercedes: require('../assets/categories/mercedeshai.png'),
  audi: require('../assets/categories/audihai.png'),
  spielzeug: require('../assets/categories/spielzeughai.png'),
  sport: require('../assets/categories/sporthai.png'),
  lebensmittel: require('../assets/categories/lebensmittelhai.png'),
  mode: require('../assets/categories/modehai.png'),
  grill: require('../assets/categories/grillhai.png'),
  wertanlage: require('../assets/categories/wertanlagehai.png'),
  konzert: require('../assets/categories/konzerthai.png'),
  fussball: require('../assets/categories/fussballhai.png'),
  haribo: require('../assets/categories/haribohai.png'),
  konsole: require('../assets/categories/konsolehai.png'),
  lautsprecher: require('../assets/categories/lautsprecherhai.png'),
  saugroboter: require('../assets/categories/saugroboterhai.png'),
  smartphone: require('../assets/categories/smartphonehai.png'),
  tankgutschein: require('../assets/categories/tankgutscheinhai.png'),
  kaffee: require('../assets/categories/kaffeehai.png'),
  kopfhoerer: require('../assets/categories/kopfhoererhai.png'),
  motorrad: require('../assets/categories/motorradhai.png'),
  nintendo_switch: require('../assets/categories/nintendo-switchhai.png'),
  produktpakete: require('../assets/categories/produktpaketehai.png'),
  film: require('../assets/categories/filmhai.png'),
  filme: require('../assets/categories/filmehai.png'),
  auto: require('../assets/categories/autohai.png'),
};

export const CATEGORIES = [
  { slug: 'alle', label: 'Alle', image: CATEGORY_IMAGE_MAP.alle },
  { slug: 'technik', label: 'Technik', image: CATEGORY_IMAGE_MAP.technik },
  { slug: 'computer', label: 'Computer', image: CATEGORY_IMAGE_MAP.computer },
  { slug: 'urlaub', label: 'Urlaub', image: CATEGORY_IMAGE_MAP.urlaub },
  { slug: 'reisen', label: 'Reisen', image: CATEGORY_IMAGE_MAP.reisen },
  { slug: 'fernseher', label: 'Fernseher', image: CATEGORY_IMAGE_MAP.fernseher },
  { slug: 'bargeld', label: 'Bargeld', image: CATEGORY_IMAGE_MAP.bargeld },
  { slug: 'fahrrad', label: 'Fahrrad', image: CATEGORY_IMAGE_MAP.fahrrad },
  { slug: 'haus', label: 'Haus', image: CATEGORY_IMAGE_MAP.haus },
  { slug: 'kosmetik', label: 'Kosmetik', image: CATEGORY_IMAGE_MAP.kosmetik },
  { slug: 'baby', label: 'Baby', image: CATEGORY_IMAGE_MAP.baby },
  { slug: 'buecher', label: 'Bücher', image: CATEGORY_IMAGE_MAP.buecher },
  { slug: 'mercedes', label: 'Mercedes', image: CATEGORY_IMAGE_MAP.mercedes },
  { slug: 'audi', label: 'Audi', image: CATEGORY_IMAGE_MAP.audi },
  { slug: 'spielzeug', label: 'Spielzeug', image: CATEGORY_IMAGE_MAP.spielzeug },
  { slug: 'sport', label: 'Sport', image: CATEGORY_IMAGE_MAP.sport },
  { slug: 'lebensmittel', label: 'Lebensmittel', image: CATEGORY_IMAGE_MAP.lebensmittel },
  { slug: 'mode', label: 'Mode', image: CATEGORY_IMAGE_MAP.mode },
  { slug: 'grill', label: 'Grill', image: CATEGORY_IMAGE_MAP.grill },
  { slug: 'wertanlage', label: 'Wertanlage', image: CATEGORY_IMAGE_MAP.wertanlage },
  { slug: 'konzert', label: 'Konzert', image: CATEGORY_IMAGE_MAP.konzert },
  { slug: 'fussball', label: 'Fußball', image: CATEGORY_IMAGE_MAP.fussball },
  { slug: 'haribo', label: 'Haribo', image: CATEGORY_IMAGE_MAP.haribo },
  { slug: 'konsole', label: 'Konsole', image: CATEGORY_IMAGE_MAP.konsole },
  { slug: 'lautsprecher', label: 'Lautsprecher', image: CATEGORY_IMAGE_MAP.lautsprecher },
  { slug: 'saugroboter', label: 'Saugroboter', image: CATEGORY_IMAGE_MAP.saugroboter },
  { slug: 'smartphone', label: 'Smartphone', image: CATEGORY_IMAGE_MAP.smartphone },
  { slug: 'tankgutschein', label: 'Tankgutschein', image: CATEGORY_IMAGE_MAP.tankgutschein },
  { slug: 'kaffee', label: 'Kaffee', image: CATEGORY_IMAGE_MAP.kaffee },
  { slug: 'kopfhoerer', label: 'Kopfhörer', image: CATEGORY_IMAGE_MAP.kopfhoerer },
  { slug: 'motorrad', label: 'Motorrad', image: CATEGORY_IMAGE_MAP.motorrad },
  { slug: 'nintendo_switch', label: 'Nintendo Switch', image: CATEGORY_IMAGE_MAP.nintendo_switch },
  { slug: 'produktpakete', label: 'Produktpakete', image: CATEGORY_IMAGE_MAP.produktpakete },
  { slug: 'filme', label: 'Filme', image: CATEGORY_IMAGE_MAP.filme },
  { slug: 'auto', label: 'Auto', image: CATEGORY_IMAGE_MAP.auto },
];

const ALIASES = {
  all: 'alle',
  alle: 'alle',
  buch: 'buecher',
  buecher: 'buecher',
  bücher: 'buecher',
  reise: 'reisen',
  reisen: 'reisen',
  gutschein: 'bargeld',
  gutscheine: 'bargeld',
  konzert: 'konzert',
  konzerte: 'konzert',
  fussball: 'fussball',
  fußball: 'fussball',
  fernseher: 'fernseher',
  tankgutscheine: 'tankgutschein',
  tankgutschein: 'tankgutschein',
  motorrad: 'motorrad',
  motorräder: 'motorrad',
  fahrräder: 'fahrrad',
  fahrrad: 'fahrrad',
  produktpaket: 'produktpakete',
  produktpakete: 'produktpakete',
  produkte: 'produktpakete',
  nintendoswitch: 'nintendo_switch',
  'nintendo-switch': 'nintendo_switch',
  smartphone: 'smartphone',
  kopfhörer: 'kopfhoerer',
  kopfhoerer: 'kopfhoerer',
};

export function normalizeCategorySlug(input) {
  const raw = String(input || '')
    .toLowerCase()
    .trim()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  return ALIASES[raw] || raw || 'alle';
}

export function getCategoryImageBySlug(input) {
  const slug = normalizeCategorySlug(input);
  return CATEGORY_IMAGE_MAP[slug] || CATEGORY_IMAGE_MAP.alle;
}

export function getCategoryLabel(input) {
  const slug = normalizeCategorySlug(input);
  const match = CATEGORIES.find((c) => c.slug === slug);
  return match?.label || 'Alle';
}
