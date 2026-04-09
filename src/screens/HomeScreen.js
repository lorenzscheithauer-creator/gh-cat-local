import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { fetchHome, fetchStats, formatEuro, getGesamtwert, getEndDatum } from '../api';
import { COLORS } from '../constants/design';
import {
  Screen,
  SectionTitle,
  Loading,
  GewinnspielCard,
  GlassCard,
} from '../components/UI';
import CategoryGrid from '../components/CategoryGrid';
import { getCountdownLabel } from '../lib/countdown';

function formatInt(value) {
  return new Intl.NumberFormat('de-DE').format(Number(value || 0));
}


export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total_value: 0, active_count: 0, prize_count: 0 });
  const [home, setHome] = useState({ top3: { items: [] }, newest: { items: [] }, ending_soon: { items: [] } });

  useEffect(() => {
    let alive = true;

    Promise.all([fetchStats(), fetchHome()])
      .then(([statsData, homeData]) => {
        if (!alive) return;
        setStats(statsData || { total_value: 0, active_count: 0, prize_count: 0 });
        setHome(homeData || { top3: { items: [] }, newest: { items: [] }, ending_soon: { items: [] } });
      })
      .catch((err) => {
        console.warn('HomeScreen load error:', err);
        if (!alive) return;
        setStats({ total_value: 0, active_count: 0, prize_count: 0 });
        setHome({ top3: { items: [] }, newest: { items: [] }, ending_soon: { items: [] } });
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const top3Items = useMemo(() => home?.top3?.items || [], [home]);

  const newestItems = useMemo(() => {
    return (home?.newest?.items || [])
      .filter((item) => getGesamtwert(item) >= 100)
      .sort((a, b) => Number(b.id || 0) - Number(a.id || 0))
      .slice(0, 10);
  }, [home]);

  const endingSoonItems = useMemo(() => {
    return (home?.ending_soon?.items || [])
      .filter((item) => getGesamtwert(item) >= 1000)
      .sort((a, b) => String(getEndDatum(a)).localeCompare(String(getEndDatum(b))))
      .slice(0, 10);
  }, [home]);

  const goDetail = (item) => navigation.navigate('Detail', { id: item?.id, item });
  const goCategory = (cat) => navigation.navigate('KategorieDetail', { slug: cat.slug, title: cat.label });

  if (loading) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.brandHero}>
          <View style={styles.brandTopRow}>
            <Image
              source={require('../../assets/branding/gewinnhai-logo.png')}
              style={styles.brandLogo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.brandClaim}>Live-Gewinnspiele mit Biss</Text>

          <View style={styles.heroValueCard}>
            <Text style={styles.heroValueTitle}>Gesamtwert live</Text>
            <Text style={styles.heroValueAmount}>{formatEuro(stats?.total_value || 0)}</Text>
            <Text style={styles.heroValueSub}>
              {formatInt(stats?.active_count)} aktiv · {formatInt(stats?.prize_count)} Gewinne insgesamt
            </Text>
          </View>
        </View>

        <SectionTitle>Top 3 Highlights</SectionTitle>
        {top3Items.length ? (
          top3Items.map((item, index) => (
            <GewinnspielCard
              key={`top-${item.id || index}`}
              item={item}
              rank={index}
              onPress={() => goDetail(item)}
            />
          ))
        ) : (
          <GlassCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>Keine Top-Gewinnspiele vorhanden.</Text>
          </GlassCard>
        )}

        <SectionTitle>Neu hinzugefügt</SectionTitle>
        {newestItems.length ? (
          newestItems.map((item, index) => (
            <GewinnspielCard
              key={`new-${item.id || index}`}
              item={item}
              onPress={() => goDetail(item)}
            />
          ))
        ) : (
          <GlassCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>Keine passenden neuen Gewinnspiele vorhanden.</Text>
          </GlassCard>
        )}

        <SectionTitle>Bald ablaufend</SectionTitle>
        {endingSoonItems.length ? (
          endingSoonItems.map((item, index) => (
            <GewinnspielCard
              key={`ending-${item.id || index}`}
              item={item}
              countdownLabel={getCountdownLabel(getEndDatum(item))}
              onPress={() => goDetail(item)}
            />
          ))
        ) : (
          <GlassCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>Keine bald endenden Gewinnspiele vorhanden.</Text>
          </GlassCard>
        )}

        <SectionTitle>Kategorien</SectionTitle>
        <CategoryGrid
          includeAlle={false}
          onPressCategory={goCategory}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 95,
  },

  brandHero: {
    backgroundColor: 'rgba(14,30,60,0.97)',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 18,
    marginBottom: 22,
    shadowColor: '#1ec8ff',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  brandTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  brandLogo: {
    width: 230,
    height: 92,
  },
  brandClaim: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  heroValueCard: {
    borderRadius: 22,
    padding: 16,
    backgroundColor: 'rgba(23, 50, 96, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  heroValueTitle: {
    color: '#9fdfff',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroValueAmount: {
    color: '#ffd54a',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 6,
  },
  heroValueSub: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 15,
    marginTop: 8,
  },

  emptyCard: {
    padding: 18,
    marginBottom: 12,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 15,
  },
});
