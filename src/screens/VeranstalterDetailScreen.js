import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen, GewinnspielCard, GlassCard, Loading, PageHeader } from '../components/UI';
import { fetchVeranstalterItems } from '../api';

export default function VeranstalterDetailScreen({ route, navigation }) {
  const veranstalter =
    route?.params?.veranstalter ||
    route?.params?.title ||
    '';

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    featured: null,
    active: { items: [] },
    inactive: { items: [] },
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetchVeranstalterItems(veranstalter, 1, 100);
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
        console.warn('VeranstalterDetail load error:', e);
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
  }, [veranstalter]);

  const featured = data?.featured || null;

  const activeItems = useMemo(() => {
    const list = Array.isArray(data?.active?.items) ? data.active.items : [];
    if (!featured) return list;
    return list.filter((item) => String(item?.id) !== String(featured?.id));
  }, [data, featured]);

  const inactiveItems = useMemo(() => {
    const list = Array.isArray(data?.inactive?.items) ? data.inactive.items : [];
    if (!featured) return list;
    return list.filter((item) => String(item?.id) !== String(featured?.id));
  }, [data, featured]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <PageHeader
          eyebrow="Veranstalter"
          title={veranstalter || 'Veranstalter'}
          subtitle="Alle Gewinnspiele dieses Veranstalters"
        />

        <View style={styles.hero}>
          <View style={styles.heroText}>
            <Text style={styles.heroEyebrow}>VERANSTALTER</Text>
            <Text style={styles.heroTitle}>{veranstalter || 'Unbekannt'}</Text>
            <Text style={styles.heroSub}>
              Alle Gewinnspiele dieses Veranstalters mit Highlight, aktiven und älteren Einträgen.
            </Text>
          </View>
          <MaterialCommunityIcons name="office-building" size={68} color="#fff" />
        </View>

        {loading ? (
          <Loading />
        ) : (
          <>
            {featured ? (
              <>
                <Text style={styles.sectionTitle}>Highlight</Text>
                <GewinnspielCard
                  item={featured}
                  onPress={() => navigation.navigate('Detail', { id: featured?.id, item: featured })}
                />
              </>
            ) : null}

            <Text style={styles.sectionTitle}>Aktiv</Text>
            <Text style={styles.sectionSub}>Aktive Gewinnspiele dieses Veranstalters.</Text>
            {activeItems.length ? (
              activeItems.map((item, index) => (
                <GewinnspielCard
                  key={`active-${item?.id || index}`}
                  item={item}
                  onPress={() => navigation.navigate('Detail', { id: item?.id, item })}
                />
              ))
            ) : (
              <GlassCard style={styles.emptyCard}>
                <Text style={styles.emptyText}>Keine aktiven Gewinnspiele gefunden.</Text>
              </GlassCard>
            )}

            <Text style={styles.sectionTitle}>Weitere</Text>
            <Text style={styles.sectionSub}>Ältere oder inaktive Gewinnspiele dieses Veranstalters.</Text>
            {inactiveItems.length ? (
              inactiveItems.map((item, index) => (
                <GewinnspielCard
                  key={`inactive-${item?.id || index}`}
                  item={item}
                  onPress={() => navigation.navigate('Detail', { id: item?.id, item })}
                />
              ))
            ) : (
              <GlassCard style={styles.emptyCard}>
                <Text style={styles.emptyText}>Keine weiteren Gewinnspiele gefunden.</Text>
              </GlassCard>
            )}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 110,
  },
  hero: {
    backgroundColor: '#262b78',
    borderRadius: 28,
    padding: 22,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroText: {
    flex: 1,
    paddingRight: 16,
  },
  heroEyebrow: {
    color: '#25c8ff',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 8,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '900',
    marginBottom: 10,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    lineHeight: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 12,
    marginBottom: 8,
  },
  sectionSub: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 14,
    marginBottom: 12,
  },
  emptyCard: {
    padding: 18,
    marginBottom: 18,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
  },
});
