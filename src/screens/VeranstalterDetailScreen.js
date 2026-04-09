import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchVeranstalterItems } from '../api';
import { Screen, HeroCard, SectionTitle, GewinnspielCard, Loading,
  PageHeader, GlassCard } from '../components/UI';

export default function VeranstalterDetailScreen({ route, navigation }) {
  const name = route?.params?.name || 'Veranstalter';
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ featured: null, active: { items: [] }, inactive: { items: [] } });

  useEffect(() => {
    let alive = true;
    fetchVeranstalterItems(name)
      .then((res) => alive && setData(res || { featured: null, active: { items: [] }, inactive: { items: [] } }))
      .catch((err) => {
        console.warn('VeranstalterDetail load error:', err);
        if (alive) setData({ featured: null, active: { items: [] }, inactive: { items: [] } });
      })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [name]);

  const featuredId = data?.featured?.id;

  const activeItems = useMemo(
    () => (data?.active?.items || []).filter((item) => item?.id !== featuredId),
    [data, featuredId]
  );

  const inactiveItems = useMemo(
    () => (data?.inactive?.items || []).filter((item) => item?.id !== featuredId),
    [data, featuredId]
  );

  const goDetail = (item) => navigation.navigate('Detail', { id: item?.id, item });

  if (loading) return <Screen><Loading /></Screen>;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <HeroCard
          eyebrow="VERANSTALTER"
          title={name}
          subtitle="Alle Gewinnspiele dieses Veranstalters mit Highlight, aktiven und älteren Einträgen."
          right={<MaterialCommunityIcons name="office-building-outline" size={42} color="#fff" />}
        />

        {data?.featured ? (
          <>
            <SectionTitle subtitle="Das stärkste Gewinnspiel dieses Veranstalters.">Highlight</SectionTitle>
            <GewinnspielCard item={data.featured} onPress={() => goDetail(data.featured)} />
          </>
        ) : null}

        <SectionTitle subtitle="Aktive Gewinnspiele dieses Veranstalters.">Aktiv</SectionTitle>
        {activeItems.length ? (
          activeItems.map((item, index) => (
            <GewinnspielCard key={`a-${item.id || index}`} item={item} onPress={() => goDetail(item)} />
          ))
        ) : (
          <GlassCard style={styles.empty}><Text style={styles.emptyText}>Keine aktiven Gewinnspiele gefunden.</Text></GlassCard>
        )}

        <SectionTitle subtitle="Ältere oder inaktive Gewinnspiele dieses Veranstalters.">Weitere</SectionTitle>
        {inactiveItems.length ? (
          inactiveItems.map((item, index) => (
            <GewinnspielCard key={`i-${item.id || index}`} item={item} onPress={() => goDetail(item)} />
          ))
        ) : (
          <GlassCard style={styles.empty}><Text style={styles.emptyText}>Keine weiteren Gewinnspiele gefunden.</Text></GlassCard>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 120 },
  empty: { padding: 18, marginBottom: 14 },
  emptyText: { color: 'rgba(255,255,255,0.72)' },
});
