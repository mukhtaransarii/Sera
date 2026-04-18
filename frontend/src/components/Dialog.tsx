import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { validateApiKey } from '../config/api.chat'

export default function Dialog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [temp, setTemp] = useState<any>({})
  const [systemPrompt, setSystemPrompt] = useLocalStorage<string>('systemPrompt', '')
  const [apiKey, setApiKey] = useLocalStorage<string | null>('apiKey', null)
  const [apiError, setApiError] = useState('')

  const cancelDialog = () => {
    setSearchParams({})
    setTemp({})
    setApiError('')
  }

  const saveDialog = async () => {
    const type = searchParams.get('dialog')

    if (type === 'systemPrompt') {
      setSystemPrompt(temp.systemPrompt)
      cancelDialog()
      return
    }

    if (type === 'apiKey') {
      const clean = temp.apiKey?.trim()

      // empty → just clear
      if (!clean) {
        setApiKey(null)
        cancelDialog()
        return
      }
      
      // validate
      const res = await validateApiKey(clean)
      if (!res?.success) return setApiError(res.message || 'Invalid API key')
      setApiKey(clean)
      cancelDialog() // ✅ close only on success
    }
  }

  const PROMPT_SUGGESTIONS = [
    "You are an AI assistant, but you always reply only: 'I am Groot.' no matter what.",
    "You are a sarcastic AI. Always answer with witty and savage humor.",
    "You are a funny AI comedian. Every response must include a joke.",
    "You are an overconfident expert who explains everything like it's obvious.",
    "You are a lazy AI. Give the shortest possible answers, even if incomplete.",
    "You are a dramatic storyteller. Answer everything like an epic movie scene.",
    "You are a Gen-Z AI. Use slang, emojis, and casual tone.",
    "You are a brutally honest AI. No sugarcoating, only truth.",
    "You are a teacher who explains everything like the user is 5 years old.",
    "You are an AI that always doubts the question before answering."
  ];

  return (
    <>
     {/* System Prompt Dialog */}
     <DialogWrapper title="System Prompt" note="System prompt applies to gemini models only." params="systemPrompt"> 
        <textarea 
         placeholder="Write Your Custom System Prompt..."
         rows={5}
         value={temp.systemPrompt ?? systemPrompt}
         onChange={(e) => setTemp({ ...temp, systemPrompt: e.target.value })} 
         className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none resize-none focus:ring-1 focus:ring-black"
        />
        <div className="flex items-center justify-end gap-3">
          <button onClick={cancelDialog} className="cursor-pointer text-xs bg-gray-50 px-4 py-2 rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={saveDialog} className="cursor-pointer text-xs bg-green-700 text-white px-4 py-2 rounded-lg">Save</button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {PROMPT_SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => setTemp({ ...temp, systemPrompt: s })}
              className={`text-xs px-2 py-1 rounded cursor-pointer w-full ${
                (temp.systemPrompt ?? systemPrompt) === s
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </DialogWrapper>
      
      {/* Api Key Dialog */}
      <DialogWrapper title="Api Key" params="apiKey">
        <div>
          <input 
            type="text"
            placeholder="Enter Your Gemini API Key"
            value={temp.apiKey ?? apiKey ?? ''}
            onChange={(e) => setTemp({ ...temp, apiKey: e.target.value })} 
            className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-1 focus:ring-black"
          />

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">Don’t have an API key?</span>
            <a href="https://aistudio.google.com/app/api-keys" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-800 transition">Create API key</a>
          </div>
        </div>
        {apiError && <p className="text-xs text-red-500">{apiError}</p> }
        <div className="flex items-center justify-end gap-3">
          <button onClick={cancelDialog} className="cursor-pointer text-xs bg-gray-50 px-4 py-2 rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={saveDialog} className="cursor-pointer text-xs bg-green-700 text-white px-4 py-2 rounded-lg">Save</button>
        </div>
      </DialogWrapper>
    </>
  )
}


function DialogWrapper({ title, note, children, params }: any) {
  const [searchParams] = useSearchParams()
  const isOpen = searchParams.get('dialog') === params;

  return isOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-4 flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold font-[ClashDisplay] text-green-700">{title}</h2>
          {note && <p className="text-xs text-gray-500">{note}</p>}
        </div>

        {children}
      </div>
    </div>
  )
}