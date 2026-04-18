import { create } from "zustand"
import { createNewChat, genAiResponse, fetchAllChats, saveChat, deleteChatApi, renameChatApi } from "../config/api.chat"
import { useAuth } from '../context/useAuth'
import type { ChatStore, Chat, Messages } from "../types/types"

const updateLastMsg = (chats: Chat[], chatId: string, content: string): Chat[] =>
  chats.map(c =>
    c._id === chatId
      ? { ...c, messages: [...c.messages.slice(0, -1), { role: "model", content }] }
      : c
  )

const isLoggedIn = () => !!useAuth.getState().user

const persist = (chats: Chat[], chatId: string, messages: Messages[]) => {
  if (isLoggedIn()) {
    saveChat(chatId, messages)   // fire and forget
  } else {
    localStorage.setItem("guestChats", JSON.stringify(chats))
  }
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  currentChatId: null,
  streaming: false,

  sendMessage: async (message, guestId, model, apiKey, systemPrompt, signal) => {
    let { chats, currentChatId } = get()
    let chat = chats.find(c => c._id === currentChatId) ?? null

    // 1. create chat if new
    if (!chat) {
      const data = await createNewChat(message, [], model, apiKey, guestId)
      if (!data) return
      chat = data.chat
      set(s => ({ chats: [chat!, ...s.chats,], currentChatId: chat!._id }))
    }

    const chatId = chat!._id

    // 2. append user msg + empty model placeholder
    set(s => ({
      streaming: true,
      chats: s.chats.map(c =>
        c._id === chatId
          ? { ...c, messages: [...c.messages, { role: "user", content: message }, { role: "model", content: "" }] }
          : c
      )
    }))

    // 3. stream
    let streamed = ""
    await genAiResponse(
      message, chat!.messages, model, apiKey, systemPrompt,
      (chunk) => {
        streamed += chunk
        set(s => ({ chats: updateLastMsg(s.chats, chatId, streamed) }))
      },
      (err) => {
        set(s => ({ streaming: false, chats: updateLastMsg(s.chats, chatId, err) }))
      },
      signal
    )

    // 4. persist
    set(s => {
      const updated = updateLastMsg(s.chats, chatId, streamed)
      persist(updated, chatId, updated.find(c => c._id === chatId)?.messages ?? [])
      return { chats: updated, streaming: false }
    })
  },

  loadChat: async () => {
    try {
      if (isLoggedIn()) {
        const data = await fetchAllChats()
        if (!data) return
        set({ chats: data.chats })
      } else {
        const chats = JSON.parse(localStorage.getItem("guestChats") ?? "[]")
        set({ chats })
      }
    } catch {
      set({ chats: [] })
    }
  },

  deleteChat: (chatId) =>
    set(s => {
      const updated = s.chats.filter(c => c._id !== chatId)
      isLoggedIn() ? deleteChatApi(chatId) : localStorage.setItem("guestChats", JSON.stringify(updated))
      return { chats: updated, currentChatId: s.currentChatId === chatId ? null : s.currentChatId }
    }),

  renameChat: (chatId, title) =>
    set(s => {
      const updated = s.chats.map(c => c._id === chatId ? { ...c, title } : c)
      isLoggedIn() ? renameChatApi(chatId, title) : localStorage.setItem("guestChats", JSON.stringify(updated))
      return { chats: updated }
    }),
}))