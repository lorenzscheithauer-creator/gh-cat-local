import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { Screen, GewinnspielCard, GlassCard, Loading, SectionTitle, PageHeader } from '../components/UI';
import { fetchKategorieItems, formatEuro, getItemImageSource } from '../api';
import { getCategoryBySlug } from '../theme';

export default function KategorieDetailScreen({ route, navigation }) {
  const slug = route?.params?.slug || 'alle';
  const title = route?.params?.title || 'Kategorie';

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    featured: null,
    active: { items: [] },
    inactive: { items: [] },
  });

  const categoryMeta = getCategoryBySlug(slug);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetchKategorieItems(slug);
        if (mounted) {
          setData(
            res || {
              featured: null,
              active: { items: [] },
              inactive: { items: [] },
            }
          );
        }
      } catch (e) {
        console.warn('KategorieDetail load error:', e);
        if (mounted) {
          setData({
            featured: null,
            active: { items: [] },
            inactive: { items: [] },
          });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const highlight = data?.featured || null;

  const activeItems = useMemo(() => {
    const list = Array.isArray(data?.active?.items) ? data.active.items : [];
    if (!highlight) return list;
    return list.filter((item) => String(item?.id) !== String(highlight?.id));
  }, [data, highlight]);

  const inactiveItems = useMemo(() => {
    const list = Array.isArray(data?.inactive?.items) ? data.inactive.items : [];
    if (!highlight) return list;
    return list.filter((item) => String(item?.id) !== String(highlight?.id));
  }, [data, highlight]);

  const activeTotalValue = useMemo(() => {
    const source = [highlight, ...activeItems].filter(Boolean);
    return source.reduce((sum, item) => sum + Number(item?.gesamtwert || 0), 0);
  }, [highlight, activeItems]);

  const heroImage = getItemImageSource(highlight || { kategorie: slug }) || categoryMeta?.image;
  const activeCount = highlight ? activeItems.length + 1 : activeItems.length;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <PageHeader
          eyebrow="Kategorie"
          title={title}
          subtitle={`${activeCount} aktive Gewinnspiele in dieser Kategorie`}
        />

        <View style={styles.heroImageWrap}>
          {heroImage ? <Image source={heroImage} style={styles.heroImage} resizeMode="contain" /> : null}
        </View>

        <View style={styles.heroStatsRow}>
          <View style={styles.heroStatCardWide}>
            <Text style={styles.heroStatValue}>{formatEuro(activeTotalValue)}</Text>
            <Text style={styles.heroStatLabel}>Gesamtwert aller aktiven Gewinnspiele</Text>
          </View>
        </View>

        {loading ? (
          <Loading />
        ) : (
          <>
            {highlight ? (
              <>
                <SectionTitle>Highlight</SectionTitle>
                <GewinnspielCard
                  item={highlight}
                  onPress={() => navigation.navigate('Detail', { id: highlight?.id, item: highlight })}
                />
              </>
            ) : null}

            {activeItems.length > 0 ? (
              <>
                <SectionTitle>Aktive Gewinnspiele</SectionTitle>
                {activeItems.map((item, index) => (
                  <GewinnspielCard
                    key={`${item?.id || 'active'}-${index}`}
                    item={item}
                    onPress={() => navigation.navigate('Detail', { id: item?.id, item })}
                  />
                ))}
              </>
            ) : !highlight ? (
              <GlassCard style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>Keine aktiven Gewinnspiele</Text>
                <Text style={styles.emptyText}>
                  In dieser Kategorie sind aktuell keine aktiven Gewinnspiele vorhanden.
                </Text>
              </GlassCard>
            ) : null}

            {inactiveItems.length > 0 ? (
              <>
                <SectionTitle>Abgelaufene Gewinnspiele</SectionTitle>
                {inactiveItems
                  .sort((a, b) => Number(b?.gesamtwert || 0) - Number(a?.gesamtwert || 0))
                  .map((item, index) => (
                    <GewinnspielCard
                      key={`${item?.id || 'inactive'}-${index}`}
                      item={item}
                      onPress={() => navigation.navigate('Detail', { id: item?.id, item })}
                    />
                  ))}
              </>
            ) : null}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 95,
  },
  heroImageWrap: {
    marginTop: 18,
    backgroundColor: '#071f4d',
    borderRadius: 24,
    padding: 20,
  },
  heroImage: {
    width: '100%',
    height: 220,
  },
  heroStatsRow: {
    marginTop: 16,
    marginBottom: 18,
  },
  heroStatCardWide: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  heroStatValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 6,
  },
  heroStatLabel: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyCard: {
    padding: 20,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 15,
    lineHeight: 22,
  },
});
