import { useState, useRef, useEffect } from "react"
import Icon from "@/components/ui/icon"

type Message = {
  id: number
  text: string
  isBot: boolean
  videoUrl?: string
  isVideo?: boolean
}

function isVideoLink(text: string): boolean {
  return /https?:\/\/.*(youtube|youtu\.be|vimeo|rutube|tiktok|ok\.ru\/video|vk\.com\/video)/i.test(text)
}

function extractVideoEmbed(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  return null
}

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Привет! 👋 Я чат Carnival Pantera. Пишите ваш вопрос, кидайте ссылки на видео — мы всё посмотрим и ответим!", isBot: true },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const sendMessage = (text?: string) => {
    const msgText = (text ?? input).trim()
    if (!msgText) return

    const isVid = isVideoLink(msgText)
    const userMsg: Message = { id: Date.now(), text: msgText, isBot: false, isVideo: isVid, videoUrl: isVid ? msgText : undefined }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      let botText = "Ваше сообщение получено! ✅ Мы ответим вам в ближайшее время."
      if (isVid) botText = "Видео получено! 🎬 Мы посмотрим его и свяжемся с вами по вашему вопросу."
      else if (msgText.toLowerCase().includes("купить")) botText = "Для покупки — выберите товар в каталоге и нажмите кнопку «Купить». Остались вопросы — напишите! 🛒"
      else if (msgText.toLowerCase().includes("заявк")) botText = "Заявку можно подать в разделе «Заявки» на сайте. Там же — алкоголь, вейпы и табак (18+). 📝"
      else if (msgText.toLowerCase().includes("привет") || msgText.toLowerCase().includes("здравствуй")) botText = "Здравствуйте! 👋 Чем могу помочь?"

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botText, isBot: true }])
    }, 800)
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9997] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 neon-button-primary"
        style={{ boxShadow: "0 0 20px rgba(168,85,247,0.5)" }}>
        {isOpen ? <Icon name="X" size={22} /> : <Icon name="MessageCircle" size={24} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[9996] w-80 sm:w-96 chat-pop">
          <div className="bg-[#0d0d1a] border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ height: 480, boxShadow: "0 0 40px rgba(168,85,247,0.2)" }}>
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(59,130,246,0.3))", borderBottom: "1px solid rgba(168,85,247,0.2)" }}>
              <div className="flex items-center gap-2">
                <img
                  src="https://cdn.poehali.dev/projects/3d74854d-9358-4a23-8c6e-df0850b2ae4f/bucket/393248e3-d91b-458e-8812-026d76f4809e.jpg"
                  alt="CP"
                  className="w-8 h-8 rounded-full object-cover"
                  style={{ boxShadow: "0 0 8px rgba(168,85,247,0.5)" }}
                />
                <div>
                  <p className="text-white font-semibold text-sm font-orbitron">Чат поддержки</p>
                  <p className="text-purple-300/70 text-xs">Carnival Pantera</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full" style={{ boxShadow: "0 0 6px rgba(74,222,128,0.8)" }} />
                <span className="text-white/60 text-xs">Онлайн</span>
                <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white ml-1 transition-colors">
                  <Icon name="X" size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[#0d0d1a]">
              {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.isBot ? "items-start" : "items-end"}`}>
                  <div className={`flex ${msg.isBot ? "justify-start" : "justify-end"} w-full`}>
                    {msg.isBot && (
                      <img src="https://cdn.poehali.dev/projects/3d74854d-9358-4a23-8c6e-df0850b2ae4f/bucket/393248e3-d91b-458e-8812-026d76f4809e.jpg"
                        alt="CP" className="w-6 h-6 rounded-full object-cover mr-2 flex-shrink-0 mt-1" />
                    )}
                    <div className={`max-w-[75%] ${msg.isVideo ? "w-full" : ""}`}>
                      {msg.isVideo && msg.videoUrl ? (
                        <div className="rounded-2xl overflow-hidden border border-purple-500/30">
                          {extractVideoEmbed(msg.videoUrl) ? (
                            <iframe
                              src={extractVideoEmbed(msg.videoUrl)!}
                              className="w-full"
                              height="150"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title="video"
                            />
                          ) : (
                            <a href={msg.videoUrl} target="_blank" rel="noopener noreferrer"
                              className="block px-3 py-2 bg-purple-500/10 rounded-2xl text-purple-300 text-sm hover:bg-purple-500/20 transition-colors">
                              🎬 Видео: {msg.videoUrl.slice(0, 40)}...
                            </a>
                          )}
                        </div>
                      ) : (
                        <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                          msg.isBot
                            ? "bg-[#1a1a2e] text-gray-200 rounded-tl-sm"
                            : "text-white rounded-tr-sm"
                        }`}
                          style={!msg.isBot ? { background: "linear-gradient(135deg, rgba(168,85,247,0.4), rgba(59,130,246,0.4))", border: "1px solid rgba(168,85,247,0.3)" } : {}}>
                          {msg.text}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2">
                  <img src="https://cdn.poehali.dev/projects/3d74854d-9358-4a23-8c6e-df0850b2ae4f/bucket/393248e3-d91b-458e-8812-026d76f4809e.jpg"
                    alt="CP" className="w-6 h-6 rounded-full object-cover" />
                  <div className="bg-[#1a1a2e] px-4 py-3 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            <div className="px-4 py-2 bg-[#0d0d1a] flex gap-2 overflow-x-auto border-t border-white/5">
              {["Купить аккаунт", "Подать заявку", "Рулетка"].map(q => (
                <button key={q} onClick={() => sendMessage(q)}
                  className="flex-shrink-0 text-xs px-3 py-1 rounded-full border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-colors whitespace-nowrap">
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-3 py-3 bg-[#0d0d1a] border-t border-white/5">
              <div className="flex gap-2 items-center">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Сообщение или ссылка на видео..."
                  className="flex-1 bg-[#1a1a2e] border border-purple-500/20 rounded-xl px-3 py-2.5 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-purple-500/50"
                />
                <button onClick={() => sendMessage()}
                  className="w-10 h-10 rounded-xl neon-button-primary flex items-center justify-center flex-shrink-0">
                  <Icon name="Send" size={16} />
                </button>
              </div>
              <p className="text-gray-600 text-xs mt-1.5 text-center">Можно кидать ссылки на YouTube, VK Видео, TikTok</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
