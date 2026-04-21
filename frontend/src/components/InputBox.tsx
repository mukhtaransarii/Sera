import { useEffect, useRef } from 'react'
import { MODELS } from '../constants/models'

export default function InputBox({ inputValue, setInputValue, handleSend, handleAbort, model, setModel, activeMessages, isLoading, rateLimits }: any) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.style.height = 'auto'
    ref.current.style.height = Math.min(ref.current.scrollHeight, 10 * 24) + 'px'
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
          onKeyDown={(e) => {
            const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent)
            if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="How can I help you?"
          rows={1}
          className="w-full focus:outline-none resize-none overflow-y-scroll overflow-hidden font-light"
        />

        <div className="mt-3 flex items-center justify-end gap-2">
          {/* <div className="relative group flex items-center gap-2 px-2 py-1 text-xs text-gray-500 border border-gray-200 rounded-lg p-0.5 focus:outline-none cursor-pointer">
            <img src="pfp.png" alt="pfp" className="w-5 h-5 rounded-full"/>
            <span className='tooltip'>Search About Developer.</span>
          </div> */}

          <div className='flex items-center gap-2'>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="text-xs text-gray-500 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
            >
              {MODELS.map((m) => <option key={m.value} value={m.value}>{m.label}</option> )}
            </select>

            <button
              onClick={isLoading ? handleAbort : handleSend}
              className={`rounded-full p-1.5 cursor-pointer hover:bg-zinc-600 disabled:opacity-50 ${
                isLoading ? 'bg-green-700' : 'bg-black'
              }`}
              disabled={!inputValue && !isLoading}
            >
              {isLoading ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="size-4 text-white">
                  <rect x="6" y="6" width="12" height="12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Rate Limits */}
      {rateLimits && (
        <div className="flex gap-3 px-1 mt-1">
          <div className="flex-1">
            <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
              <span>Requests/day</span>
              <span>{rateLimits.remainingRequests} / {rateLimits.limitRequests}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1">
              <div
                className="bg-green-500 h-1 rounded-full transition-all"
                style={{ width: `${(Number(rateLimits.remainingRequests) / Number(rateLimits.limitRequests)) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
              <span>Tokens/min</span>
              <span>{rateLimits.remainingTokens} / {rateLimits.limitTokens}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1">
              <div
                className="bg-blue-400 h-1 rounded-full transition-all"
                style={{ width: `${(Number(rateLimits.remainingTokens) / Number(rateLimits.limitTokens)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="text-xs text-gray-500 text-center py-2 font-light"><mark className='text-green-700 bg-transparent'>Sera</mark> can make mistakes, So study hard and make your own better LLM.</p>
    </div>
  )
}
