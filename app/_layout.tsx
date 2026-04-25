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

  const { status: existing } = await Notifications.getPermissionsAsync()
  const { status } = existing === 'granted'
    ? { status: existing }
    : await Notifications.requestPermissionsAsync()

  console.log('[Notifications] İzin durumu:', status)

  if (status !== 'granted') {
    console.log('[Notifications] İzin reddedildi.')
    return
  }

  // FCM/APNs token — development build veya production'da çalışır
  // Expo Go'da hata alınabilir, bu normaldir
  try {
    const token = await Notifications.getDevicePushTokenAsync()
    console.log('[Notifications] Device Push Token:', token.data)
  } catch (e) {
    console.log('[Notifications] Token alınamadı (dev build gerekli):', (e as Error).message)
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
