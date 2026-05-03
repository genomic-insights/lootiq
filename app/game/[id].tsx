import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Linking,
  Share,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Svg, { Path } from 'react-native-svg'
import { fetchGiveaway, calcTimeLeft, isPermanent, getTypeLabel } from '../../services/api'
import { saveGame, removeSavedGame, isGameSaved } from '../../services/storage'
import { Colors } from '../../constants/colors'
import { Giveaway } from '../../types'

export default function GameDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [game, setGame] = useState<Giveaway | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchGiveaway(Number(id))
        setGame(data)
        const s = await isGameSaved(data.id)
        setSaved(s)
      } catch {
        setError('Oyun yüklenemedi. Lütfen tekrar deneyin.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  const handleShare = async () => {
    if (!game) return

    await Share.share({
      message: `🎮 ${game.title} şu an ücretsiz kampanya olarak mevcut! ${game.platforms} üzerinden al: ${game.open_giveaway_url} — LootiQ uygulamasından`,
    })
  }

  const handleSave = async () => {
    if (!game) return

    if (saved) {
      await removeSavedGame(game.id)
      setSaved(false)
    } else {
      await saveGame({
        id: game.id,
        title: game.title,
        thumbnail: game.thumbnail,
        platforms: game.platforms,
        end_date: game.end_date,
        open_giveaway_url: game.open_giveaway_url,
      })
      setSaved(true)
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    )
  }

  if (error || !game) {
    return (
      <View style={styles.screen}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error ?? 'Oyun bulunamadı'}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => router.back()}>
            <Text style={styles.retryText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const permanent = isPermanent(game.end_date)
  const timeLeft = calcTimeLeft(game.end_date)

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: game.image || game.thumbnail }}
            style={styles.heroImage}
            resizeMode="cover"
            defaultSource={require('../../assets/placeholder.png')}
          />

          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M19 12H5M5 12l7-7M5 12l7 7"
                stroke={Colors.textPrimary}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>

          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Ücretsiz</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{game.title}</Text>
          <Text style={styles.subtitle}>{game.platforms}</Text>

          <View style={styles.chipsRow}>
            <View style={styles.chip}>
              <Text style={styles.chipLabel}>Platform</Text>
              <Text style={styles.chipVal} numberOfLines={1}>
                {game.platforms}
              </Text>
            </View>

            <View style={styles.chip}>
              <Text style={styles.chipLabel}>Değer</Text>
              <Text style={styles.chipVal}>
                {game.worth !== 'N/A' ? game.worth : 'Bilinmiyor'}
              </Text>
            </View>

            <View style={styles.chip}>
              <Text style={styles.chipLabel}>Tür</Text>
              <Text style={styles.chipVal} numberOfLines={1}>
                {getTypeLabel(game.type)}
              </Text>
            </View>
          </View>

          {permanent ? (
            <View style={styles.permBox}>
              <Text style={styles.permText}>Kalıcı Ücretsiz</Text>
            </View>
          ) : (
            <View style={styles.timerBox}>
              <Text style={styles.timerLabel}>Kalan Süre</Text>
              <Text style={styles.timerVal}>{timeLeft}</Text>
            </View>
          )}

          <Text style={styles.descTitle}>Açıklama</Text>
          <Text style={styles.desc}>{game.description}</Text>

          {game.instructions ? (
            <>
              <Text style={styles.descTitle}>Nasıl Alınır?</Text>
              <Text style={styles.desc}>{game.instructions}</Text>
            </>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.grabBtn}
          onPress={() => Linking.openURL(game.open_giveaway_url)}
          activeOpacity={0.85}
        >
          <Text style={styles.grabText}>Platforma Git →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, saved && styles.saveBtnActive]}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={[styles.saveText, saved && styles.saveTextActive]}>
            {saved ? 'Kayıtlarda ✓' : 'Kayıtlara Ekle'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Text style={styles.saveText}>🔗 Paylaş</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  center: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  scrollContent: {
    paddingBottom: 210,
  },
  heroContainer: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 140,
    backgroundColor: Colors.cardInner,
  },
  backBtn: {
    position: 'absolute',
    top: 36,
    left: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.cardInner,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadge: {
    position: 'absolute',
    top: 34,
    right: 10,
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  heroBadgeText: {
    color: Colors.textPrimary,
    fontSize: 11,
  },
  body: {
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flex: 1,
    backgroundColor: Colors.cardInner,
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 12,
    gap: 2,
  },
  chipLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  chipVal: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  timerBox: {
    backgroundColor: '#1a1520',
    borderWidth: 0.5,
    borderColor: '#E24B4A44',
    borderRadius: 12,
    padding: 10,
    paddingHorizontal: 14,
    gap: 2,
  },
  timerLabel: {
    fontSize: 11,
    color: Colors.danger,
  },
  timerVal: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.danger,
  },
  permBox: {
    backgroundColor: '#0f1f1a',
    borderWidth: 0.5,
    borderColor: '#1D9E7544',
    borderRadius: 12,
    padding: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  permText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.success,
  },
  descTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
  desc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 28,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    gap: 8,
    borderTopWidth: 0.5,
    borderTopColor: Colors.cardBorder,
    backgroundColor: Colors.bg,
  },
  grabBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    padding: 13,
    alignItems: 'center',
  },
  grabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  saveBtn: {
    borderWidth: 0.5,
    borderColor: '#333',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
  },
  saveBtnActive: {
    borderColor: Colors.success,
  },
  saveText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  saveTextActive: {
    color: Colors.success,
  },
  errorText: {
    fontSize: 14,
    color: Colors.textSecondary,
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
  },
})