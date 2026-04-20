import { Request, Response } from "express";
import { chatSchema, createNewChatSchema } from "../validation/chat.schema";
import Chat from "../models/chat";
import Groq from "groq-sdk"
import { streamAI } from "../ai/index";

// create new chat
export const createNewChat = async (req: Request, res: Response) => {
  try {
    const result = createNewChatSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ success: false, message: result.error.issues[0].message });

    const { message, guestId, model, apiKey } = result.data;

    if (!req.user && !guestId) return res.status(400).json({ success: false, message: "guestId required" })

    // generate title using groq
    const groq = new Groq({ apiKey: apiKey || process.env.GROQ_API_KEY_FOR_TITLE })
    const data = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_completion_tokens: 20,
      messages: [{ role: "user", content: `Create a short 3-5 word title for this message. Return only the title, no extra words: ${message}` }]
    })
    const title = (data.choices[0]?.message?.content ?? "New Chat").trim().replace(/["']/g, '').split('\n')[0].trim();

    // guest user — no db
    if (!req.user) return res.json({ 
      success: true, 
      message: "New Guest Chat Created", 
      chat: { _id: crypto.randomUUID(), guestId, title, messages: [], createdAt: Date.now() } 
    });

    // logged in user — save to db
    const chat = await Chat.create({ userId: req.user.id, title, messages: [] })
    res.json({ success: true, message: "New Chat Created", chat });

  } catch (err: any) {
    console.log(err)
    if (err?.status === 429) return res.status(429).json({ success: false, message: "Rate limit exceeded" })
    if (err?.status === 401) return res.status(401).json({ success: false, message: "Invalid API key" })
    res.status(500).json({ success: false, message: "Something went wrong" })
  }
};

// chat
export const chatController = async (req: Request, res: Response) => {
  try {
    const result = chatSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ success: false, message: result.error.issues[0].message });

    const { message, history, model, systemPrompt, apiKey } = result.data;

    await streamAI(message, history, systemPrompt, model, apiKey ?? '', res)
    res.end();
  } catch (err: any) {
    // console.log(err)
    if (res.headersSent) {
      res.write("\n[Something went wrong]")
      res.end()
      return
    }
    if (err?.status === 429) return res.status(429).json({ success: false, message: "Rate limit exceeded" })
    if (err?.status === 503) return res.status(503).json({ success: false, message: "Gemini is overloaded, try again" })
    res.status(500).json({ success: false, message: "Something went wrong" })
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

    const groq = new Groq({ apiKey });
    await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",  // cheapest/fastest just for validation
      max_completion_tokens: 1,
      messages: [{ role: "user", content: "hi" }]
    });

    return res.json({ success: true, message: "API key is valid" });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: "Invalid API key" });
  }
};