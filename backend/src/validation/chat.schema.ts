import { de } from 'zod/locales';
import { z } from "zod";

export const chatSchema = z.object({
  message: z.string().min(1).max(100000),
  history: z.array(
    z.object({
      role: z.string(),
      content: z.string(),
    })
  ),
  model: z.string().default(''),
  systemPrompt: z.string().max(10000).default(''),
  apiKey: z.string().nullable().default('')
});

export const createNewChatSchema = z.object({
  message: z.string().min(1).max(100000),
  // history: z.array(
  //   z.object({
  //     role: z.string(),
  //     content: z.string(),
  //   })
  // ),
  guestId: z.string().optional(),
  model: z.string().optional(),
  apiKey: z.string().nullable().optional()
});

export type ChatInput = z.infer<typeof chatSchema>;