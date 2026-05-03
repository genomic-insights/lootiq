import { useState, useEffect, useCallback } from 'react'
import { fetchGiveaways, isPermanent } from '../services/api'
import { Giveaway } from '../types'

export const useGiveaways = (platform?: string, typeFilter?: 'game') => {
  const [data, setData] = useState<Giveaway[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await fetchGiveaways(platform)
      const list = Array.isArray(result) ? result : []
      const withoutPermanent = list.filter(g => !isPermanent(g.end_date))
      const filtered = typeFilter === 'game'
        ? withoutPermanent.filter(g => String(g.type ?? '').toLowerCase() === 'game')
        : withoutPermanent

      setData(filtered)
    } catch (err) {
      console.error('Giveaway verileri yüklenemedi:', err)
      setError('Veriler yüklenemedi. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }, [platform, typeFilter])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, refetch: load }
}
