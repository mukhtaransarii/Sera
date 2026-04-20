// src/ai/index.ts
import { groqStream } from "./groq"

const LLM = "groq"  // swap this to change provider globally

export const streamAI = async (
  message: string,
  history: { role: string; content: string }[],
  systemPrompt: string,
  model: string,
  apiKey: string,
  res: any
) => {
  switch (LLM) {
    case "groq":   return groqStream(message, history, systemPrompt, model, apiKey, res)
    // case "gemini": return geminiStream(message, history, systemPrompt, model, apiKey, res)
    // case "openai": return openaiStream(message, history, systemPrompt, model, apiKey, res)
    default:       return groqStream(message, history, systemPrompt, model, apiKey, res)
  }
}