// for Vercel Only
// otherwise run main file /src/index.ts

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { chatController } from '../src/controllers/chat.controller'

export default function handler(req: VercelRequest, res: VercelResponse) {
  return chatController(req as any, res as any)
}