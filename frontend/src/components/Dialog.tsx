import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { validateApiKey } from '../config/api.chat'
import { CheckCircle, XCircle, Trash2, Plus, Loader } from 'lucide-react'

type ApiKeyEntry = { label: string; key: string }

export default function Dialog() {
  const [_, setSearchParams] = useSearchParams()
  const [temp, setTemp] = useState<any>({})

  const [systemPrompt, setSystemPrompt] = useLocalStorage<string>('systemPrompt', '')
  const [activeKey, setActiveKey] = useLocalStorage<string | null>('apiKey', null)
  const [savedKeys, setSavedKeys] = useLocalStorage<ApiKeyEntry[]>('savedApiKeys', [])

  const [newKey, setNewKey] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [keyStatus, setKeyStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [keyError, setKeyError] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [_blank, setApiError] = useState('')

  const cancelDialog = () => {
    setSearchParams({})
    setTemp({})
    setApiError('')
    setKeyStatus('idle')
    setKeyError('')
    setNewKey('')
    setNewLabel('')
    setShowAdd(false)
  }

  const saveSystemPrompt = () => {
    setSystemPrompt(temp.systemPrompt)
    cancelDialog()
  }

  const handleAddKey = async () => {
    const clean = newKey.trim()
    if (!clean) return

    setKeyStatus('loading')
    setKeyError('')

    const res = await validateApiKey(clean)

    if (!res?.success) {
      setKeyStatus('error')
      setKeyError(res?.message || 'Invalid API key')
      return
    }

    const entry: ApiKeyEntry = { label: newLabel.trim() || `Key ${savedKeys.length + 1}`, key: clean }
    const updated = [...savedKeys, entry]
    setSavedKeys(updated)
    setActiveKey(clean)
    setKeyStatus('success')
    setNewKey('')
    setNewLabel('')
    setTimeout(() => { setKeyStatus('idle'); setShowAdd(false) }, 1200)
  }

  const handleSelectKey = (key: string) => {
    setActiveKey(key)
  }

  const handleDeleteKey = (key: string) => {
    const updated = savedKeys.filter(k => k.key !== key)
    setSavedKeys(updated)
    if (activeKey === key) setActiveKey(updated[0]?.key ?? null)
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
  ]

  return (
    <>
      {/* System Prompt Dialog */}
      <DialogWrapper title="System Prompt" params="systemPrompt">
        <textarea
          placeholder="Write Your Custom System Prompt..."
          rows={5}
          value={temp.systemPrompt ?? systemPrompt}
          onChange={(e) => setTemp({ ...temp, systemPrompt: e.target.value })}
          className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none resize-none focus:ring-1 focus:ring-black"
        />
        <div className="flex items-center justify-end gap-3">
          <button onClick={cancelDialog} className="cursor-pointer text-xs bg-gray-50 px-4 py-2 rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={saveSystemPrompt} className="cursor-pointer text-xs bg-green-700 text-white px-4 py-2 rounded-lg">Save</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {PROMPT_SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => setTemp({ ...temp, systemPrompt: s })}
              className={`text-xs px-2 py-1 rounded cursor-pointer w-full text-left ${
                (temp.systemPrompt ?? systemPrompt) === s ? 'bg-green-700 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </DialogWrapper>

      {/* API Key Dialog */}
      <DialogWrapper title="API Keys" params="apiKey">

        {/* Saved keys list */}
        {savedKeys.length > 0 && (
          <div className="flex flex-col gap-2">

            <div className='flex items-center justify-between'>
              <p className="text-xs text-gray-500 font-medium">Saved Keys</p>

              {activeKey && (
                <button
                  onClick={() => setActiveKey(null)}
                  className="text-xs text-blue-500 hover:underline cursor-pointer"
                >
                  Unselect API Key
                </button>
              )}
            </div>

            {savedKeys.map((entry) => (
              <div
                key={entry.key}
                onClick={() => handleSelectKey(entry.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                  activeKey === entry.key
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium ${activeKey === entry.key ? 'text-green-700' : 'text-gray-700'}`}>{entry.label}</p>
                  <p className="text-xs text-gray-400 truncate font-mono">{entry.key.slice(0, 8)}...{entry.key.slice(-4)}</p>
                </div>
                
                {activeKey === entry.key && <CheckCircle size={14} className="text-green-600 shrink-0" />}

                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteKey(entry.key) }}
                  className="shrink-0 p-1 hover:bg-red-50 rounded cursor-pointer"
                >
                  <Trash2 size={13} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add new key */}
        {showAdd ? (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-500 font-medium">Add New Key</p>

            <input
              type="text"
              placeholder="Label (optional)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full text-sm  border border-gray-200 rounded-xl p-3 outline-none focus:ring-1 focus:ring-green-700"
            />
            <input
              type="text"
              placeholder="gsk_..."
              value={newKey}
              onChange={(e) => { setNewKey(e.target.value); setKeyStatus('idle'); setKeyError('') }}
              className={`w-full text-sm  border border-gray-200 rounded-xl p-3 outline-none focus:ring-1 focus:ring-green-700 ${
                keyStatus === 'error' ? 'border-red-400 focus:ring-red-400' :
                keyStatus === 'success' ? 'border-green-400 focus:ring-green-400' :
                'border-gray-200 focus:ring-black'
              }`}
            />

            {/* Status messages */}
            {keyStatus === 'error' && (
              <div className="flex items-center gap-1.5 text-xs text-red-500">
                <XCircle size={13} /> {keyError}
              </div>
            )}
            {keyStatus === 'success' && (
              <div className="flex items-center gap-1.5 text-xs text-green-600">
                <CheckCircle size={13} /> API key validated and saved!
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => { setShowAdd(false); setKeyStatus('idle'); setKeyError(''); setNewKey(''); setNewLabel('') }}
                className="flex-1 text-xs bg-white border border-gray-200 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddKey}
                disabled={keyStatus === 'loading' || !newKey.trim()}
                className="flex-1 text-xs bg-green-700 text-white p-3 rounded-lg hover:bg-green-800 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1"
              >
                {keyStatus === 'loading' ? <><Loader size={12} className="animate-spin" /> Validating...</> : 'Validate & Save'}
              </button>
            </div>

            <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-800 text-right underline">
              Get a free Groq API key
            </a>
          </div>
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            className="w-full flex items-center justify-center gap-2 text-xs border border-dashed border-gray-300 rounded-xl py-2.5 hover:bg-gray-50 cursor-pointer text-gray-500"
          >
            <Plus size={14} /> Add New API Key
          </button>
        )}

        <div className="flex justify-end">
          <button onClick={cancelDialog} className="cursor-pointer text-xs bg-gray-50 px-4 py-2 rounded-lg hover:bg-gray-100">Done</button>
        </div>
      </DialogWrapper>
    </>
  )
}

function DialogWrapper({ title, note, children, params }: any) {
  const [searchParams] = useSearchParams()
  const isOpen = searchParams.get('dialog') === params

  return isOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-4 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div>
          <h2 className="text-xl font-bold font-[ClashDisplay] text-green-700">{title}</h2>
          {note && <p className="text-xs text-gray-500">{note}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}