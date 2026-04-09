import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { CATEGORIES } from '../theme';
import { CategoryChip } from './UI';

const ORDER = [
  'alle',
  'technik','computer','urlaub','reisen','fernseher','bargeld',
  'fahrrad','haus','kosmetik','baby','buecher','mercedes',
  'audi','spielzeug','sport','lebensmittel','mode','grill',
  'wertanlage','konzert','fussball','haribo','konsole','lautsprecher',
  'saugroboter','smartphone','tankgutschein','kaffee','kopfhoerer',
  'motorrad','nintendo_switch','produktpakete','filme','auto'
];

export default function CategoryGrid({
  onPressCategory,
  includeAlle = true,
}) {
  const cats = useMemo(() => {
    const arr = Array.isArray(CATEGORIES) ? [...CATEGORIES] : [];
    const filtered = includeAlle ? arr : arr.filter((c) => c.slug !== 'alle');
    const bySlug = new Map(filtered.map((c) => [c.slug, c]));
    const ordered = ORDER.map((slug) => bySlug.get(slug)).filter(Boolean);
    const rest = filtered.filter((c) => !ORDER.includes(c.slug));
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
