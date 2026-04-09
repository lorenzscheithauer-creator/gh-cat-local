import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import { COLORS } from '../theme';
import { fetchVeranstalter, formatEuro } from '../api';
import { GlassCard, Loading, PageHeader } from '../components/UI';

export default function MoreScreen({ navigation }) {
  const [veranstalter, setVeranstalter] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVeranstalter()
      .then(d => setVeranstalter((d.items || []).slice(0, 50)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const goVeranstalter = (item) => {
    navigation.navigate('VeranstalterDetail', {
      name: item.name,
      title: item.name,
    });
  };

  return (
    <ScrollView style={styles.bg} contentContainerStyle={styles.container}>
      <PageHeader
          eyebrow="Veranstalter"
          title="Gewinnspielveranstalter"
          subtitle="Aktive Anbieter nach gesamter Gewinnsumme sortiert."
        />

      {loading ? (
        <Loading />
      ) : (
        <GlassCard style={styles.listCard}>
          {veranstalter.map((v, i) => (
            <TouchableOpacity
              key={`${v.name}-${i}`}
              style={[styles.row, i < veranstalter.length - 1 && styles.rowBorder]}
              onPress={() => goVeranstalter(v)}
              activeOpacity={0.85}
            >
              <View style={styles.rankBox}>
                <Text style={styles.rankText}>{i + 1}</Text>
              </View>

              <View style={styles.centerCol}>
                <Text style={styles.name} numberOfLines={1}>{v.name}</Text>
                <Text style={styles.meta}>
                  {v.count} Gewinnspiel{v.count !== 1 ? 'e' : ''}
                </Text>
              </View>

              <View style={styles.rightCol}>
                <Text style={styles.value}>{formatEuro(v.total_value || 0)}</Text>
                <Text style={styles.valueLabel}>Gesamtwert</Text>
              </View>
            </TouchableOpacity>
          ))}
        </GlassCard>
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: COLORS.bg2 },
  container: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 },
  listCard: {
    padding: 0,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  rankBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(124,92,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(124,92,255,0.28)',
  },
  rankText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
  },
  centerCol: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
  meta: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.48)',
    marginTop: 4,
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
  valueLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.46)',
    marginTop: 4,
  },
});
