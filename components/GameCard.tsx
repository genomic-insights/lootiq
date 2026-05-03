import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Giveaway } from '../types'
import { Colors } from '../constants/colors'
import { calcTimeLeft, getTypeLabel, sanitizePlatformsForUI } from '../services/api'

interface Props {
  game: Giveaway
}

export const GameCard: React.FC<Props> = ({ game }) => {
  const router = useRouter()
  const timeLeft = calcTimeLeft(game.end_date)
  const [imgError, setImgError] = useState(false)

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/game/${game.id}`)}
      activeOpacity={0.85}
    >
      {imgError ? (
        <View style={styles.imagePlaceholder} />
      ) : (
        <Image
          source={{ uri: game.thumbnail }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setImgError(true)}
        />
      )}
      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.title} numberOfLines={1}>{game.title}</Text>
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>Ücretsiz</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.metaLeft}>
            <Text style={styles.platform}>{sanitizePlatformsForUI(game.platforms)}</Text>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{getTypeLabel(game.type)}</Text>
            </View>
          </View>
          {timeLeft !== 'Kalıcı' && (
            <Text style={styles.timeLeft}>{timeLeft}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
  },
  image: {
    width: '100%',
    height: 100,
  },
  imagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: Colors.cardInner,
  },
  info: {
    padding: 10,
    paddingHorizontal: 12,
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  freeBadge: {
    backgroundColor: Colors.accent,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  freeBadgeText: {
    color: Colors.textPrimary,
    fontSize: 10,
  },
  permBadge: {
    backgroundColor: Colors.success,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  permBadgeText: {
    color: Colors.textPrimary,
    fontSize: 10,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  platform: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  typeBadge: {
    backgroundColor: Colors.cardInner,
    borderRadius: 4,
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderWidth: 0.5,
    borderColor: '#333',
  },
  typeBadgeText: {
    fontSize: 9,
    color: Colors.textSecondary,
  },
  timeLeft: {
    fontSize: 11,
    color: Colors.danger,
  },
})
