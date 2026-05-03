import React, { useState } from 'react'
import {
  View,
  Text,
  FlatList,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Colors } from '../../constants/colors'
import { FilterPill } from '../../components/FilterPill'
import { GameCard } from '../../components/GameCard'
import { GameCardSmall, ITEM_HEIGHT } from '../../components/GameCardSmall'
import { useGiveaways } from '../../hooks/useGiveaways'
import { calculateTotalWorth } from '../../services/api'
import { Giveaway } from '../../types'

type FilterItem = {
  label: string
  platform?: string
  typeFilter?: 'game'
}

const FILTERS: FilterItem[] = [
  { label: 'Tümü' },
  { label: 'Oyunlar', typeFilter: 'game' },
  { label: 'Epic', platform: 'epic-games-store' },
  { label: 'Steam', platform: 'steam' },
  { label: 'GOG', platform: 'gog' },
  { label: 'Konsol', platform: 'console' },
]

export default function HomeScreen() {
  const router = useRouter()
  const [activeIdx, setActiveIdx] = useState(0)
  const active = FILTERS[activeIdx]
  const { data, loading, error, refetch } = useGiveaways(active.platform, active.typeFilter)

  const featured = data.slice(0, 3)
  const rest = data.slice(3)
  const { total, hasUnknown } = calculateTotalWorth(data)
  const worthText = total > 0
    ? `Toplam fırsat değeri: $${total.toFixed(2)}${hasUnknown ? '+' : ''}`
    : null

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.logo}>
          Looti<Text style={styles.logoAccent}>Q</Text>
        </Text>
        <TouchableOpacity
          style={styles.notifBtn}
          onPress={() => router.push('/(tabs)/notifications')}
        >
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            tintColor={Colors.accent}
            colors={[Colors.accent]}
          />
        }
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((f, idx) => (
            <FilterPill
              key={f.label}
              label={f.label}
              active={activeIdx === idx}
              onPress={() => setActiveIdx(idx)}
            />
          ))}
        </ScrollView>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.accent} />
          </View>
        )}

        {error && !loading && (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
              <Text style={styles.retryText}>Tekrar Dene</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && (
          <>
            {data.length === 0 ? (
              <View style={styles.center}>
                <Text style={styles.errorText}>
                  Bu platform için şu anda aktif kampanya bulunamadı.
                </Text>
                {activeIdx !== 0 && (
                  <TouchableOpacity style={styles.retryBtn} onPress={() => setActiveIdx(0)}>
                    <Text style={styles.retryText}>Tümünü Göster</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <>
                {worthText && (
                  <View style={styles.worthCard}>
                    <Text style={styles.worthText}>{worthText}</Text>
                  </View>
                )}

                {featured.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>ÖNE ÇIKAN FIRSATLAR</Text>
                    {featured.map(game => (
                      <GameCard key={game.id} game={game} />
                    ))}
                  </>
                )}

                {rest.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>TÜM KAMPANYALAR</Text>
                    <FlatList
                      data={rest}
                      keyExtractor={(item: Giveaway) => item.id.toString()}
                      numColumns={2}
                      scrollEnabled={false}
                      renderItem={({ item }: { item: Giveaway }) => (
                        <GameCardSmall game={item} />
                      )}
                      getItemLayout={(_: any, index: number) => ({
                        length: ITEM_HEIGHT,
                        offset: ITEM_HEIGHT * Math.floor(index / 2),
                        index,
                      })}
                    />
                  </>
                )}
              </>
            )}
          </>
        )}
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingTop: 44,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: {
    fontSize: 22,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  logoAccent: {
    color: Colors.accent,
  },
  notifBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cardInner,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  worthCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: Colors.cardInner,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
  },
  worthText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    paddingBottom: 10,
    letterSpacing: 0.5,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  retryText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
  },
  spacer: {
    height: 20,
  },
})
