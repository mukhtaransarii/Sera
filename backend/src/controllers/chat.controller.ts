import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { chatSchema, createNewChatSchema } from "../validation/chat.schema";
import Chat from "../models/chat";

// create new chat 
export const createNewChat = async (req: Request, res: Response) => {
  try { 
      const result = createNewChatSchema.safeParse(req.body);
      if (!result.success) return res.status(400).json({ success: false, message: result.error.issues[0].message });

      const { message, history, guestId, model, apiKey } = result.data;
      if (!req.user && !guestId) return res.status(400).json({ success: false, message: "guestId required" })
      
      // genrating title through ai.
      const ai = new GoogleGenAI({ apiKey: apiKey || process.env.GEMINI_API_KEY });
    
      const data = await ai.models.generateContent({
        model: model ?? "gemini-2.5-flash-lite",
        contents: [{ role: "user", parts: [{ text: `Create a short 3-5 word title for the message below. Do NOT reuse words like "title", "generate", or anything from this instruction. Return only the title Message: ${message}`}] }]
      })
      const title = (data.text || "").trim().replace(/["']/g, '').replace(/^(title:|here.*?:)/i, '').split('\n')[0].trim();
      
      const newChat = await Chat.create({
        userId: req.user?.id || null,
        guestId: req.user ? null : guestId,
        title: title,
        messages: []
      })
      
      if(!newChat) return res.json({ success: false, message: "chat not created" });

      res.json({ success: true, message: "New chat created successfully", chat: newChat });
  } catch (err: any) {
    if (err.name === "ApiError" && err.status === 429) return res.status(err.status).json({ success: false, message: "API rate limit exceeded" });
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// chat
export const chatController = async (req: Request, res: Response) => {
  try {
    const result = chatSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ success: false, message: result.error.issues[0].message });

    const { message, history, model, systemPrompt, apiKey } = result.data;
    const ai = new GoogleGenAI({ apiKey: apiKey || process.env.GEMINI_API_KEY });
    
    let config = {};
    if(model?.startsWith("gemini")) config = { systemInstruction: systemPrompt, tools: [{ googleSearch: {} }] }
    
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

// fetch all chats
export const fetchAllChats = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" })

    const chats = await Chat.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json({ success: true, message: "Chats fetched", chats })
  } catch {
    res.status(500).json({ success: false, message: "Something went wrong" })
  }
}

// save chat messages
export const saveChatMessages = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" })

    const { chatId } = req.params
    const { messages } = req.body

    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId: req.user.id },
      { messages },
      { returnDocument: 'after' }
    )

    if (!chat) return res.status(404).json({ success: false, message: "Chat not found" })
    res.json({ success: true, message: "Chat saved", chat })
  } catch {
    res.status(500).json({ success: false, message: "Something went wrong" })
  }
}

// delete chat
export const deleteChatController = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" })

    const { chatId } = req.params

    const chat = await Chat.findOneAndDelete({ _id: chatId, userId: req.user.id })
    if (!chat) return res.status(404).json({ success: false, message: "Chat not found" })

    res.json({ success: true, message: "Chat deleted" })
  } catch {
    res.status(500).json({ success: false, message: "Something went wrong" })
  }
}

// rename chat
export const renameChatController = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" })

    const { chatId } = req.params
    const { title } = req.body

    if (!title?.trim()) return res.status(400).json({ success: false, message: "Title required" })

    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId: req.user.id },
      { title: title.trim() },
      {returnDocument: 'after' }
    )

    if (!chat) return res.status(404).json({ success: false, message: "Chat not found" })
    res.json({ success: true, message: "Chat renamed", chat })
  } catch {
    res.status(500).json({ success: false, message: "Something went wrong" })
  }
}

// validate API key
export const validateKey = async (req: Request, res: Response) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey?.trim()) return res.status(400).json({ success: false, message: "API key required" });
    
    const ai = new GoogleGenAI({ apiKey });

    await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [{ role: "user", parts: [{ text: "hi" }] }],
    });

    res.json({ success: true, message: "API key is valid" });
  } catch (err: any) {
    res.status(400).json({ success: false, message: "Invalid API key" });
  }
};