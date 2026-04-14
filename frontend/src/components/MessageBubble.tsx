import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useState, useEffect, useRef } from 'react'
import type { Messages } from '../types/messages'

interface Props {
  messages: Messages
  isStreaming?: boolean
}

export default function MessageBubble( { messages, isStreaming }: Props ) {
  const isUser = messages.role === 'user';
  const isError = messages?.type === 'error';
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStreaming) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.content, isStreaming])
  
  useEffect(() => {
    if (!isStreaming) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-2`}>
      
      {isUser && <p className="max-w-[75%] text-sm bg-gray-50 border border-gray-200 text-black px-4 py-2 rounded-xl shadow-xs">{messages.content}</p>}
      {isError && <p className="w-fit px-4 py-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">{messages.content}</p>}

      {!isUser && !isError && (
        <div className="w-full prose prose-sm prose-neutral max-w-none prose-pre:p-0 prose-pre:bg-transparent prose-pre:my-0 prose-code:before:hidden prose-code:after:hidden">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
            code({ className, children }: any) {
              const match = /language-(\w+)/.exec(className || '')
              const code = String(children).replace(/\n$/, '')
              return match
                ? <CodeBlock language={match[1]} code={code} />
                : <code className="bg-gray-100 text-rose-600 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
            },
          }}>{messages.content}</ReactMarkdown>
          <div ref={bottomRef} />  {/* 👈 anchor scrolls here on each chunk */}
        </div>
      )}
    </div>
  )
}



function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-4 rounded-xl border border-gray-200 overflow-hidden not-prose">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
        <span className="text-xs text-gray-400 font-mono">{language}</span>
        <button onClick={copy} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer">
          {copied
            ? <><CheckIcon className="text-green-400" /><span className="text-green-400">Copied</span></>
            : <><CopyIcon /><span>Copy</span></>}
        </button>
      </div>
      <SyntaxHighlighter style={vscDarkPlus} language={language} PreTag="div"
        customStyle={{ margin: 0, borderRadius: 0, fontSize: '13px' }}
        showLineNumbers lineNumberStyle={{ color: '#4b5563', fontSize: '12px' }}>
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

const CopyIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)
const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={`w-3.5 h-3.5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)