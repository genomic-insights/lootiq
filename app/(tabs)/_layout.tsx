import { Tabs } from 'expo-router'
import { StyleSheet } from 'react-native'
import { Colors } from '../../constants/colors'
import { ExploreIcon, BellIcon, BookmarkIcon, ProfileIcon } from '../../components/TabIcon'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: '#555',
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Keşfet',
          tabBarIcon: ({ color }) => <ExploreIcon color={color} />,
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Bildirimler',
          tabBarIcon: ({ color }) => <BellIcon color={color} />,
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          title: 'Kayıtlı',
          tabBarIcon: ({ color }) => <BookmarkIcon color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.bg,
    borderTopWidth: 0.5,
    borderTopColor: Colors.cardBorder,
    elevation: 0,
    height: 102,
    paddingBottom: 38,
    paddingTop: 8,
  },
  label: {
    fontSize: 10,
  },
})