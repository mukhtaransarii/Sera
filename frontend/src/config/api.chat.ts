import type { Messages } from '../types/types'
import { useChatStore } from '../context/useChat'

// 🔥 create new chat
export const createNewChat = async (
  message: string, // for genrating title
  history: Messages[], // for check isNewChat
  model: string,  // Optional
  apiKey: string, // Optional
  guestId: string, // guestUser
) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/chat/createNewChat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message, history, guestId, model, apiKey }),
    });
    const data = await res.json();
    console.log(data)

    if(!data.success) return
    return data;
  } catch (error) {
    console.log("Something went wrong", error)
  }
};

// 🔥 generate ai response
export const genAiResponse = async ( 
  message: string, // for genrating ai res
  history: Messages[], // for ai remember prev convo
  model: string, // optional important
  apiKey: string, // optional
  systemPrompt: string, // optional
  onChunk: (chunk: string) => void, // get stream
  onError: (error: string) => void, // get error 
  signal?: AbortSignal, // for cancel request
) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/chat/genAiResponse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history, model, systemPrompt, apiKey }),
      signal
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      onError(err?.message ?? "Something went wrong.");
      return;
    }

    // read rate limits from this request's headers
    const rateLimits = {
      limitRequests:     res.headers.get('x-ratelimit-limit-requests'),
      limitTokens:     res.headers.get('x-ratelimit-limit-tokens'),
      remainingRequests: res.headers.get('x-ratelimit-remaining-requests'),
      remainingTokens:       res.headers.get('x-ratelimit-remaining-tokens'),
      resetRequests:   res.headers.get('x-ratelimit-reset-requests'),
      resetTokens:   res.headers.get('x-ratelimit-reset-tokens'),
    }
    if (rateLimits) {
      useChatStore.setState({ rateLimits })
    }
    console.log(rateLimits)

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      if (signal?.aborted) {
        reader.cancel();
        break;
      }
      const { done, value } = await reader.read();
      if (done) break;
      onChunk(decoder.decode(value));
    }
  } catch (error) {
    console.log("Something went wrong", error)
  }
};

// fetch all chats
export const fetchAllChats = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/chats/fetchAllChats`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    console.log(data)
    
    if(!data.success) return
    return data
  } catch (error) {
    console.log("Something went wrong", error)
  }
};

// save chat
export const saveChat = async (chatId: string, messages: Messages[]) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/chat/${chatId}/save`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ messages }),
    });
    const data = await res.json();
    if (!data.success) return

    console.log(data)
    return data
  } catch (error) {
    console.log("Something went wrong", error)
  }
};

//  delete chat
export const deleteChatApi = async (chatId: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/chat/${chatId}/delete`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    if (!data.success) return

    console.log(data)
    return data
  } catch (error) {
    console.log("Something went wrong", error)
  }
};

// rename chat
export const renameChatApi = async (chatId: string, title: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/chat/${chatId}/rename`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title }),
    });
    const data = await res.json();
    if (!data.success) return

    console.log(data)
    return data
  } catch (error) {
    console.log("Something went wrong", error)
  }
};

// validate API key
export const validateApiKey = async (apiKey: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/validate-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey }),
    })
    const data = await res.json()
    if(!data.success) return
    console.log(data)

    return data
  } catch (error) {
    console.log("Something went wrong",  error)
  }
}