import { useState } from 'react'
import { LogoWithText } from '../components/Logo'
import { Plus, Settings, Trash, PencilLine, Save, Columns2, Square, KeyRound, LogOut } from 'lucide-react'
import { useChatStore } from '../context/useChat'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Dialog from '../components/Dialog'
import { useAuth } from '../context/useAuth'

export default function SideBar() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false) 
  const [_, setSearchParams] = useSearchParams() 
  const [editingId, setEditingId] = useState<string | null>(null)
  const [titleDraft, setTitleDraft] = useState('')
  
  const { chats, deleteChat, renameChat } = useChatStore();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const hasApiKey = !!localStorage.getItem('apiKey');
  const OPTIONS = [
    { name: 'New Chat', icon: <Plus strokeWidth={0.8} size={20} className='bg-gray-200 p-0.5 rounded-full' />, action: () => { setIsMobileNavOpen(false);  navigate('/chat') }},
    { name: 'System Prompt', icon: <Settings strokeWidth={0.8} size={16} />, action: () => { setIsMobileNavOpen(false); setSearchParams({ dialog: 'systemPrompt' }) }},
    { name: hasApiKey ? 'API Key Active' : 'Add API Key', icon: <KeyRound strokeWidth={0.8} size={16} className={hasApiKey ? 'text-green-700' : ''}/>, action: () => { setIsMobileNavOpen(false); setSearchParams({ dialog: 'apiKey' }) }},
  ]
  
  return (
    <>
      {/* Sidebar Toggle for Mobile */}
      <button className='fixed right-0 top-0 w-full px-4 py-2 flex items-center justify-between'>
        <Columns2 
         strokeWidth={0.8} 
         size={28}  
         className='bg-white p-1 rounded-sm shadow-sm md:hidden block'
         onClick={() => setIsMobileNavOpen(true)}
        />
        <div className='flex-1'/>
        <span onClick={() => navigate('/login')} className="bg-black px-1.5 py-1 text-sm text-white rounded-sm font-light shadow-sm auth-text cursor-pointer"></span>
      </button>

      {/* SideBar Desktop */}
      <aside 
       className={`h-full w-72 bg-gray-50 px-2 pb-4 border-r border-gray-200 md:flex flex-col gap-3 
        md:static md:translate-x-0 absolute z-20
        transition-all duration-300 ease-in-out
        ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'} `}
      > 
        {/* Logo And Mobile Toggle SideBar */}
        <div className='px-2 py-2 flex items-center justify-between cursopr-pointer'>
          <div onClick={() => navigate('/home')} className='relative group cursor-pointer'>
           <LogoWithText />
           <span className="tooltip">Sera - Your Personal AI Assistant</span>
          </div>

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
              <span className={option.name.includes('API Key') && hasApiKey ? 'text-green-600 font-medium' : ''}>{option.name}</span>
            </button>
          ))}
        </div>

        {/* Chats History */}
        <div className="flex-1 overflow-y-auto">
          <p className='text-xs font-light text-gray-700 px-2'>Recent</p>

          {chats.map((chat) => (
            <button
              key={chat._id}
              onClick={() => {navigate(`/chat/${chat._id}`); setIsMobileNavOpen(false)}}
              className="w-full flex items-center justify-between gap-2 text-sm hover:bg-gray-100 px-2 py-1.5 rounded cursor-pointer group"
            > 
              {/* Title, If editingId show input else show title */}
              {chat._id === editingId ? (
                <input
                  autoFocus
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 text-sm border border-gray-300 rounded p-1 outline-none bg-transparent"
                />
              ) : (
                <span className="font-light line-clamp-1 text-left flex-1">{chat.title}</span>
              )}

              {/* Show Trash if not editingId */}
              {chat._id !== editingId && (
                <Trash
                  strokeWidth={1}
                  size={20}
                  color={"red"}
                  className="shrink-0 bg-red-50 p-0.75 border border-red-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => { e.stopPropagation(); deleteChat(chat._id) }}
                />
              )}
              
              {/* Show Save if editingId else show Pencil */}
              {chat._id === editingId ? (
                <Save 
                  strokeWidth={0.75} 
                  size={20}
                  color={"green"}
                  onClick={(e) => {
                    e.stopPropagation()
                    renameChat(chat._id, titleDraft.trim())
                    setEditingId(null)
                  }}
                  className="shrink-0 bg-green-50 p-0.75 border border-green-200 rounded"
                />
              ) : (
                <PencilLine
                  strokeWidth={1}
                  size={20} 
                  color={"blue"}
                  className="shrink-0 bg-blue-50 p-0.75 border border-blue-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingId(chat._id)
                    setTitleDraft(chat.title)
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Logout */}
        {user && 
          <div className='relative group'>
            <button 
              onClick={logout}
              className="w-full flex items-center gap-2 font-light text-sm hover:bg-red-100 p-2 rounded cursor-pointer"
            >
              <LogOut strokeWidth={1} size={16} color={"red"} /> Logout
            </button>
            <span className="tooltip">😭 Please don't Logout</span>
          </div>
        }
      </aside>
      
      {/* Dialog Call Once */}
      <Dialog />
    </>
  )
}
