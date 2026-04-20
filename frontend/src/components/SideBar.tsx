import { useState, useRef, useEffect } from 'react'
import { LogoWithText } from './Logo'
import { Plus, Settings, Trash, PencilLine, Save, Columns2, Square, KeyRound, LogOut, MoreHorizontal, CheckCircle } from 'lucide-react'
import { useChatStore } from '../context/useChat'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Dialog from './Dialog'
import { useAuth } from '../context/useAuth'

export default function SideBar() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [_, setSearchParams] = useSearchParams()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [titleDraft, setTitleDraft] = useState('')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const { chats, deleteChat, renameChat } = useChatStore()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const currentChatId = window.location.pathname.split('/chat/')[1] ?? null

  const hasApiKey = !!localStorage.getItem('apiKey')
  const hasSystemPrompt = !!localStorage.getItem('systemPrompt')

  // close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const OPTIONS = [
    {
      name: 'New Chat',
      icon: <Plus strokeWidth={0.8} size={20} className='bg-gray-200 p-0.5 rounded-full' />,
      action: () => { setIsMobileNavOpen(false); navigate('/chat') }
    },
    {
      name: hasSystemPrompt ? 'System Prompt Active' : 'System Prompt',
      icon: <Settings strokeWidth={0.8} size={16} className={hasSystemPrompt ? 'text-green-700' : ''} />,
      badge: hasSystemPrompt,
      action: () => { setIsMobileNavOpen(false); setSearchParams({ dialog: 'systemPrompt' }) }
    },
    {
      name: hasApiKey ? 'API Key Active' : 'Add API Key',
      icon: <KeyRound strokeWidth={0.8} size={16} className={hasApiKey ? 'text-green-700' : ''} />,
      badge: hasApiKey,
      action: () => { setIsMobileNavOpen(false); setSearchParams({ dialog: 'apiKey' }) }
    },
  ]

  return (
    <>
      {/* Mobile Toggle */}
      <div className='fixed right-0 top-0 w-full px-4 py-2 flex items-center justify-between gap-2'>
        <Columns2
          strokeWidth={0.8}
          size={28}
          className='bg-white p-1 rounded-sm shadow-sm md:hidden block'
          onClick={() => setIsMobileNavOpen(true)}
        />

        <div className='flex-1 hidden md:block' />

        {!user && <span onClick={() => navigate('/login')} className='flex flex-col items-start px-2 py-px rounded border border-gray-600 cursor-pointer'>Login</span>}
      </div>

      {/* Sidebar */}
      <aside className={`h-full w-72 bg-gray-50 px-2 pb-4 border-r border-gray-200 flex flex-col gap-3
        md:static md:translate-x-0 absolute z-20 transition-all duration-300 ease-in-out
        ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className='px-2 py-2 flex items-center justify-between'>
          <div onClick={() => navigate('/home')} className='relative group cursor-pointer'>
            <LogoWithText />
            <span className="tooltip">Sera - Your Personal AI Assistant</span>
          </div>
          <Square strokeWidth={0.8} size={22} className='block md:hidden' onClick={() => setIsMobileNavOpen(false)} />
        </div>

        {/* Options */}
        <div>
          {OPTIONS.map((option) => (
            <button
              key={option.name}
              onClick={option.action}
              className="w-full flex items-center gap-2 font-light text-sm hover:bg-gray-100 p-2 rounded cursor-pointer"
            >
              {option.icon}
              <span className={option.badge ? 'text-green-600 font-medium flex-1 text-left' : 'flex-1 text-left'}>
                {option.name}
              </span>
              {option.badge && <CheckCircle strokeWidth={1.5} size={14} className="text-green-600 shrink-0" />}
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto" ref={menuRef}>
          <p className='text-xs font-light text-gray-700 px-2 mb-1'>Recent</p>

          {chats.map((chat) => (
            <div
              key={chat._id}
              className={`relative flex items-center gap-1 text-sm rounded group
                ${currentChatId === chat._id ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
            >
              {/* Chat title button */}
              {chat._id === editingId ? (
                <input
                  autoFocus
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { renameChat(chat._id, titleDraft.trim()); setEditingId(null) }
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  className="flex-1 text-sm border border-gray-300 rounded p-1 outline-none bg-transparent mx-2 my-1"
                />
              ) : (
                <button
                  onClick={() => { navigate(`/chat/${chat._id}`); setIsMobileNavOpen(false); setOpenMenuId(null) }}
                  className="flex-1 text-left px-2 py-1.5 font-light truncate cursor-pointer"
                >
                  {chat.title}
                </button>
              )}

              {/* Save on edit / dots on normal */}
              {chat._id === editingId ? (
                <Save
                  strokeWidth={0.75}
                  size={20}
                  color="green"
                  onClick={() => { renameChat(chat._id, titleDraft.trim()); setEditingId(null) }}
                  className="shrink-0 bg-green-50 p-0.75 border border-green-200 rounded mr-1 cursor-pointer"
                />
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === chat._id ? null : chat._id) }}
                  className="shrink-0 p-1 rounded hover:bg-gray-200 transition-opacity mr-1 cursor-pointer"
                >
                  <MoreHorizontal strokeWidth={1} size={16} />
                </button>
              )}

              {/* Dropdown menu */}
              {openMenuId === chat._id && (
                <div className="absolute right-1 top-8 z-30 bg-white border border-gray-200 rounded-lg shadow-md py-1 min-w-32.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingId(chat._id); setTitleDraft(chat.title); setOpenMenuId(null) }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-gray-50 cursor-pointer"
                  >
                    <PencilLine strokeWidth={1} size={14} color="blue" /> Rename
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteChat(chat._id); if (currentChatId === chat._id) navigate('/chat'); setOpenMenuId(null) }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-red-50 text-red-500 cursor-pointer"
                  >
                    <Trash strokeWidth={1} size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Logout */}
        {user && (
          <div className='relative group'>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 font-light text-sm hover:bg-red-100 p-2 rounded cursor-pointer"
            >
              <LogOut strokeWidth={1} size={16} color="red" /> Logout
            </button>
            <span className="tooltip">😭 Please don't Logout</span>
          </div>
        )}
      </aside>

      <Dialog />
    </>
  )
}