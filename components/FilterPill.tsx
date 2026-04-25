import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Colors } from '../constants/colors'

interface Props {
  label: string
  active: boolean
  onPress: () => void
}

export const FilterPill: React.FC<Props> = ({ label, active, onPress }) => (
  <TouchableOpacity
    style={[styles.pill, active && styles.pillActive]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  pill: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#333',
  },
  pillActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  label: {
    fontSize: 12,
    color: '#aaa',
  },
  labelActive: {
    color: Colors.textPrimary,
  },
})
