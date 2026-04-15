import type { Messages } from '../types/types'

export const genAiResponse = async ( message: string, history: Messages[], model: string, systemPrompt: string, apiKey: string | null, onChunk: (chunk: string) => void, onError: (error: string) => void, signal?: AbortSignal ) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/chat`, {
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

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();

  // while (true) {
  //   const { done, value } = await reader.read();
  //   if (done) break;
  //   onChunk(decoder.decode(value));
  // }

  while (true) {
    if (signal?.aborted) {
      reader.cancel();
      break;
    }

    const { done, value } = await reader.read();
    if (done) break;

    onChunk(decoder.decode(value));
  }
};

export const validateApiKey = async (apiKey: string) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/validate-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey }),
  })

  const data = await res.json().catch(() => ({}))
  return data
}