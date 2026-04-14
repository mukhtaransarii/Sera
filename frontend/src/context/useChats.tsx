import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Chat, Messages } from '../types/messages'

interface ChatStore {
  chats: Chat[]
  createChat: (messages: Messages[], title: string) => string
  updateChat: (id: string, messages: Messages[]) => void
  deleteChat: (id: string) => void
  renameChat: (id: string, title: string) => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      chats: [],
      createChat: (messages, title) => {
        const id = crypto.randomUUID()
        set(state => ({ chats: [{ id, title, messages, createdAt: Date.now() }, ...state.chats] }))
        return id
      },
      updateChat: (id, messages) =>
        set(state => ({ chats: state.chats.map(c => c.id === id ? { ...c, messages } : c) })),
      deleteChat: (id) =>
        set(state => ({ chats: state.chats.filter(c => c.id !== id) })),
      renameChat: (id, title) =>
        set(state => ({ chats: state.chats.map(c => c.id === id ? { ...c, title } : c) }))
    }),
    { name: 'chats' }
  )
)