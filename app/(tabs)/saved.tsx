import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import { Colors } from '../../constants/colors'
import { getSavedGames, removeSavedGame } from '../../services/storage'
import { calcTimeLeft, isPermanent } from '../../services/api'
import { SavedGame } from '../../types'

export default function SavedScreen() {
  const router = useRouter()
  const [games, setGames] = useState<SavedGame[]>([])

  useFocusEffect(
    useCallback(() => {
      getSavedGames().then(setGames)
    }, [])
  )

  const handleLongPress = (game: SavedGame) => {
    Alert.alert(
      'Oyunu Kaldır',
      `"${game.title}" kayıtlardan kaldırılsın mı?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Kaldır',
          style: 'destructive',
          onPress: async () => {
            await removeSavedGame(game.id)
            setGames(prev => prev.filter(g => g.id !== game.id))
          },
        },
      ]
    )
  }

  if (games.length === 0) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Kayıtlı Oyunlar</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🎮</Text>
          <Text style={styles.emptyTitle}>Henüz oyun kaydetmedin</Text>
          <Text style={styles.emptyDesc}>
            Beğendiğin oyunları kaydederek daha sonra kolayca erişebilirsin
          </Text>
          <TouchableOpacity
            style={styles.discoverBtn}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.discoverText}>Oyunları Keşfet</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kayıtlı Oyunlar</Text>
        <Text style={styles.headerCount}>{games.length} oyun</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {games.map(game => {
            const permanent = isPermanent(game.end_date)
            const timeLeft = calcTimeLeft(game.end_date)
            return (
              <TouchableOpacity
                key={game.id}
                style={styles.card}
                onPress={() => router.push(`/game/${game.id}`)}
                onLongPress={() => handleLongPress(game)}
                delayLongPress={500}
                activeOpacity={0.85}
              >
                <Image
                  source={{ uri: game.thumbnail }}
                  style={styles.cardImage}
                  resizeMode="cover"
                  defaultSource={require('../../assets/placeholder.png')}
                />
                <View style={styles.cardBody}>
                  <Text style={styles.cardName} numberOfLines={2}>{game.title}</Text>
                  <Text style={styles.cardPlatform} numberOfLines={1}>{game.platforms}</Text>
                  {permanent ? (
                    <Text style={styles.permBadge}>Kalıcı</Text>
                  ) : (
                    <Text style={styles.timeBadge}>{timeLeft}</Text>
                  )}
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  headerCount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  discoverBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginTop: 4,
  },
  discoverText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
  },
  card: {
    width: '47.5%',
    backgroundColor: Colors.card,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
  },
  cardImage: {
    width: '100%',
    height: 70,
    backgroundColor: Colors.cardInner,
  },
  cardBody: {
    padding: 8,
    gap: 3,
  },
  cardName: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  cardPlatform: {
    fontSize: 10,
    color: '#666',
  },
  timeBadge: {
    fontSize: 10,
    color: Colors.danger,
  },
  permBadge: {
    fontSize: 10,
    color: Colors.success,
  },
  spacer: {
    height: 20,
  },
})
