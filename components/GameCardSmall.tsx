import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Giveaway } from '../types'
import { Colors } from '../constants/colors'
import { calcTimeLeft, isPermanent, getTypeLabel } from '../services/api'

export const ITEM_HEIGHT = 180

interface Props {
  game: Giveaway
}

export const GameCardSmall: React.FC<Props> = ({ game }) => {
  const router = useRouter()
  const permanent = isPermanent(game.end_date)
  const timeLeft = calcTimeLeft(game.end_date)

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/game/${game.id}`)}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: game.thumbnail }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{game.title}</Text>
        <Text style={styles.platform} numberOfLines={1}>
          {game.platforms} · {getTypeLabel(game.type)}
        </Text>
        {permanent ? (
          <Text style={styles.perm}>Kalıcı Ücretsiz</Text>
        ) : (
          <Text style={styles.time}>{timeLeft}</Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 180,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
    margin: 5,
  },
  image: {
    width: '100%',
    height: 100,
  },
  body: {
    padding: 8,
    gap: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textPrimary,
    lineHeight: 16,
  },
  platform: {
    fontSize: 10,
    color: '#666',
  },
  time: {
    fontSize: 10,
    color: Colors.danger,
  },
  perm: {
    fontSize: 10,
    color: Colors.success,
  },
})
