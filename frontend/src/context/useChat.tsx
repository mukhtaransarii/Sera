import { create } from "zustand"
import { createNewChat, genAiResponse, fetchAllChats, saveChat, deleteChatApi, renameChatApi } from "../config/api.chat"
import { useAuth } from './useAuth'
import type { ChatStore, Chat } from "../types/types"

const updateLastMsg = (chats: Chat[], chatId: string, content: string): Chat[] =>
  chats.map(c =>
    c._id === chatId
      ? { ...c, messages: [...c.messages.slice(0, -1), { role: "model", content }] }
      : c
  )

const isLoggedIn = () => !!useAuth.getState().user

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  streaming: false,
  newChatId: null,  // ← set when new chat created, ChatScreen watches and navigates

  sendMessage: async (message, guestId, model, apiKey, systemPrompt, currentChatId, signal) => {
    let chat = get().chats.find(c => c._id === currentChatId) ?? null

    // 1. create chat if new
    if (!chat) {
      const data = await createNewChat(message, [], model, apiKey, guestId)
      if (!data) return
      chat = data.chat
      set(s => ({ chats: [chat!, ...s.chats], newChatId: chat!._id }))
      // ↑ reactive — ChatScreen sees newChatId and navigates instantly
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
      (err) => set(s => ({ streaming: false, chats: updateLastMsg(s.chats, chatId, err) })),
      signal
    )

    // 4. persist
    set(s => {
      const updated = updateLastMsg(s.chats, chatId, streamed)
      isLoggedIn()
        ? saveChat(chatId, updated.find(c => c._id === chatId)?.messages ?? [])
        : localStorage.setItem("guestChats", JSON.stringify(updated))
      return { chats: updated, streaming: false }
    })
  },

  loadChat: async () => {
    if (get().streaming) return
    try {
      if (isLoggedIn()) {
        const data = await fetchAllChats()
        if (data) set({ chats: data.chats })
      } else {
        set({ chats: JSON.parse(localStorage.getItem("guestChats") ?? "[]") })
      }
    } catch {
      set({ chats: [] })
    }
  },

  deleteChat: (chatId) =>
    set(s => {
      const updated = s.chats.filter(c => c._id !== chatId)
      isLoggedIn() ? deleteChatApi(chatId) : localStorage.setItem("guestChats", JSON.stringify(updated))
      return { chats: updated }
    }),

  renameChat: (chatId, title) =>
    set(s => {
      const updated = s.chats.map(c => c._id === chatId ? { ...c, title } : c)
      isLoggedIn() ? renameChatApi(chatId, title) : localStorage.setItem("guestChats", JSON.stringify(updated))
      return { chats: updated }
    }),
}))