import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Linking,
} from 'react-native'
import { useFocusEffect } from 'expo-router'
import { Colors } from '../../constants/colors'
import { getSavedGames, getPlatformPrefs, savePlatformPrefs } from '../../services/storage'

const PLATFORMS = [
  { key: 'epic', label: 'Epic Games' },
  { key: 'steam', label: 'Steam' },
  { key: 'gog', label: 'GOG' },
  { key: 'playstation', label: 'PlayStation' },
  { key: 'xbox', label: 'Xbox' },
]

export default function ProfileScreen() {
  const [savedCount, setSavedCount] = useState(0)
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    epic: true,
    steam: true,
    gog: true,
    playstation: false,
    xbox: false,
  })

  useFocusEffect(
    useCallback(() => {
      getSavedGames().then(games => setSavedCount(games.length))
      getPlatformPrefs().then(setPrefs)
    }, [])
  )

  const togglePlatform = async (key: string) => {
    const updated = { ...prefs, [key]: !prefs[key] }
    setPrefs(updated)
    await savePlatformPrefs(updated)
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>L</Text>
          </View>
          <View>
            <Text style={styles.userName}>LootiQ Kullanıcısı</Text>
            <Text style={styles.userSub}>Ücretsiz oyun avcısı</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Text style={styles.statVal}>{savedCount}</Text>
            <Text style={styles.statLabel}>Kayıtlı</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statVal}>0</Text>
            <Text style={styles.statLabel}>Alınan</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statVal}>₺0</Text>
            <Text style={styles.statLabel}>Tasarruf</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>BİLDİRİM TERCİHLERİ</Text>
        <View style={styles.settingsCard}>
          {PLATFORMS.map((platform, index) => (
            <View
              key={platform.key}
              style={[
                styles.settingRow,
                index < PLATFORMS.length - 1 && styles.settingBorder,
              ]}
            >
              <Text style={styles.settingLabel}>{platform.label}</Text>
              <Switch
                value={prefs[platform.key] ?? false}
                onValueChange={() => togglePlatform(platform.key)}
                trackColor={{ false: '#2a2a38', true: Colors.accent }}
                thumbColor={Colors.textPrimary}
                ios_backgroundColor="#2a2a38"
              />
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>HAKKINDA</Text>
        <View style={styles.attrCard}>
          <Text style={styles.attrText}>
            Veriler{' '}
            <Text
              style={styles.attrLink}
              onPress={() => Linking.openURL('https://www.gamerpower.com')}
            >
              GamerPower
            </Text>
            {' '}tarafından sağlanmaktadır.
          </Text>
          <Text style={styles.attrSub}>
            Bu uygulama GamerPower API'sini kullanmaktadır ve GamerPower ile resmi bir bağlantısı yoktur.
          </Text>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.accentDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  userName: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  userSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statChip: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
    padding: 10,
    alignItems: 'center',
    gap: 4,
  },
  statVal: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.accent,
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 11,
    color: Colors.textMuted,
    paddingHorizontal: 16,
    paddingBottom: 10,
    letterSpacing: 0.5,
  },
  settingsCard: {
    marginHorizontal: 16,
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
    marginBottom: 20,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  settingBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.cardInner,
  },
  settingLabel: {
    fontSize: 13,
    color: '#ccc',
  },
  attrCard: {
    marginHorizontal: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
    padding: 12,
    gap: 6,
    marginBottom: 20,
  },
  attrText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  attrLink: {
    color: Colors.accent,
  },
  attrSub: {
    fontSize: 10,
    color: Colors.textMuted,
    lineHeight: 15,
  },
  spacer: {
    height: 20,
  },
})
