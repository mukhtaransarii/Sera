import { create } from "zustand"
import { login, logout, signup, me } from "../config/api.auth"
import type { AuthState } from '../types/types'


export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,

  signup: async (name, email, password) => {
    set({ loading: true })

    const data = await signup(name, email, password);
    if (!data) return set({ loading: false })
    set({ user: data.user, loading: false })
  },

  login: async (email, password) => {
    set({ loading: true })

    const data = await login(email, password);
    if (!data) return set({ loading: false })
    set({ user: data.user, loading: false })
  },

  logout: async () => {
    const data = await logout();
    if(!data) return
    set({ user: null })
  },

  me: async () => {
    try {
      const data = await me()
      set({ user: data?.user ?? null })
    } catch {
      set({ user: null })
    } finally {
      set({ loading: false })
    }
  },
}))
