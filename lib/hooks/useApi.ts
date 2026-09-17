'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { apiClient } from '@/lib/api-client'

// ─── Generic hook ───────────────────────────────────────────────────────────

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Generic hook that calls an async apiClient method on mount (and on refetch).
 * Falls back to `fallback` if the request fails so pages always have data.
 */
export function useApiData<T>(
  fetcher: () => Promise<{ success: boolean; data?: T; error?: string }>,
  fallback: T,
  deps: unknown[] = []
): ApiState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const counter = useRef(0)

  const fetch = useCallback(async () => {
    const id = ++counter.current
    setLoading(true)
    setError(null)
    try {
      const res = await fetcher()
      if (id !== counter.current) return // stale
      if (res.success && res.data !== undefined) {
        setData(res.data)
      } else {
        setError(res.error ?? 'Unknown error')
        setData(fallback)
      }
    } catch (e) {
      if (id !== counter.current) return
      setError(e instanceof Error ? e.message : 'Network error')
      setData(fallback)
    } finally {
      if (id === counter.current) setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}

// ─── Typed convenience hooks ─────────────────────────────────────────────────

export function useZones() {
  return useApiData<any[]>(() => apiClient.getZones() as any, [])
}

export function useZone(id: string) {
  return useApiData<any>(() => apiClient.getZone(id) as any, null, [id])
}

export function useAlerts() {
  return useApiData<any[]>(() => apiClient.getAlerts() as any, [])
}

export function useIncidents() {
  return useApiData<any[]>(() => apiClient.getIncidents() as any, [])
}

export function useSensors() {
  return useApiData<any[]>(() => apiClient.getSensors() as any, [])
}

export function useWeather() {
  return useApiData<any>(() => apiClient.getWeather() as any, null)
}

export function useDashboardAnalytics() {
  return useApiData<any>(() => apiClient.getDashboardAnalytics() as any, null)
}

export function useHistoricalTrends() {
  return useApiData<any>(() => apiClient.getHistoricalTrends() as any, null)
}

export function useRiskDistribution() {
  return useApiData<any>(() => apiClient.getRiskDistribution() as any, null)
}

// ─── Action hooks (one-shot, not auto-fetched) ───────────────────────────────

interface ActionState<T> {
  data: T | null
  loading: boolean
  error: string | null
  execute: (...args: any[]) => Promise<T | null>
}

function useApiAction<T>(
  action: (...args: any[]) => Promise<{ success: boolean; data?: T; error?: string }>
): ActionState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setLoading(true)
      setError(null)
      try {
        const res = await action(...args)
        if (res.success && res.data !== undefined) {
          setData(res.data)
          return res.data
        } else {
          setError(res.error ?? 'Unknown error')
          return null
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Network error')
        return null
      } finally {
        setLoading(false)
      }
    },
    [action]
  )

  return { data, loading, error, execute }
}

export function useCalculateRisk() {
  return useApiAction<any>((input) => apiClient.calculateRisk(input) as any)
}

export function useSimulateDisaster() {
  return useApiAction<any>((input) => apiClient.simulateDisaster(input) as any)
}

export function useCalculateSafeRoutes() {
  return useApiAction<any>((input) => apiClient.calculateSafeRoutes(input) as any)
}

export function useAnalyzeImpact() {
  return useApiAction<any>((input) => apiClient.analyzeImpact(input) as any)
}
