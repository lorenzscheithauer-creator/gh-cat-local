import {
  CATEGORIES,
  CATEGORY_IMAGE_MAP,
  normalizeCategorySlug,
  getCategoryImageBySlug,
  getCategoryLabel,
} from './categoryData';

export {
  CATEGORIES,
  CATEGORY_IMAGE_MAP,
  normalizeCategorySlug,
  getCategoryImageBySlug,
  getCategoryLabel,
};

export const COLORS = {
  bg: '#031733',
  bg2: '#071f45',
  card: 'rgba(18, 34, 64, 0.92)',
  card2: 'rgba(25, 35, 78, 0.9)',
  border: 'rgba(255,255,255,0.08)',
  text: '#ffffff',
  muted: 'rgba(255,255,255,0.72)',
  muted2: 'rgba(255,255,255,0.56)',
  primary: '#21c8f6',
  primary2: '#63b3ff',
  secondary: '#7c5cff',
  success: '#34d399',
  danger: '#fb7185',
  white: '#ffffff',
  black: '#000000',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const RADIUS = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 30,
  pill: 999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
};

export const TYPO = {
  h1: { fontSize: 28, fontWeight: '900', color: COLORS.text },
  h2: { fontSize: 22, fontWeight: '900', color: COLORS.text },
  h3: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  body: { fontSize: 15, color: COLORS.muted, lineHeight: 22 },
  small: { fontSize: 12, color: COLORS.muted2 },
};


export function getCategoryBySlug(slug) {
  const list = Array.isArray(CATEGORIES) ? CATEGORIES : [];
  const normalized = String(slug || '').trim().toLowerCase();

  const aliasMap = {
    buch: 'buecher',
    buecher: 'buecher',
    bücher: 'buecher',
    fussball: 'fussball',
    fußball: 'fussball',
    kopfhoerer: 'kopfhoerer',
    kopfhörer: 'kopfhoerer',
    'nintendo switch': 'nintendo_switch',
    nintendo_switch: 'nintendo_switch',
    tankgutschein: 'tankgutschein',
    tankgutscheine: 'tankgutschein',
    alle: 'alle',
    all: 'alle'
  };

  const target = aliasMap[normalized] || normalized;

  return (
    list.find((item) => String(item?.slug || '').toLowerCase() === target) ||
    null
  );
}

