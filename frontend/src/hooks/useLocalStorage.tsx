import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored === null) return initial
      try {
        return JSON.parse(stored)
      } catch {
        return stored as T  // plain string fallback
      }
    } catch {
      return initial
    }
  })

  useEffect(() => {
    if (value === null || value === undefined) {
      localStorage.removeItem(key)
    } else if (typeof value === 'string') {
      localStorage.setItem(key, value)  // ← plain string, no JSON.stringify
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }, [key, value])

  return [value, setValue] as const
}