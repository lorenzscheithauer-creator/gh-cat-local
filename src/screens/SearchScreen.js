import React, { useMemo, useRef, useState } from 'react';
import {
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchSearch } from '../api';
import { Screen, GewinnspielCard,
  PageHeader, GlassCard, Loading } from '../components/UI';

const CATEGORY_OPTIONS = [
  '',
  'technik',
  'computer',
  'urlaub',
  'reisen',
  'fernseher',
  'bargeld',
  'fahrrad',
  'haus',
  'kosmetik',
  'baby',
  'bücher',
  'mercedes',
  'audi',
  'spielzeug',
  'sport',
  'lebensmittel',
  'mode',
  'grill',
  'wertanlage',
  'konzert',
  'fußball',
  'haribo',
  'konsole',
  'lautsprecher',
  'saugroboter',
  'smartphone',
  'tankgutschein',
  'kaffee',
  'kopfhörer',
  'motorrad',
  'nintendo switch',
  'produktpakete',
  'filme'
];

function FilterChip({ active, label, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.filterChip, active && styles.filterChipActive]}>
      <Text
        numberOfLines={1}
        style={[styles.filterChipText, active && styles.filterChipTextActive]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function SearchScreen({ navigation }) {
  const scrollRef = useRef(null);
  const resultsYRef = useRef(0);

  const [query, setQuery] = useState('');
  const [minValue, setMinValue] = useState('');
  const [category, setCategory] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [searched, setSearched] = useState(false);

  const visibleCategories = useMemo(() => {
    return showAllCategories ? CATEGORY_OPTIONS : CATEGORY_OPTIONS.slice(0, 9);
  }, [showAllCategories]);

  const runSearch = async (forcedQuery) => {
    const q = String(forcedQuery ?? query ?? '').trim();
    const numericMin = Number(String(minValue || '').replace(/[^\d]/g, '')) || 0;

    try {
      setLoading(true);
      setSearched(true);

      const data = await fetchSearch({
        q,
        page: 1,
        minValue: numericMin,
        category,
      });

      setItems(Array.isArray(data?.items) ? data.items : []);
      setTotal(Number(data?.total || 0));

      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            y: Math.max(0, resultsYRef.current - 12),
            animated: true,
          });
        }
      }, 120);
    } catch (err) {
      console.warn('Search load error:', err);
      setItems([]);
      setTotal(0);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setQuery('');
    setMinValue('');
    setCategory('');
    setItems([]);
    setTotal(0);
    setSearched(false);
    setShowAllCategories(false);
  };

  return (
    <Screen>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>SUCHE & FILTER</Text>
          <Text style={styles.heroTitle}>Aktive Gewinnspiele finden</Text>
          <Text style={styles.heroSub}>
            Suche nach Begriffen und filtere nach Mindestwert und Kategorie.
          </Text>

          <View style={styles.searchCard}>
            <View style={styles.inputRow}>
              <MaterialCommunityIcons name="magnify" size={22} color="#8fdcff" />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="z. B. Bitburger, Reise, Fernseher"
                placeholderTextColor="rgba(255,255,255,0.42)"
                style={styles.input}
                returnKeyType="search"
                onSubmitEditing={() => runSearch()}
              />
            </View>

            <View style={styles.compactRow}>
              <View style={styles.compactBlock}>
                <Text style={styles.filterTitle}>Mindestwert</Text>
                <View style={styles.valueInputRow}>
                  <MaterialCommunityIcons name="cash" size={18} color="#ffd54a" />
                  <TextInput
                    value={minValue}
                    onChangeText={(text) => setMinValue(text.replace(/[^\d]/g, ''))}
                    placeholder="z. B. 1000"
                    placeholderTextColor="rgba(255,255,255,0.42)"
                    keyboardType="number-pad"
                    style={styles.valueInput}
                  />
                  <Text style={styles.valueSuffix}>€</Text>
                </View>
              </View>
            </View>

            <Text style={styles.filterTitle}>Kategorie</Text>
            <View style={styles.chipGrid}>
              {visibleCategories.map((value) => (
                <View key={value || 'alle'} style={styles.chipCell}>
                  <FilterChip
                    active={category === value}
                    label={value === '' ? 'Alle' : value}
                    onPress={() => setCategory(value)}
                  />
                </View>
              ))}
            </View>

            <Pressable
              style={styles.moreButton}
              onPress={() => setShowAllCategories((v) => !v)}
            >
              <Text style={styles.moreButtonText}>
                {showAllCategories ? 'Weniger anzeigen' : 'Mehr Kategorien'}
              </Text>
              <MaterialCommunityIcons
                name={showAllCategories ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#9fdfff"
              />
            </Pressable>

            <View style={styles.buttonRow}>
              <Pressable style={styles.secondaryButton} onPress={resetFilters}>
                <Text style={styles.secondaryButtonText}>Zurücksetzen</Text>
              </Pressable>

              <Pressable style={styles.button} onPress={() => runSearch()}>
                <MaterialCommunityIcons name="magnify" size={18} color="#fff" />
                <Text style={styles.buttonText}>Suchen</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View
          onLayout={(e) => {
            resultsYRef.current = e.nativeEvent.layout.y;
          }}
          style={styles.resultsAnchor}
        >
          {loading ? (
            <Loading />
          ) : searched ? (
            <>
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsTitle}>Ergebnisse</Text>
                <Text style={styles.resultsSubtitle}>{total} Treffer · teuerste zuerst</Text>
              </View>

              {items.length === 0 ? (
                <GlassCard style={styles.emptyCard}>
                  <Text style={styles.emptyTitle}>Keine passenden Gewinnspiele</Text>
                  <Text style={styles.emptyText}>
                    Ändere Suchbegriff, Mindestwert oder Kategorie.
                  </Text>
                </GlassCard>
              ) : (
                items.map((item, index) => (
                  <GewinnspielCard
                    key={`${item?.id || 'search'}-${index}`}
                    item={item}
                    onPress={() => navigation.navigate('Detail', { id: item?.id, item })}
                  />
                ))
              )}
            </>
          ) : (
            <GlassCard style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Suche starten</Text>
              <Text style={styles.emptyText}>
                Gib einen Begriff ein oder nutze die Filter.
              </Text>
            </GlassCard>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 95,
  },

  hero: {
    backgroundColor: 'rgba(14,30,60,0.98)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 16,
    marginBottom: 18,
    shadowColor: '#21c8f6',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  eyebrow: {
    color: '#21c8f6',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 6,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '900',
  },
  heroSub: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  searchCard: {
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderRadius: 22,
    padding: 12,
  },
  inputRow: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
  },

  compactRow: {
    marginBottom: 8,
  },
  compactBlock: {
    width: '100%',
  },

  filterTitle: {
    color: '#9fdfff',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
  },

  valueInputRow: {
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  valueInput: {
    flex: 1,
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '700',
  },
  valueSuffix: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 15,
    fontWeight: '800',
  },

  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  chipCell: {
    width: '33.333%',
    paddingHorizontal: 4,
    marginBottom: 8,
  },

  filterChip: {
    minHeight: 44,
    backgroundColor: 'rgba(255,255,255,0.055)',
    borderRadius: 999,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  filterChipActive: {
    backgroundColor: '#1f5b9b',
    borderColor: '#2fbaf0',
  },
  filterChipText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  filterChipTextActive: {
    color: '#fff',
  },

  moreButton: {
    minHeight: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
    marginBottom: 12,
  },
  moreButtonText: {
    color: '#9fdfff',
    fontSize: 14,
    fontWeight: '800',
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  button: {
    flex: 1.2,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#29bee9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 8,
  },

  resultsAnchor: {
    minHeight: 120,
  },
  resultsHeader: {
    marginBottom: 14,
  },
  resultsTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
  },
  resultsSubtitle: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 14,
    marginTop: 4,
  },
  emptyCard: {
    padding: 20,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 15,
    lineHeight: 22,
  },
});
