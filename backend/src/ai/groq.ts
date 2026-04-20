import Groq from "groq-sdk"

export const groqStream = async (
  message: string,
  history: { role: string; content: string }[],
  systemPrompt: string,
  model: string,
  apiKey: string,
  res: any
) => {
  const groq = new Groq({ apiKey: apiKey || process.env.GROQ_API_KEY })  // ← BYOK

  const stream = await groq.chat.completions.create({
    model: model || "llama-3.3-70b-versatile",
    stream: true,
    temperature: 0.5,
    max_completion_tokens: 4096,
    top_p: 1,
    stop: null,
    messages: [
      { role: "system", content: systemPrompt || "You are a helpful assistant." },
      ...history.slice(-5).map(m => ({
        role: m.role === "model" ? "assistant" : m.role as "user" | "assistant",
        content: m.content
      })),
      { role: "user", content: message }
    ]
  })

  res.setHeader("Content-Type", "text/plain; charset=utf-8")
  res.flushHeaders()

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content ?? ""
    if (text) res.write(text)
  }
}