import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Linking, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  fetchItem,
  getTitle,
  getVeranstalter,
  getGesamtwert,
  getEndDatum,
  getTeilnahmeUrl,
  formatEuro,
  getKategorieParts,
  getPrimaryKategorie,
} from '../api';
import { getCategoryImageBySlug, getCategoryLabel } from '../categoryData';

function splitGewinne(value) {
  if (!value) return [];
  return String(value)
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseDateSafe(value) {
  if (!value) return null;
  const s = String(value).trim();
  if (!s) return null;
  const d = new Date(s.length === 10 ? `${s}T23:59:59` : s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function getCountdownLabel(enddatum) {
  const end = parseDateSafe(enddatum);
  if (!end) return null;
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 'Abgelaufen';

  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days > 0) return `${days} Tage ${hours} Std`;
  return `${hours} Std`;
}

export default function DetailScreen({ route, navigation }) {
  const passedItem = route?.params?.item || null;
  const id = route?.params?.id;
  const preferredCategory = route?.params?.preferredCategory || null;

  const [item, setItem] = useState(passedItem);

  useEffect(() => {
    let alive = true;

    if (passedItem) setItem(passedItem);

    if (id) {
      fetchItem(id)
        .then((data) => {
          if (!alive || !data) return;
          setItem((prev) => ({ ...(prev || {}), ...data }));
        })
        .catch((err) => console.warn('Detail load error:', err));
    }

    return () => {
      alive = false;
    };
  }, [id]);

  if (!item) {
    return (
      <View style={styles.screen}>
        <View style={styles.loadingWrap}>
          <Text style={styles.loadingText}>Lade Gewinnspiel…</Text>
        </View>
      </View>
    );
  }

  const title = getTitle(item);
  const veranstalter = getVeranstalter(item);
  const wert = getGesamtwert(item);
  const ende = getEndDatum(item);
  const countdown = getCountdownLabel(ende);

  const categories = getKategorieParts(item);
  const displayCategory = preferredCategory || getPrimaryKategorie(item);
  const displayCategoryLabel = getCategoryLabel(displayCategory);

  const chips = useMemo(() => {
    const all = categories.length ? categories : ['alle'];
    const normalized = [];
    const seen = new Set();
    for (const c of [displayCategory, ...all]) {
      const key = String(c || '').trim();
      if (!key) continue;
      if (seen.has(key)) continue;
      seen.add(key);
      normalized.push(key);
    }
    return normalized;
  }, [item, preferredCategory]);

  const teilnahmeUrl = getTeilnahmeUrl(item);
  const imageSource = getCategoryImageBySlug(displayCategory);
  const gewinneListe = splitGewinne(item?.gewinne);

  const openVeranstalter = () => {
    if (!veranstalter) return;
    navigation.navigate('VeranstalterDetail', { name: veranstalter });
  };

  const openKategorie = (slug) => {
    navigation.navigate('KategorieDetail', {
      slug,
      title: getCategoryLabel(slug),
    });
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <View style={styles.heroTextWrap}>
            <Text style={styles.title}>{title}</Text>

            {veranstalter ? (
              <Pressable onPress={openVeranstalter} style={({ pressed }) => [styles.linkRow, pressed && styles.linkPressed]}>
                <Text style={styles.subtitleLink}>{veranstalter}</Text>
                <MaterialCommunityIcons name="chevron-right" size={18} color="#9fdfff" />
              </Pressable>
            ) : null}

            <View style={styles.chipWrap}>
              {chips.slice(0, 5).map((cat, idx) => {
                const isPrimary = idx === 0;
                return (
                  <Pressable
                    key={`${cat}-${idx}`}
                    onPress={() => openKategorie(cat)}
                    style={({ pressed }) => [
                      isPrimary ? styles.primaryChip : styles.subChip,
                      pressed && styles.linkPressed,
                    ]}
                  >
                    <Text style={isPrimary ? styles.primaryChipText : styles.subChipText}>
                      {getCategoryLabel(cat)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.heroImageCard}>
            {countdown ? (
              <View style={styles.countdownBadge}>
                <MaterialCommunityIcons name="timer-outline" size={14} color="#fff" />
                <Text style={styles.countdownText}>{countdown}</Text>
              </View>
            ) : null}

            <Image source={imageSource} style={styles.heroImage} resizeMode="contain" />
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={[styles.infoCard, styles.infoHalf]}>
            <Text style={styles.infoLabel}>Kategorie</Text>
            <Text style={styles.infoValue}>{displayCategoryLabel}</Text>
          </View>

          <View style={[styles.infoCard, styles.infoHalf]}>
            <Text style={styles.infoLabel}>Gesamtwert</Text>
            <Text style={styles.infoValue}>{formatEuro(wert)}</Text>
          </View>
        </View>

        <View style={styles.infoCardWide}>
          <Text style={styles.infoLabel}>Enddatum</Text>
          <Text style={styles.infoValue}>{ende || 'Nicht angegeben'}</Text>
        </View>

        {gewinneListe.length > 0 ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Gewinne</Text>
            {gewinneListe.map((entry, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{entry}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {item?.loesung ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Lösung / Teilnahmehinweis</Text>
            <Text style={styles.cardText}>{item.loesung}</Text>
          </View>
        ) : null}

        {item?.zusammenfassung ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Zusammenfassung</Text>
            <Text style={styles.cardText}>{item.zusammenfassung}</Text>
          </View>
        ) : null}

        {teilnahmeUrl ? (
          <Pressable style={styles.cta} onPress={() => Linking.openURL(teilnahmeUrl)}>
            <MaterialCommunityIcons name="open-in-new" size={18} color="#fff" />
            <Text style={styles.ctaText}>Zur Teilnahme</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#031733' },
  container: { padding: 16, paddingBottom: 40 },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#fff', fontSize: 16 },

  hero: {
    backgroundColor: 'rgba(18,34,64,0.96)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    marginBottom: 16,
  },
  heroTextWrap: {
    marginBottom: 14,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 36,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  subtitleLink: {
    color: '#9fdfff',
    fontSize: 16,
    fontWeight: '700',
  },
  linkPressed: {
    opacity: 0.8,
  },

  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  primaryChip: {
    backgroundColor: 'rgba(33,200,246,0.18)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  primaryChipText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
  },
  subChip: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  subChipText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },

  heroImageCard: {
    height: 230,
    borderRadius: 24,
    backgroundColor: 'rgba(8,20,48,0.96)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  countdownBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(124,92,255,0.92)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  countdownText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
    marginLeft: 6,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: 'rgba(18, 34, 64, 0.92)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 14,
  },
  infoHalf: {
    width: '48.5%',
  },
  infoCardWide: {
    backgroundColor: 'rgba(18, 34, 64, 0.92)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 14,
    marginBottom: 10,
  },
  infoLabel: {
    color: 'rgba(255,255,255,0.58)',
    fontSize: 12,
    marginBottom: 6,
  },
  infoValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },

  card: {
    backgroundColor: 'rgba(18, 34, 64, 0.92)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    marginTop: 10,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 10,
  },
  cardText: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 15,
    lineHeight: 23,
  },

  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingRight: 4,
  },
  bullet: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 24,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    color: 'rgba(255,255,255,0.82)',
    fontSize: 15,
    lineHeight: 23,
  },

  cta: {
    marginTop: 16,
    height: 54,
    borderRadius: 999,
    backgroundColor: '#21c8f6',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
});
