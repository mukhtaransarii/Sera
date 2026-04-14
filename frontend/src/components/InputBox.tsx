import { useEffect, useRef } from 'react'
import { MODELS } from '../constants/models'

export default function InputBox({ inputValue, setInputValue, handleSend, model, setModel, activeMessages }: any) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.style.height = 'auto'
    ref.current.style.height = ref.current.scrollHeight + 'px'
  }, [inputValue])

  return (
    <div className={`fixed z-10 w-full max-w-3xl px-4 md:p-0 transition-all duration-300
      ${activeMessages.length ? 'bottom-0' : 'top-1/2 -translate-y-1/2'}
    `}>
      <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <textarea 
          ref={ref}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
          placeholder="How can I help you?"
          rows={1}
          className="w-full focus:outline-none resize-none overflow-hidden"
        />

        <div className="mt-3 flex items-center justify-end gap-2">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="text-xs text-gray-500 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
          >
            {MODELS.map((m) => (
              <option key={m.value} value={m.value}>{m.label} — RPM {m.rpm} · RPD {m.rpd}</option>
            ))}
          </select>

          <button onClick={handleSend} className="bg-black rounded-full p-1.5 cursor-pointer hover:bg-zinc-600 disabled:opacity-50" disabled={!inputValue}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-500 text-center py-2">GEN AI can make mistakes, So study hard and make your own better LLM.</p>
    </div>
  )
}