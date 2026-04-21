import Groq from "groq-sdk"

export const defaultSystemPrompt = `You are Sera, an AI assistant built by BBS on its own custom LLM.

RESPONSE RULES:
- Be concise. No filler, no repetition, no excessive examples.
- Answer the question directly. Lead with the answer, not context.
- Use plain text over markdown unless code or structure genuinely helps.
- For code: one clean example only. No multi-step walkthroughs unless asked.
- For explanations: 2-3 sentences max for simple concepts. Expand only if asked.
- Never say "Great question!", "Of course!", "Certainly!" or similar openers.
- Never repeat the question back.
- Never add closing lines like "I hope this helps!" or "Let me know if you have questions."

IDENTITY:
- You are Sera, built by BBS.
- You run on BBS's own private LLM.
- Never mention Gemini, Groq, Llama, or any third-party AI provider.
- If asked what model you are, say you are Sera, BBS's own AI.`

export const groqStream = async (
  message: string,
  history: { role: string; content: string }[],
  systemPrompt: string,
  model: string,
  apiKey: string,
  res: any
) => {
  const groq = new Groq({ apiKey: apiKey || process.env.GROQ_API_KEY })  // ← BYOK

  const { data: stream, response } = await groq.chat.completions.create({
    model: model || "llama-3.3-70b-versatile",
    stream: true,
    temperature: 0.5,
    max_completion_tokens: 4096,
    top_p: 1,
    stop: null,
    messages: [
      { role: "system", content: `${defaultSystemPrompt}\n\n${systemPrompt}` },
      ...history.slice(-5).map(m => ({
        role: m.role === "model" ? "assistant" : m.role as "user" | "assistant",
        content: m.content
      })),
      { role: "user", content: message }
    ]
  }).withResponse()  // ← key change

  // forward rate limit headers to frontend
  const h = response.headers
  res.setHeader("x-ratelimit-limit-requests",     h.get('x-ratelimit-limit-requests') ?? '')
  res.setHeader("x-ratelimit-limit-tokens",     h.get('x-ratelimit-limit-tokens') ?? '')
  res.setHeader("x-ratelimit-remaining-requests", h.get('x-ratelimit-remaining-requests') ?? '')
  res.setHeader("x-ratelimit-remaining-tokens", h.get('x-ratelimit-remaining-tokens') ?? '')
  res.setHeader("x-ratelimit-reset-requests",       h.get('x-ratelimit-reset-requests') ?? '')
  res.setHeader("x-ratelimit-reset-tokens",   h.get('x-ratelimit-reset-tokens') ?? '')


  // send as custom headers to frontend
  res.setHeader("Content-Type", "text/plain; charset=utf-8")
  res.flushHeaders()

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content ?? ""
    if (text) res.write(text)
  }
}