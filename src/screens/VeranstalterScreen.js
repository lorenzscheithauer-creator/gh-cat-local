import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { Screen, GlassCard, Loading } from '../components/UI';
import { fetchVeranstalter } from '../api';

export default function VeranstalterScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchVeranstalter();
        if (mounted) setItems(Array.isArray(data?.items) ? data.items : []);
      } catch (e) {
        console.warn('Veranstalter load error:', e);
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroCard}>
          <View style={styles.circleLeft} />
          <View style={styles.circleRight} />

          <Text style={styles.heroEyebrow}>Veranstalter</Text>
          <Text style={styles.heroTitle}>Top Veranstalter</Text>
          <Text style={styles.heroSubtitle}>
            Alle Veranstalter mit aktiven Gewinnspielen
          </Text>
        </View>

        {loading ? (
          <Loading />
        ) : items.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>Keine Veranstalter gefunden.</Text>
          </GlassCard>
        ) : (
          items.map((item, index) => (
            <Pressable
              key={`${item?.name || 'veranstalter'}-${index}`}
              style={styles.organizerCard}
              onPress={() =>
                navigation.navigate('VeranstalterDetail', {
                  name: item?.name || 'Veranstalter',
                  title: item?.name || 'Veranstalter',
                })
              }
            >
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>

              <View style={styles.organizerLeft}>
                <Text style={styles.organizerName} numberOfLines={2}>
                  {item?.name || 'Unbekannt'}
                </Text>
                <Text style={styles.organizerCount}>
                  {Number(item?.count || 0).toLocaleString('de-DE')} Gewinnspiele
                </Text>
              </View>

              <View style={styles.organizerRight}>
                <Text style={styles.valueMain}>
                  {Number(item?.total_value || 0).toLocaleString('de-DE')} €
                </Text>
                <Text style={styles.valueSub}>Gewinnsumme</Text>
              </View>
            </Pressable>
          ))
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

  heroCard: {
    backgroundColor: '#232f67',
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 26,
    marginBottom: 18,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(140,92,255,0.35)',
  },
  circleLeft: {
    position: 'absolute',
    left: -70,
    bottom: -65,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(41,200,255,0.12)',
  },
  circleRight: {
    position: 'absolute',
    right: -55,
    top: -60,
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: 'rgba(140,92,255,0.20)',
  },
  heroEyebrow: {
    color: '#29c8ff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 10,
    zIndex: 2,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    maxWidth: '88%',
    zIndex: 2,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    maxWidth: '88%',
    zIndex: 2,
  },

  organizerCard: {
    backgroundColor: 'rgba(18,35,73,0.96)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankBadge: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#2c3279',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rankText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },

  organizerLeft: {
    flex: 1,
    paddingRight: 10,
  },
  organizerName: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 4,
  },
  organizerCount: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: 14,
  },

  organizerRight: {
    alignItems: 'flex-end',
    minWidth: 108,
  },
  valueMain: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 4,
  },
  valueSub: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 13,
  },

  emptyCard: {
    padding: 18,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 15,
  },
});
