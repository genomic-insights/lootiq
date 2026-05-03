import { Giveaway } from '../types'

const BASE = 'https://www.gamerpower.com/api'

const fetchFromPlatform = async (platform?: string): Promise<Giveaway[]> => {
  const url = platform
    ? `${BASE}/giveaways?platform=${platform}`
    : `${BASE}/giveaways`

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`API hatası: ${res.status}`)
  }

  return res.json()
}

export const fetchGiveaways = async (platform?: string): Promise<Giveaway[]> => {
  if (platform === 'console') {
    const results = await Promise.allSettled([
      fetchFromPlatform('ps4'),
      fetchFromPlatform('xbox-one'),
    ])
    return results
      .filter((r): r is PromiseFulfilledResult<Giveaway[]> => r.status === 'fulfilled')
      .flatMap(r => r.value)
  }

  return fetchFromPlatform(platform)
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

export const getTypeLabel = (type: string): string => {
  switch (String(type ?? '').toLowerCase()) {
    case 'game': return 'Oyun'
    case 'dlc': return 'DLC/Paket'
    case 'early access': return 'Erken Erişim'
    default: return 'Diğer'
  }
}

export const parseWorthValue = (worth: string): number | null => {
  if (!worth || worth === 'N/A') return null
  const cleaned = worth.replace(/[^0-9.]/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

export const calculateTotalWorth = (
  list: Giveaway[]
): { total: number; hasUnknown: boolean } => {
  let total = 0
  let hasUnknown = false

  for (const item of list) {
    const val = parseWorthValue(item.worth)
    if (val !== null) {
      total += val
    } else {
      hasUnknown = true
    }
  }

  return { total, hasUnknown }
}
