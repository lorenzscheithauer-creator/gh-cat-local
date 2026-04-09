import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { CATEGORIES } from '../theme';
import { Screen, CategoryChip, GlassCard, PageHeader } from '../components/UI';

const ORDER = [
  'alle',
  'technik','computer','urlaub','reisen','fernseher','bargeld',
  'fahrrad','haus','kosmetik','baby','buecher','mercedes',
  'audi','spielzeug','sport','lebensmittel','mode','grill',
  'wertanlage','konzert','fussball','haribo','konsole','lautsprecher',
  'saugroboter','smartphone','tankgutschein','kaffee','kopfhoerer',
  'motorrad','nintendo_switch','produktpakete','filme','auto'
];

export default function CategoryScreen({ navigation }) {
  const cats = useMemo(() => {
    const arr = Array.isArray(CATEGORIES) ? [...CATEGORIES] : [];
    const bySlug = new Map(arr.map((c) => [c.slug, c]));
    const ordered = ORDER.map((slug) => bySlug.get(slug)).filter(Boolean);
    const rest = arr.filter((c) => !ORDER.includes(c.slug));
    return [...ordered, ...rest];
  }, []);

  const goCategory = (cat) =>
    navigation.navigate('KategorieDetail', { slug: cat.slug, title: cat.label });

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <PageHeader
          eyebrow="Kategorien"
          title="Alle Gewinnspiel-Kategorien"
          subtitle="Wähle direkt eine Kategorie aus und entdecke passende aktive Gewinnspiele."
        />

        <View style={styles.grid}>
          {cats.map((cat) => (
            <View key={cat.slug} style={styles.gridItem}>
              <CategoryChip
                image={cat.image}
                label={cat.label}
                onPress={() => goCategory(cat)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 95,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '31.5%',
    marginBottom: 10,
  },
});
