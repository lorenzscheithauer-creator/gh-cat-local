import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { CATEGORIES } from '../theme';
import { CATEGORY_ORDER } from '../constants/categoryOrder';
import { CategoryChip } from './UI';


export default function CategoryGrid({
  onPressCategory,
  includeAlle = true,
}) {
  const cats = useMemo(() => {
    const arr = Array.isArray(CATEGORIES) ? [...CATEGORIES] : [];
    const filtered = includeAlle ? arr : arr.filter((c) => c.slug !== 'alle');
    const bySlug = new Map(filtered.map((c) => [c.slug, c]));
    const ordered = CATEGORY_ORDER.map((slug) => bySlug.get(slug)).filter(Boolean);
    const rest = filtered.filter((c) => !CATEGORY_ORDER.includes(c.slug));
    return [...ordered, ...rest];
  }, [includeAlle]);

  return (
    <View style={styles.grid}>
      {cats.map((cat) => (
        <View key={cat.slug} style={styles.gridItem}>
          <CategoryChip
            image={cat.image}
            label={cat.label}
            onPress={() => onPressCategory?.(cat)}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
