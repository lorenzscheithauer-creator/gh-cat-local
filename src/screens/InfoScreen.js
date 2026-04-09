import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { COLORS } from '../theme';
import { GlassCard, HeroCard, Screen } from '../components/UI';
import { APP_NAME, LEGAL } from '../config/appConfig';

export default function InfoScreen({ route }) {
  const key = route?.params?.key || 'about';
  const entry = LEGAL[key] || LEGAL.about;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <HeroCard eyebrow="Info" title={entry.title} subtitle="Wichtige Hinweise und Informationen rund um GewinnHai." />
        <GlassCard style={styles.card}>
          <Text style={styles.body}>{entry.body}</Text>
        </GlassCard>
        <GlassCard style={styles.card}>
          <Text style={styles.metaTitle}>Kurz erklärt</Text>
          <Text style={styles.metaText}>{APP_NAME} zeigt Gewinnspiele übersichtlich, schnell und mobil optimiert an.</Text>
          <Text style={styles.metaText}>Über Kategorien, Suche und Details kommst du direkt zur passenden Teilnahme.</Text>
        </GlassCard>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 110 },
  card: { padding: 18, marginTop: 16 },
  body: { color: COLORS.muted, fontSize: 15, lineHeight: 24 },
  metaTitle: { color: '#fff', fontSize: 16, fontWeight: '900', marginBottom: 10 },
  metaText: { color: COLORS.muted, fontSize: 14, lineHeight: 22, marginBottom: 8 },
});
