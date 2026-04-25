import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { NotificationItem as NotificationItemType } from '../types'
import { Colors } from '../constants/colors'
import { markNotificationRead } from '../services/storage'

interface Props {
  item: NotificationItemType
  onRead: () => void
}

export const NotificationItem: React.FC<Props> = ({ item, onRead }) => {
  const router = useRouter()

  const handlePress = async () => {
    if (!item.read) {
      await markNotificationRead(item.id)
      onRead()
    }
    router.push(`/game/${item.gameId}`)
  }

  return (
    <TouchableOpacity
      style={[styles.item, !item.read && styles.unread]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.icon}
        resizeMode="cover"
        defaultSource={require('../assets/placeholder.png')}
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      {!item.read && <View style={styles.dot} />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  item: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  unread: {
    borderColor: '#534AB744',
    backgroundColor: '#1a1a2e',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.cardInner,
  },
  content: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  desc: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  time: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
})
