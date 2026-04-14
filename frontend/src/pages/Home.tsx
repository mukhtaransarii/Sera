import { ArrowRight, PenLine, Search, HelpCircle, Code2, MessageCircle, Zap, Star, Cpu, Bot, Feather } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
//import { useEffect, useState } from 'react'
import { LogoWithText } from '../components/Logo'

export default function Home() {
  const navigate = useNavigate()
  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // useEffect(() => {
  //   const handleMouseMove = (e: MouseEvent) => {
  //     setMousePosition({ x: e.clientX, y: e.clientY })
  //   }
  //   window.addEventListener('mousemove', handleMouseMove)
  //   return () => window.removeEventListener('mousemove', handleMouseMove)
  // }, [])

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50/30 dark:from-emerald-950/20 dark:via-slate-950 dark:to-teal-950/20 font-['ClashDisplay'] overflow-x-hidden">
      {/* Animated linear blob with linear linear */}
      <div 
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{background: `linear-linear(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.04) 50%, transparent 80%)`}}
      />
      
      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-6 border-b border-emerald-200/50 dark:border-emerald-800/30 backdrop-blur-sm bg-white/50 dark:bg-slate-950/50 sticky top-0 z-10">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
            <LogoWithText />
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">How it works</a>
            <a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Pricing</a>
          </div>

          <button
            onClick={() => navigate('/chat')}
            className="cursor-pointer flex items-center gap-2 bg-linear-to-r from-emerald-600 to-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
          >
            Start chatting <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </nav>

        {/* Hero */}
        <section className="text-center py-16 md:py-24">
          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-full px-4 py-1.5 text-sm text-emerald-700 dark:text-emerald-300 mb-6 backdrop-blur-sm animate-fade-in-up">
            <Zap size={12} className="fill-emerald-500" /> 
            <span className="font-medium">Always available, always listening</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6 bg-linear-to-br from-emerald-800 via-emerald-700 to-green-600 dark:from-emerald-200 dark:via-emerald-300 dark:to-green-400 bg-clip-text text-transparent animate-fade-in-up animation-delay-100">
            Your AI companion<br />for every conversation
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200">
            Sera helps you think, write, and explore ideas — naturally, through conversation. 
            <span className="block text-emerald-600 dark:text-emerald-400 font-medium mt-1">No prompts needed, just talk.</span>
          </p>
          <div className="flex gap-4 justify-center flex-wrap animate-fade-in-up animation-delay-300">
            <button
              onClick={() => navigate('/chat')}
              className="cursor-pointer group flex items-center gap-2 bg-linear-to-r from-emerald-600 to-green-600 text-white px-7 py-3.5 rounded-xl text-sm font-medium hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105"
            >
              <MessageCircle size={16} /> New conversation <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="flex items-center gap-2 border-2 border-emerald-200 dark:border-emerald-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm px-7 py-3.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all duration-300">
              <Feather size={16} /> See how it works
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-20 pt-8 border-t border-emerald-200/50 dark:border-emerald-800/30">
            {[
              { value: '99.9%', label: 'Uptime' },
              { value: '<1s', label: 'Response time' },
              { value: '24/7', label: 'Availability' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{stat.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mb-24 scroll-mt-20">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 mb-3">Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">What Sera can do</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-md mx-auto">Powered by advanced AI, designed for real conversations</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <PenLine size={20} />, title: 'Write & edit', desc: 'Draft emails, polish documents, and refine your writing in seconds.', color: 'from-emerald-500 to-green-500' },
              { icon: <Search size={20} />, title: 'Research & explore', desc: 'Dig deep into any topic and get clear, structured answers instantly.', color: 'from-teal-500 to-emerald-500' },
              { icon: <HelpCircle size={20} />, title: 'Ask anything', desc: "From quick facts to complex questions — Sera never judges, always helps.", color: 'from-green-500 to-emerald-500' },
              { icon: <Code2 size={20} />, title: 'Code & debug', desc: 'Write, explain, and fix code across any language with ease.', color: 'from-emerald-600 to-green-600' },
            ].map(({ icon, title, desc, color }) => (
              <div key={title} className="group relative border border-emerald-200/50 dark:border-emerald-800/30 rounded-2xl p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                  <div className="text-white">{icon}</div>
                </div>
                <p className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-2">{title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mb-24 scroll-mt-20">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 mb-3">Simple process</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">How it works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: 1, title: 'Start a conversation', desc: 'Click "New conversation" and type whatever is on your mind. No setup required.', icon: <MessageCircle size={24} /> },
              { n: 2, title: 'Sera responds instantly', desc: 'Get clear, thoughtful responses that understand context and nuance.', icon: <Bot size={24} /> },
              { n: 3, title: 'Continue the thread', desc: 'Follow up, refine, or switch topics. Your chat history is always saved.', icon: <Cpu size={24} /> },
            ].map(({ n, title, desc, icon }) => (
              <div key={n} className="relative text-center p-6 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-linear-to-r from-emerald-600 to-green-600 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                  {n}
                </div>
                <div className="mt-4 mb-4 flex justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    {icon}
                  </div>
                </div>
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">{title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="mb-24">
          <div className="relative rounded-3xl bg-linear-to-br from-emerald-600 via-green-600 to-teal-600 p-8 md:p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-linears.vercel.app/grain.svg')] opacity-20" />
            <div className="relative z-10">
              <Star size={32} className="text-white/80 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Ready to start?</h2>
              <p className="text-emerald-100 mb-8 max-w-md mx-auto">Jump into your first conversation — it only takes a second.</p>
              <button
                onClick={() => navigate('/chat')}
                className="cursor-pointer group inline-flex items-center gap-2 bg-white text-emerald-600 px-7 py-3.5 rounded-xl text-sm font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Open Sera <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-emerald-200/50 dark:border-emerald-800/30 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <LogoWithText />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">© 2025 Sera. All rights reserved.</span>
            </div>
            <div className="flex gap-6 items-center">
              <a href="https://github.com/mukhtaransarii" className="text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">github</a>
              <a href="https://twitter.com/mukhtaransarii" className="text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">twitter</a>
              <a href="#" className="text-sm text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Privacy</a>
              <a href="#" className="text-sm text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Terms</a>
              <a href="#" className="text-sm text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Contact</a>
            </div>
          </div>
        </footer>

      </div>

      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animation-delay-100 {
          animation-delay: 0.1s;
          opacity: 0;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}