import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
  Linking,
} from 'react-native';
import {
  Screen,
  GlassCard,
  Loading,
  PageHeader,
} from '../components/UI';
import {
  fetchItem,
  formatEuro,
  getTitle,
  getVeranstalter,
  getGesamtwert,
  getEndDatum,
  getPrimaryKategorie,
  getCategoryLabel,
  getTeilnahmeUrl,
  getTeilnahmeText,
  getBeschreibung,
  getItemImageSource,
} from '../api';

function splitGewinne(value) {
  return String(value || '')
    .split(';')
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function DetailScreen({ route, navigation }) {
  const passedItem = route?.params?.item || null;
  const id = route?.params?.id;

  const [loading, setLoading] = useState(!passedItem && !!id);
  const [item, setItem] = useState(passedItem);

  useEffect(() => {
    let mounted = true;

    if (passedItem || !id) return;

    (async () => {
      try {
        const data = await fetchItem(id);
        if (mounted) setItem(data || null);
      } catch (e) {
        console.warn('Detail load error:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id, passedItem]);

  const current = item || passedItem || {};
  const title = getTitle(current);
  const veranstalter = getVeranstalter(current);
  const category = getPrimaryKategorie(current);
  const categoryLabel = getCategoryLabel(category);
  const enddatum = getEndDatum(current);
  const gesamtwert = getGesamtwert(current);
  const beschreibung = getBeschreibung(current);
  const teilnahmeUrl = getTeilnahmeUrl(current);
  const teilnahmeText = getTeilnahmeText(current);
  const imageSource = getItemImageSource(current);
  const gewinne = useMemo(() => splitGewinne(current?.gewinne), [current?.gewinne]);

  const openTeilnahme = async () => {
    if (!teilnahmeUrl) return;
    try {
      await Linking.openURL(teilnahmeUrl);
    } catch (e) {
      console.warn('Teilnahme open error:', e);
    }
  };

  const openVeranstalter = () => {
    if (!veranstalter) return;
    navigation.navigate('VeranstalterDetail', {
      veranstalter,
      title: veranstalter,
    });
  };

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
        <PageHeader
          eyebrow="Gewinnspiel"
          title={title || 'Gewinnspiel'}
          subtitle={veranstalter || ' '}
        />

        {imageSource ? (
          <View style={styles.heroImageWrap}>
            <Image source={imageSource} style={styles.heroImage} resizeMode="contain" />
          </View>
        ) : null}

        <View style={styles.grid}>
          <GlassCard style={styles.gridCard}>
            <Text style={styles.label}>Kategorie</Text>
            <Text style={styles.value}>{categoryLabel}</Text>
          </GlassCard>

          <GlassCard style={styles.gridCard}>
            <Text style={styles.label}>Gesamtwert</Text>
            <Text style={styles.value}>{formatEuro(gesamtwert)}</Text>
          </GlassCard>
        </View>

        <GlassCard style={styles.fullCard}>
          <Text style={styles.label}>Enddatum</Text>
          <Text style={styles.value}>{enddatum || 'Unbekannt'}</Text>
        </GlassCard>

        {veranstalter ? (
          <Pressable style={styles.organizerButton} onPress={openVeranstalter}>
            <Text style={styles.organizerButtonLabel}>Veranstalter</Text>
            <Text style={styles.organizerButtonText}>{veranstalter}</Text>
          </Pressable>
        ) : null}

        {gewinne.length ? (
          <GlassCard style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Gewinne</Text>
            {gewinne.map((eintrag, index) => (
              <Text key={`${index}-${eintrag}`} style={styles.bullet}>
                •  {eintrag}
              </Text>
            ))}
          </GlassCard>
        ) : null}

        {beschreibung ? (
          <GlassCard style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Details</Text>
            <Text style={styles.description}>{beschreibung}</Text>
          </GlassCard>
        ) : null}

        {teilnahmeUrl ? (
          <Pressable style={styles.joinButton} onPress={openTeilnahme}>
            <Text style={styles.joinButtonText}>{teilnahmeText || 'Jetzt teilnehmen'}</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 110,
  },
  heroImageWrap: {
    backgroundColor: '#081c46',
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: 180,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  gridCard: {
    flex: 1,
    padding: 18,
  },
  fullCard: {
    padding: 18,
    marginBottom: 12,
  },
  label: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 14,
    marginBottom: 8,
  },
  value: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
  },
  organizerButton: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  organizerButtonLabel: {
    color: '#8fdcff',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  organizerButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
  sectionCard: {
    padding: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 12,
  },
  bullet: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    lineHeight: 30,
  },
  description: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 15,
    lineHeight: 24,
  },
  joinButton: {
    marginTop: 8,
    marginBottom: 12,
    backgroundColor: '#E53935',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
  },
});
