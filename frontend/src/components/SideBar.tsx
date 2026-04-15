import { useState } from 'react'
import { LogoWithText } from '../components/Logo'
import { Plus, Settings, Trash, PencilLine, Save, Columns2, Square, KeyRound } from 'lucide-react'
import { useChatStore } from '../context/useChats'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Dialog from '../components/Dialog'

export default function SideBar() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false) 
  const [_, setSearchParams] = useSearchParams() 
  const [editingId, setEditingId] = useState<string | null>(null)
  const [titleDraft, setTitleDraft] = useState('')
  
  const { chats, deleteChat, renameChat } = useChatStore();
  const navigate = useNavigate();

  const hasApiKey = !!localStorage.getItem('apiKey');

  const OPTIONS = [
    { name: 'New Chat', icon: <Plus strokeWidth={0.8} size={20} className='bg-gray-200 p-0.5 rounded-full' />, action: () => navigate('/chat') },
    { name: 'System Prompt', icon: <Settings strokeWidth={0.8} size={16} />, action: () => setSearchParams({ dialog: 'systemPrompt' }) },
    { name: hasApiKey ? 'API Key Active' : 'Add API Key', icon: <KeyRound strokeWidth={0.8} size={16} className={hasApiKey ? 'text-green-700' : ''}/>, action: () => setSearchParams({ dialog: 'apiKey' }) },
  ]
  
  return (
    <>
      {/* Sidebar Toggle for Mobile */}
      <button className='fixed top-0 w-full md:hidden block px-4 pt-2'>
        <Columns2 
         strokeWidth={0.8} 
         size={28}  
         className='bg-white p-1 rounded-sm shadow-sm'
         onClick={() => setIsMobileNavOpen(true)}
        />
      </button>

      {/* SideBar Desktop */}
      <aside 
       className={`h-full w-72 bg-gray-50 px-2 pb-4 border-r border-gray-200 md:flex flex-col gap-3 
        md:static md:translate-x-0 absolute z-20
        transition-all duration-300 ease-in-out
        ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'} `}
      > 
        {/* Logo */}
        <div className='px-2 py-2 flex items-center justify-between'>
          <LogoWithText />
          <Square 
           strokeWidth={0.8} 
           size={22}  
           className='block md:hidden'
           onClick={() => setIsMobileNavOpen(false)}
          /> 
        </div>
        
        {/* OPTIONS */}
        <div>
          {OPTIONS.map((option) => (
            <button 
              key={option.name} onClick={option.action} 
              className="w-full flex items-center gap-2 font-light text-sm hover:bg-gray-100 p-2 rounded cursor-pointer"
            >
              {option.icon}
              <span className={option.name.includes('API Key') && hasApiKey ? 'text-green-600 font-medium' : ''}>
                {option.name}
              </span>
            </button>
          ))}
        </div>

        {/* Chats History */}
        <div className="flex-1 overflow-y-auto">
          <p className='text-xs font-light text-gray-700 px-2'>Recent</p>

          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => {navigate(`/chat/${chat.id}`); setIsMobileNavOpen(false)}}
              className="w-full flex items-center justify-between gap-2 text-sm hover:bg-gray-100 px-2 py-1.5 rounded cursor-pointer group"
            >
              {chat.id === editingId ? (
                <input
                  autoFocus
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 text-sm border-b border-gray-300 outline-none bg-transparent"
                />
              ) : (
                <span className="font-light line-clamp-1 text-left flex-1">{chat.title}</span>
              )}
              {chat.id !== editingId && (
                <Trash
                  strokeWidth={1}
                  size={14}
                  color={"red"}
                  className="shrink-0 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => { e.stopPropagation(); deleteChat(chat.id) }}
                />
              )}

              {chat.id === editingId ? (
                <Save 
                  strokeWidth={0.75} 
                  size={14}
                  color={"green"}
                  onClick={(e) => {
                    e.stopPropagation()
                    renameChat(chat.id, titleDraft.trim())
                    setEditingId(null)
                  }}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              ) : (
                <PencilLine
                  strokeWidth={1}
                  size={14} 
                  color={"blue"}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingId(chat.id)
                    setTitleDraft(chat.title)
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </aside>
      
      <Dialog />
    </>
  )
}
