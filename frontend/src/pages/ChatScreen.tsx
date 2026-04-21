import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import MessageBubble from '../components/MessageBubble'
import InputBox from '../components/InputBox'
import LoginPopup from '../components/PopupLogin'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useChatStore } from '../context/useChat'
import { defaultModel, MODELS } from '../constants/models'
import { Logo } from '../components/Logo'

export default function ChatScreen() {
  const [inputValue, setInputValue] = useState('')
  const [model, setModel] = useLocalStorage('model', defaultModel)
  const { chats, streaming, newChatId, sendMessage, loadChat, rateLimits } = useChatStore()
  const navigate = useNavigate()
  const { id } = useParams()
  
  // source of truth — match URL param to chat
  const messages = chats.find(c => c._id === id)?.messages ?? []

  useEffect(() => {
    loadChat()

    // check if saved model is valid
    const savedModel = localStorage.getItem('model')
    const isValid = MODELS.some(m => m.value === savedModel)
    if (!isValid) localStorage.setItem('model', defaultModel)
  }, [])

  useEffect(() => {
    if (newChatId) {
      navigate(`/chat/${newChatId}`)
      useChatStore.setState({ newChatId: null })
    }
  }, [newChatId])

  const controllerRef = useRef<AbortController | null>(null)

  const handleSend = async () => {
    if (!inputValue.trim() || streaming) return

    const message = inputValue
    setInputValue('')

    controllerRef.current?.abort()
    controllerRef.current = new AbortController()

    const guestId = localStorage.getItem('guestId') ?? ''
    const apiKey = localStorage.getItem('apiKey') ?? ''
    const systemPrompt = localStorage.getItem('systemPrompt') ?? ''

    await sendMessage(
      message,
      guestId,
      model,
      apiKey,
      systemPrompt,
      id ?? null,  
      controllerRef.current.signal
    )
  }

  const handleAbort = () => controllerRef.current?.abort()

  return (
    <div className="w-full h-full flex flex-col items-center gap-3 px-4 pt-4 bg-gray-50">
      {messages.length > 0 && (
        <div className="w-full h-[80vh] md:h-[82vh] max-w-3xl overflow-y-auto">
          {messages.map((m, i) => (
            <MessageBubble key={i} messages={m} isStreaming={streaming && i === messages.length - 1} />
          ))}
          {streaming && <span className='animate-pulse'><Logo /></span> }
        </div>
      )}

      <InputBox
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSend={handleSend}
        handleAbort={handleAbort}
        model={model}
        setModel={setModel}
        activeMessages={messages}
        isLoading={streaming}
        rateLimits={rateLimits}
      />

      <LoginPopup />
    </div>
  )
}