import { Router } from "express";
import { createNewChat, chatController,  fetchAllChats, saveChatMessages, deleteChatController, renameChatController, validateKey } from "../controllers/chat.controller";
import { optionalAuth, authMiddleware } from "../middleware/auth";

const router = Router();

router.post('/chat/createNewChat', optionalAuth, createNewChat);
router.post("/chat/genAiResponse", chatController);
router.get('/chats/fetchAllChats', authMiddleware, fetchAllChats)
router.patch('/chat/:chatId/save', authMiddleware, saveChatMessages)
router.delete('/chat/:chatId/delete', authMiddleware, deleteChatController)
router.patch('/chat/:chatId/rename', authMiddleware, renameChatController)
router.post("/validate-key",  validateKey);

export default router;