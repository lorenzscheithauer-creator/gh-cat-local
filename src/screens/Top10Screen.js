import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { COLORS } from '../theme';
import { fetchTop10 } from '../api';
import { GewinnspielCard,
  PageHeader, Loading, Empty, HeroCard, Screen } from '../components/UI';

export default function Top10Screen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchTop10();
      setItems(data.items || []);
    } catch (e) {
      console.warn('Top10 error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  const onRefresh = () => { setRefreshing(true); load(); };
  const goDetail = (item) => navigation.navigate('Detail', { id: item.id, item });

  if (loading) return <Screen><Loading /></Screen>;

  return (
    <Screen>
      <FlatList
        data={items}
        keyExtractor={(item, idx) => String(item.id || idx)}
        renderItem={({ item, index }) => <View style={styles.itemGap}><GewinnspielCard item={item} rank={index} onPress={() => goDetail(item)} /></View>}
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} colors={[COLORS.primary]} />}
        ListHeaderComponent={<HeroCard eyebrow="Ranking" title="Top 10 Gewinnspiele" subtitle="Gewinnspiele mit der höchsten Gewinnsumme" />}
        ListEmptyComponent={<Empty message="Zurzeit gibt es keine Einträge in den Top 10." icon="trophy-broken" />}
        ListFooterComponent={<View style={{ height: 110 }} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 0 },
  itemGap: { marginTop: 12 },
});
