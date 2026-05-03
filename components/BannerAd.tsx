// react-native-google-mobile-ads kurulup eas build sonrası gerçek reklam aktif edilecek.
// Şimdilik reklam alanını görünür tut.
import { View, Text, StyleSheet } from 'react-native'

export const HomeBannerAd = () => (
  <View style={styles.container}>
    <Text style={styles.label}>reklam</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    height: 50,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#14141c',
    borderWidth: 0.5,
    borderColor: '#1e1e28',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    color: '#2e2e3e',
    letterSpacing: 1,
  },
})
