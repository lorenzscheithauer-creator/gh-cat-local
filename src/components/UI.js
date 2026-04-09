import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  getTitle,
  getVeranstalter,
  getGesamtwert,
  getEndDatum,
  getKategorie,
  getImageUrl,
  formatEuro,
} from '../api';
import { getCategoryImageBySlug } from '../categoryData';
import { COLORS } from '../constants/design';
import { getCountdownLabel } from '../lib/countdown';


function normalizeParts(value) {
  return String(value || '')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
}

function getCategoryParts(item) {
  const raw = getKategorie(item);
  const parts = normalizeParts(raw);
  if (!parts.length) return ['Alle'];
  return parts;
}

function getPrizeLines(item, max = 3) {
  return normalizeParts(item?.gewinne).slice(0, max);
}

export function Screen({ children, style }) {
  return <View style={[styles.screen, style]}>{children}</View>;
}

export function GlassCard({ children, style }) {
  return <View style={[styles.glassCard, style]}>{children}</View>;
}

export function SectionTitle({ children, subtitle, action }) {
  return (
    <View style={styles.sectionWrap}>
      <View style={styles.sectionRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>{children}</Text>
          {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
        </View>
        {action || null}
      </View>
    </View>
  );
}

export function Loading() {
  return (
    <View style={styles.loadingWrap}>
      <ActivityIndicator size="small" color="#fff" />
      <Text style={styles.loadingText}>Lade Inhalte…</Text>
    </View>
  );
}

export function HeroCard({ eyebrow, title, subtitle, right }) {
  return (
    <View style={styles.hero}>
      <View style={styles.heroGlowA} />
      <View style={styles.heroGlowB} />
      <View style={styles.heroLeft}>
        {eyebrow ? <Text style={styles.heroEyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.heroTitle}>{title}</Text>
        {subtitle ? <Text style={styles.heroSubtitle}>{subtitle}</Text> : null}
      </View>
      {right ? <View style={styles.heroRight}>{right}</View> : null}
    </View>
  );
}

export function CategoryChip({ image, label, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.88} style={styles.categoryCard}>
      <View style={styles.categoryImageWrap}>
        <Image source={image} style={styles.categoryImage} resizeMode="contain" />
      </View>
      <Text style={styles.categoryLabel} numberOfLines={2}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}


export function PageHeader({ eyebrow, title, subtitle, right }) {
  return (
    <View style={styles.pageHeader}>
      <View style={styles.pageHeaderGlowA} />
      <View style={styles.pageHeaderGlowB} />
      <View style={styles.pageHeaderLeft}>
        {eyebrow ? <Text style={styles.pageHeaderEyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.pageHeaderTitle}>{title}</Text>
        {subtitle ? <Text style={styles.pageHeaderSubtitle}>{subtitle}</Text> : null}
      </View>
      {right ? <View style={styles.pageHeaderRight}>{right}</View> : null}
    </View>
  );
}


export function Empty({ message = 'Keine Inhalte vorhanden.', icon = 'information-outline' }) {
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIconWrap}>
        <MaterialCommunityIcons name={icon} size={28} color="#fff" />
      </View>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

export function GewinnspielCard({ item, rank, onPress, countdownLabel }) {
  const title = getTitle(item);
  const veranstalter = getVeranstalter(item);
  const wert = getGesamtwert(item);
  const ende = getEndDatum(item);
  const imageUrl = getImageUrl(item);
  const cats = getCategoryParts(item);
  const mainCat = cats[0] || 'Alle';
  const subCats = cats.slice(1, 4);
  const prizeLines = getPrizeLines(item, 3);
  const countdown = getCountdownLabel(ende);
  const fallback = getCategoryImageBySlug(mainCat);
  const source = imageUrl ? { uri: imageUrl } : fallback;

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}>
      <ImageBackground source={source} style={styles.cardImage} imageStyle={styles.cardImageInner}>
        <View style={styles.cardOverlay} />
        <View style={styles.cardTopRow}>
          {typeof rank === 'number' ? (
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>#{rank + 1}</Text>
            </View>
          ) : <View />}
          {countdown ? (
            <View style={[styles.smallBadge, countdown === 'Abgelaufen' ? styles.smallBadgeMuted : styles.smallBadgeWarn]}>
              <MaterialCommunityIcons name="timer-outline" size={13} color="#fff" />
              <Text style={styles.smallBadgeText}>{countdown}</Text>
            </View>
          ) : null}
        </View>
      </ImageBackground>

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>{title}</Text>
        <Text style={styles.cardMeta} numberOfLines={1}>{veranstalter || 'unbekannt'}</Text>

        <View style={styles.chipWrap}>
          <View style={styles.catChipPrimary}>
            <Text style={styles.catChipPrimaryText}>{mainCat}</Text>
          </View>
          {subCats.map((c, idx) => (
            <View key={`${c}-${idx}`} style={styles.catChip}>
              <Text style={styles.catChipText}>{c}</Text>
            </View>
          ))}
        </View>

        {prizeLines.length > 0 ? (
          <View style={styles.prizeBox}>
            {prizeLines.map((line, idx) => (
              <View key={`${idx}-${line}`} style={styles.prizeRow}>
                <Text style={styles.prizeBullet}>•</Text>
                <Text style={styles.prizeText} numberOfLines={1}>{line}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.cardBottom}>
          <View style={styles.valuePill}>
            <MaterialCommunityIcons name="cash-100" size={15} color="#fff" />
            <Text style={styles.valuePillText}>{formatEuro(wert)}</Text>
          </View>

          {ende ? (
            <View style={styles.datePill}>
              <MaterialCommunityIcons name="calendar-clock-outline" size={15} color="#fff" />
              <Text style={styles.datePillText}>{ende}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({

  pageHeader: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#232f67',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(140,92,255,0.35)',
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 24,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pageHeaderGlowA: {
    position: 'absolute',
    left: -70,
    bottom: -65,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(41,200,255,0.12)',
  },
  pageHeaderGlowB: {
    position: 'absolute',
    right: -55,
    top: -60,
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: 'rgba(140,92,255,0.20)',
  },
  pageHeaderLeft: {
    flex: 1,
    zIndex: 2,
  },
  pageHeaderRight: {
    zIndex: 2,
    marginLeft: 14,
  },
  pageHeaderEyebrow: {
    color: '#29c8ff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  pageHeaderTitle: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
  },
  pageHeaderSubtitle: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    maxWidth: '96%',
  },


  categoryCard: {
    backgroundColor: 'rgba(18,35,73,0.96)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 8,
    paddingVertical: 10,
    alignItems: 'center',
    minHeight: 138,
    justifyContent: 'space-between',
  },
  categoryImageWrap: {
    width: '100%',
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryImage: {
    width: '92%',
    height: '92%',
  },
  categoryLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 16,
    minHeight: 32,
  },

  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  glassCard: {
    backgroundColor: COLORS.card,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  loadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
  },
  loadingText: {
    color: COLORS.muted,
    marginTop: 10,
  },

  sectionWrap: {
    marginTop: 8,
    marginBottom: 12,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 21,
    fontWeight: '900',
  },
  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 14,
    marginTop: 5,
    lineHeight: 21,
  },

  hero: {
    borderRadius: 30,
    padding: 22,
    marginBottom: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(124,92,255,0.35)',
    backgroundColor: 'rgba(24,35,78,0.94)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroGlowA: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 999,
    backgroundColor: 'rgba(124,92,255,0.22)',
    right: -60,
    top: -60,
  },
  heroGlowB: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: 'rgba(33,200,246,0.12)',
    left: -70,
    bottom: -70,
  },
  heroLeft: {
    flex: 1,
    paddingRight: 14,
  },
  heroEyebrow: {
    color: COLORS.primary,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 29,
    fontWeight: '900',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  heroRight: {
    zIndex: 2,
  },

  categoryChip: {
    minHeight: 128,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(18,34,64,0.96)',
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChipImage: {
    width: 72,
    height: 72,
    marginBottom: 8,
  },
  categoryChipLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
  categoryChipSub: {
    color: COLORS.soft,
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },


  emptyWrap: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 24,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(124,92,255,0.18)',
    marginBottom: 12,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  pressed: {
    opacity: 0.96,
    transform: [{ scale: 0.995 }],
  },

  countdownBadge: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 3,
    backgroundColor: '#d99100',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  countdownBadgeText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
  },

  cardImage: {
    height: 210,
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'rgba(8,20,48,0.96)',
  },
  cardImageInner: {
    resizeMode: 'contain',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 23, 51, 0.14)',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rankBadge: {
    backgroundColor: 'rgba(124,92,255,0.92)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  rankText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
  },
  smallBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  smallBadgeWarn: {
    backgroundColor: 'rgba(245,158,11,0.85)',
  },
  smallBadgeMuted: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  smallBadgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
    marginLeft: 6,
  },

  cardBody: {
    padding: 16,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 19,
    lineHeight: 26,
    fontWeight: '900',
  },
  cardMeta: {
    color: COLORS.muted,
    fontSize: 14,
    marginTop: 8,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  catChipPrimary: {
    backgroundColor: 'rgba(33,200,246,0.18)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  catChipPrimaryText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  catChip: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  catChipText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  prizeBox: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 18,
    padding: 12,
  },
  prizeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  prizeBullet: {
    color: '#fff',
    fontSize: 16,
    marginRight: 8,
    lineHeight: 20,
  },
  prizeText: {
    flex: 1,
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  cardBottom: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  valuePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(33,200,246,0.18)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  valuePillText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 13,
    marginLeft: 7,
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(124,92,255,0.18)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  datePillText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 13,
    marginLeft: 7,
  },
});
