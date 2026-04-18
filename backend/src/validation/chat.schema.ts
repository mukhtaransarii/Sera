import { z } from "zod";

export const chatSchema = z.object({
  message: z.string().min(1).max(100000),
  history: z.array(
    z.object({
      role: z.string(),
      content: z.string(),
    })
  ),
  model: z.string().optional(),
  systemPrompt: z.string().max(10000).optional(),
  apiKey: z.string().nullable().optional()
});

export const createNewChatSchema = z.object({
  message: z.string().min(1).max(100000),
  history: z.array(
    z.object({
      role: z.string(),
      content: z.string(),
    })
  ),
  guestId: z.string().optional(),
  model: z.string().optional(),
  apiKey: z.string().nullable().optional()
});

export type ChatInput = z.infer<typeof chatSchema>;