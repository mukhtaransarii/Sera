import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import MessageBubble from '../components/MessageBubble'
import InputBox from '../components/InputBox'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useChatStore } from '../context/useChat'
import { defaultModel } from '../constants/models'

export default function ChatScreen() {
  const [inputValue, setInputValue] = useState('')
  const [model, setModel] = useLocalStorage('model', defaultModel)
  const { chats, currentChatId, streaming, sendMessage, loadChat } = useChatStore()

  const navigate = useNavigate()
  const { id } = useParams()

  const messages = chats.find(c => c._id === id)?.messages ?? []

  // load chats once on mount
  useEffect(() => { loadChat() }, [])

  // set currentChatId
  useEffect(() => {
    useChatStore.setState({ currentChatId: id ?? null })
  }, [id])

  // navigate as soon as a new chat is created
  useEffect(() => {
    if (currentChatId && !id) navigate(`/chat/${currentChatId}`)
  }, [currentChatId])

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
      />
    </div>
  )
}