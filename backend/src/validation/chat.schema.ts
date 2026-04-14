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
  systemPrompt: z.string().max(5000).optional(),
});

export type ChatInput = z.infer<typeof chatSchema>;