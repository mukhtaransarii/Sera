import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { chatSchema } from "../validation/chat.schema";

const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY});

export const chatController = async (req: Request, res: Response) => {
  try {
    const result = chatSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ success: false, message: result.error.issues[0].message });

    const { message, history, model, systemPrompt } = result.data;
    
    let config = {};
    const isGEMINI = model?.split("-")[0] === "gemini";
    if(isGEMINI) config = { systemInstruction: systemPrompt, tools: [{ googleSearch: {} }] }

    const stream = await ai.models.generateContentStream({
      model: model ?? "gemini-2.5-flash-lite",
      config,
      contents: [
        ...history.slice(-5).map(m => ({ role: m.role, parts: [{ text: m.content }] })),
        { role: "user", parts: [{ text: message }] },
      ],
    });

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.flushHeaders();

    for await (const chunk of stream) if (chunk.text) res.write(chunk.text);
    res.end();
  } catch (err: any) {
    console.log(err);
    if (err.name === "ApiError" && err.status === 429) return res.status(err.status).json({ success: false, message: "API rate limit exceeded" });
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};