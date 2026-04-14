import type { Messages } from '../types/messages'

export const genAiResponse = async ( message: string, history: Messages[], model: string, systemPrompt: string, onChunk: (chunk: string) => void, onError: (error: string) => void ) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history, model, systemPrompt }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    onError(err?.message ?? "Something went wrong.");
    return;
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value));
  }
};