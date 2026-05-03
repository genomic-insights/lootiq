import { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

async function setupNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Varsayılan',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#7F77DD',
    })
  }
}

export default function RootLayout() {
  const router = useRouter()

  useEffect(() => {
    setupNotifications()

    // Bildirime tıklanınca ilgili oyun detayına yönlendir
    const sub = Notifications.addNotificationResponseReceivedListener(response => {
      const gameId = response.notification.request.content.data?.gameId
      if (gameId) {
        router.push(`/game/${gameId}`)
      }
    })

    return () => sub.remove()
  }, [])

  return (
    <>
      <StatusBar style="light" backgroundColor="#0f0f14" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="game/[id]"
          options={{ animation: 'slide_from_right' }}
        />
      </Stack>
    </>
  )
}
