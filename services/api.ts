import { Giveaway } from '../types'

const BASE = 'https://www.gamerpower.com/api'

export const fetchGiveaways = async (platform?: string): Promise<Giveaway[]> => {
  const url = platform
    ? `${BASE}/giveaways?platform=${platform}`
    : `${BASE}/giveaways`

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`API hatası: ${res.status}`)
  }

  return res.json()
}

export const fetchGiveaway = async (id: number): Promise<Giveaway> => {
  const res = await fetch(`${BASE}/giveaway?id=${id}`)

  if (!res.ok) {
    throw new Error(`Oyun bulunamadı: ${res.status}`)
  }

  return res.json()
}

export const calcTimeLeft = (endDate: string): string => {
  if (!endDate || endDate === 'N/A') return 'Kalıcı'

  const diff = new Date(endDate).getTime() - Date.now()

  if (diff <= 0) return 'Süresi doldu'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) return `${days} gün ${hours} saat`

  return `${hours} saat`
}

export const isPermanent = (endDate: string): boolean => {
  return !endDate || endDate === 'N/A'
}

export const getPlatformLabel = (platforms: string): string => {
  if (!platforms) return 'Bilinmiyor'

  const lower = platforms.toLowerCase()

  if (lower.includes('epic')) return 'Epic Games'
  if (lower.includes('steam')) return 'Steam'
  if (lower.includes('gog')) return 'GOG'
  if (lower.includes('playstation') || lower.includes('ps')) return 'PlayStation'
  if (lower.includes('xbox')) return 'Xbox'

  return platforms
}