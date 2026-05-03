import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import { Colors } from '../../constants/colors'
import {
  getSavedGames,
  removeSavedGame,
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
} from '../../services/storage'
import { calcTimeLeft, isPermanent } from '../../services/api'
import { SavedGame } from '../../types'

export default function SavedScreen() {
  const router = useRouter()
  const [games, setGames] = useState<SavedGame[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [newItem, setNewItem] = useState('')

  useFocusEffect(
    useCallback(() => {
      getSavedGames().then(setGames)
      getWishlist().then(setWishlist)
    }, [])
  )

  const handleLongPress = (game: SavedGame) => {
    Alert.alert(
      'Kampanyayı Kaldır',
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

  const handleAddWish = async () => {
    const trimmed = newItem.trim()
    if (!trimmed) return
    await addWishlistItem(trimmed)
    setNewItem('')
    getWishlist().then(setWishlist)
  }

  const handleRemoveWish = async (name: string) => {
    await removeWishlistItem(name)
    setWishlist(prev => prev.filter(w => w.toLowerCase() !== name.toLowerCase()))
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kayıtlı Kampanyalar</Text>
        {games.length > 0 && (
          <Text style={styles.headerCount}>{games.length} kampanya</Text>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {games.length === 0 ? (
          <View style={styles.emptyGames}>
            <Text style={styles.emptyIcon}>🎮</Text>
            <Text style={styles.emptyTitle}>Henüz kampanya kaydetmedin</Text>
            <Text style={styles.emptyDesc}>
              Beğendiğin kampanyaları kaydederek daha sonra kolayca erişebilirsin
            </Text>
            <TouchableOpacity
              style={styles.discoverBtn}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={styles.discoverText}>Kampanyaları Keşfet</Text>
            </TouchableOpacity>
          </View>
        ) : (
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
        )}

        <View style={styles.wishSection}>
          <Text style={styles.sectionLabel}>İSTEK LİSTEM</Text>

          <View style={styles.wishInputRow}>
            <TextInput
              style={styles.wishInput}
              placeholder="Oyun adı ekle..."
              placeholderTextColor={Colors.textMuted}
              value={newItem}
              onChangeText={setNewItem}
              onSubmitEditing={handleAddWish}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.wishAddBtn} onPress={handleAddWish}>
              <Text style={styles.wishAddText}>Ekle</Text>
            </TouchableOpacity>
          </View>

          {wishlist.length === 0 ? (
            <Text style={styles.wishEmpty}>
              Takip etmek istediğin oyunları buraya ekle
            </Text>
          ) : (
            wishlist.map(item => (
              <View key={item} style={styles.wishItem}>
                <Text style={styles.wishItemText} numberOfLines={1}>{item}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveWish(item)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.wishRemove}>✕</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
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
  emptyGames: {
    alignItems: 'center',
    paddingVertical: 48,
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
  wishSection: {
    marginTop: 24,
    paddingHorizontal: 16,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  wishInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  wishInput: {
    flex: 1,
    height: 40,
    backgroundColor: Colors.cardInner,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 12,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  wishAddBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  wishAddText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
  },
  wishEmpty: {
    fontSize: 12,
    color: Colors.textMuted,
    paddingVertical: 6,
  },
  wishItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardInner,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
  },
  wishItemText: {
    fontSize: 13,
    color: Colors.textPrimary,
    flex: 1,
  },
  wishRemove: {
    fontSize: 13,
    color: Colors.textMuted,
    paddingLeft: 12,
  },
  spacer: {
    height: 20,
  },
})
