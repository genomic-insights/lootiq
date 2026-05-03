import AsyncStorage from '@react-native-async-storage/async-storage'
import { SavedGame, NotificationItem } from '../types'

const SAVED_GAMES_KEY = '@lootiq_saved_games'
const NOTIFICATIONS_KEY = '@lootiq_notifications'
const PLATFORM_PREFS_KEY = '@lootiq_platform_prefs'

export const getSavedGames = async (): Promise<SavedGame[]> => {
  try {
    const data = await AsyncStorage.getItem(SAVED_GAMES_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const saveGame = async (game: SavedGame): Promise<void> => {
  const games = await getSavedGames()
  const exists = games.find(g => g.id === game.id)
  if (!exists) {
    await AsyncStorage.setItem(SAVED_GAMES_KEY, JSON.stringify([...games, game]))
  }
}

export const removeSavedGame = async (id: number): Promise<void> => {
  const games = await getSavedGames()
  const filtered = games.filter(g => g.id !== id)
  await AsyncStorage.setItem(SAVED_GAMES_KEY, JSON.stringify(filtered))
}

export const isGameSaved = async (id: number): Promise<boolean> => {
  const games = await getSavedGames()
  return games.some(g => g.id === id)
}

export const getNotifications = async (): Promise<NotificationItem[]> => {
  try {
    const data = await AsyncStorage.getItem(NOTIFICATIONS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const saveNotification = async (item: NotificationItem): Promise<void> => {
  const items = await getNotifications()
  await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([item, ...items]))
}

export const markNotificationRead = async (id: string): Promise<void> => {
  const items = await getNotifications()
  const updated = items.map(n => n.id === id ? { ...n, read: true } : n)
  await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated))
}

export const getPlatformPrefs = async (): Promise<Record<string, boolean>> => {
  try {
    const data = await AsyncStorage.getItem(PLATFORM_PREFS_KEY)
    return data ? JSON.parse(data) : {
      epic: true,
      steam: true,
      gog: true,
      playstation: false,
      xbox: false,
    }
  } catch {
    return { epic: true, steam: true, gog: true, playstation: false, xbox: false }
  }
}

export const savePlatformPrefs = async (prefs: Record<string, boolean>): Promise<void> => {
  await AsyncStorage.setItem(PLATFORM_PREFS_KEY, JSON.stringify(prefs))
}

const WISHLIST_KEY = '@lootiq_wishlist'
const CLAIMED_KEY = '@lootiq_claimed'

export const getWishlist = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(WISHLIST_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const addWishlistItem = async (name: string): Promise<void> => {
  const trimmed = name.trim()
  if (trimmed.length < 2) return
  const list = await getWishlist()
  const exists = list.some(item => item.toLowerCase() === trimmed.toLowerCase())
  if (!exists) {
    await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify([...list, trimmed]))
  }
}

export const removeWishlistItem = async (name: string): Promise<void> => {
  const list = await getWishlist()
  const filtered = list.filter(item => item.toLowerCase() !== name.trim().toLowerCase())
  await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(filtered))
}

export const isWishlistItem = async (name: string): Promise<boolean> => {
  const list = await getWishlist()
  return list.some(item => item.toLowerCase() === name.trim().toLowerCase())
}

export const getClaimedIds = async (): Promise<number[]> => {
  try {
    const data = await AsyncStorage.getItem(CLAIMED_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const claimGame = async (id: number): Promise<void> => {
  const ids = await getClaimedIds()
  if (!ids.includes(id)) {
    await AsyncStorage.setItem(CLAIMED_KEY, JSON.stringify([...ids, id]))
  }
}

export const unclaimGame = async (id: number): Promise<void> => {
  const ids = await getClaimedIds()
  await AsyncStorage.setItem(CLAIMED_KEY, JSON.stringify(ids.filter(i => i !== id)))
}

export const isGameClaimed = async (id: number): Promise<boolean> => {
  const ids = await getClaimedIds()
  return ids.includes(id)
}
