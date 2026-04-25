import { useState, useEffect, useCallback } from 'react'
import { fetchGiveaways } from '../services/api'
import { Giveaway } from '../types'

const isDLC = (g: Giveaway): boolean => {
  const hay = `${g.title ?? ''} ${g.description ?? ''}`.toLowerCase()
  return hay.includes('dlc')
}

const filterGames = (list: Giveaway[]): Giveaway[] => {
  if (!Array.isArray(list)) return []

  return list.filter(g => {
    const type = String(g.type ?? '').toLowerCase()
    const isGame = !type || type === 'game'

    return isGame && !isDLC(g)
  })
}

export const useGiveaways = (platform?: string) => {
  const [data, setData] = useState<Giveaway[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await fetchGiveaways(platform)
      const filtered = filterGames(result)

      setData(filtered)
    } catch (err) {
      console.error('Giveaway verileri yüklenemedi:', err)
      setError('Veriler yüklenemedi. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }, [platform])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, refetch: load }
}