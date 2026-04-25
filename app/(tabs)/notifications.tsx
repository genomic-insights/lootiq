import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'
import { useFocusEffect } from 'expo-router'
import { Colors } from '../../constants/colors'
import { NotificationItem } from '../../components/NotificationItem'
import { getNotifications } from '../../services/storage'
import { NotificationItem as NotificationItemType } from '../../types'

export default function NotificationsScreen() {
  const [items, setItems] = useState<NotificationItemType[]>([])
  const [loading, setLoading] = useState(true)

  const loadNotifications = useCallback(async () => {
    const data = await getNotifications()
    setItems(data)
    setLoading(false)
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadNotifications()
    }, [loadNotifications])
  )

  const today = items.filter(n => n.section === 'today')
  const yesterday = items.filter(n => n.section === 'yesterday')

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bildirimler</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.accent} />
          </View>
        ) : items.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>Henüz bildirim yok</Text>
            <Text style={styles.emptyDesc}>
              Yeni ücretsiz oyunlar çıktığında burada görünecek
            </Text>
          </View>
        ) : (
          <>
            {today.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>BUGÜN</Text>
                {today.map(item => (
                  <NotificationItem
                    key={item.id}
                    item={item}
                    onRead={loadNotifications}
                  />
                ))}
              </>
            )}
            {yesterday.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>DÜNDEN</Text>
                {yesterday.map(item => (
                  <NotificationItem
                    key={item.id}
                    item={item}
                    onRead={loadNotifications}
                  />
                ))}
              </>
            )}
          </>
        )}
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
  sectionLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    paddingHorizontal: 16,
    paddingBottom: 8,
    letterSpacing: 0.5,
  },
  center: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
    gap: 10,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  emptyDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  spacer: {
    height: 20,
  },
})
