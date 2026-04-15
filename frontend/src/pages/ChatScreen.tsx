import { useState, useEffect, useRef } from 'react'
import type { Messages } from '../types/types'
import MessageBubble from '../components/MessageBubble'
import { Logo } from '../components/Logo'
import InputBox from '../components/InputBox'
import { genAiResponse } from '../config/api'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useChatStore } from '../context/useChats'
import { useParams, useNavigate } from 'react-router-dom'
import { defaultModel } from '../constants/models'

export default function ChatScreen() {
  const [inputValue, setInputValue] = useState<string>('');
  const [model, setModel] = useLocalStorage<string>('model', defaultModel);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { chats,  createChat, updateChat } = useChatStore();
  const { id } = useParams();
  const navigate = useNavigate(); 
  const controllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (id && !chats.find(c => c.id === id)) navigate('/chat', { replace: true })
  }, [id, chats])

  const activeMessages = chats.find(c => c.id === id)?.messages ?? [];

  const handleSend = async () => {
    if (!inputValue.trim()) return
    
    // 🔥 cancel previous request if exists
    controllerRef.current?.abort()

    const controller = new AbortController()
    controllerRef.current = controller;

    const chatId = id ?? createChat([], inputValue.slice(0, 40));
    if (!id) navigate(`/chat/${chatId}`, { replace: true })

    const base: Messages[] = [...activeMessages, { role: 'user', content: inputValue }, { role: 'model', content: '' }]
    updateChat(chatId, base)
    setInputValue('')
    setIsLoading(true)
    
    const apiKey = localStorage.getItem('apiKey') || '';
    const systemPrompt = localStorage.getItem('systemPrompt') || '';
    let streamed = '';
    try {
      await genAiResponse(inputValue, activeMessages, model, systemPrompt, apiKey,
        (chunk) => { streamed += chunk; updateChat(chatId, [...base.slice(0, -1), { role: 'model', content: streamed }]) },
        (err) => updateChat(chatId, [...base, { role: 'model', content: err, type: 'error' }]),
        controller.signal // 🔥 ADD THIS
      )
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleAbort = () => {
    controllerRef.current?.abort()
  }
  
  return (
    <div className="w-full h-full flex flex-col items-center gap-3 px-4 pt-4 bg-gray-50">

        {/* Chat Box */}
        {activeMessages.length > 0 && (
          <div className="w-full h-[80vh] md:h-[82vh] max-w-3xl overflow-y-auto">
            {activeMessages.map((m, i) => (
              <MessageBubble key={i} messages={m} isStreaming={isLoading && i === activeMessages.length - 1} />
            ))}
            {isLoading && <span className='animate-pulse'><Logo /></span>}
          </div>
        )}

        {/* Input Box */}
        <InputBox 
          inputValue={inputValue} 
          setInputValue={setInputValue} 
          handleSend={handleSend} 
          handleAbort={handleAbort}
          model={model} 
          setModel={setModel}  
          activeMessages={activeMessages}
          isLoading={isLoading}
        />
    </div>
  )
}