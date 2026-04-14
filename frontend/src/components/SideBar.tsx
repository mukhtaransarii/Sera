import { useState } from 'react'
import { Text } from '../components/Logo'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Plus, Settings, Trash, X, PencilLine, Save, Columns2, Square } from 'lucide-react'
import { useChatStore } from '../context/useChats'
import { useNavigate } from 'react-router-dom'

export default function SideBar() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  // system prompt
  const [open, setOpen] = useState(false)
  const [systemPrompt, setSystemPrompt] = useLocalStorage<string>('systemPrompt', '')
  const [draft, setDraft] = useState(systemPrompt)
  
  // rename chat
  const [editingId, setEditingId] = useState<string | null>(null)
  const [titleDraft, setTitleDraft] = useState('')

  // zustand
  const { chats, deleteChat, renameChat } = useChatStore();
  const navigate = useNavigate();

  const OPTIONS = [
    { name: 'New Chat', icon: <Plus strokeWidth={0.8} size={20} className='bg-gray-200 rounded-full p-0.5' />, action: () => navigate('/chat') },
    { name: 'System Prompt', icon: <Settings strokeWidth={0.8} size={16} />, action: () => { setDraft(systemPrompt); setOpen(true) } },
  ]

  return (
    <>
      {/* Mobile Nav */}
      <div className='fixed top-0 w-full md:hidden block px-4 pt-2'>
        <Columns2 
         strokeWidth={0.8} 
         size={28}  
         className='bg-white p-1 rounded-sm shadow-sm'
         onClick={() => setIsMobileNavOpen(true)}
        />
      </div>

      {/* SideBar */}
      <aside 
       className={`h-full w-72 bg-gray-50 px-2 pb-4 border-r border-gray-200 md:flex flex-col gap-3 
        md:static md:translate-x-0 absolute z-20
        transition-all duration-300 ease-in-out
        ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'} `}
      >
        <div className='px-2 py-2 flex items-center justify-between'>
          <Text />
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
            <button key={option.name} onClick={option.action} className="w-full flex items-center gap-2 text-sm hover:bg-gray-100 p-2 rounded cursor-pointer">
              {option.icon}
              <span>{option.name}</span>
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
      
      {/* Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800">System Prompt</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 transition cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="You are a helpful assistant..."
              rows={8}
              className="w-full text-sm text-gray-700 border border-gray-200 rounded-xl p-3 focus:outline-none resize-none placeholder:text-gray-400"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{draft.length} chars</span>
              <button
                onClick={() => { setSystemPrompt(draft); setOpen(false) }}
                className="text-xs bg-black text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}