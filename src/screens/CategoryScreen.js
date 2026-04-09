import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Screen, PageHeader } from '../components/UI';
import CategoryGrid from '../components/CategoryGrid';

export default function CategoryScreen({ navigation }) {
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

        <CategoryGrid
          includeAlle={true}
          onPressCategory={goCategory}
        />
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
});
