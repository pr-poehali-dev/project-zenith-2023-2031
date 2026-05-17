import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Icon from "@/components/ui/icon"

type Message = {
  id: number
  text: string
  isBot: boolean
}

const FAQ_ANSWERS: Record<string, string> = {
  "купить": "Чтобы купить видео: найдите его в каталоге → нажмите «Купить» → оплатите → доступ откроется мгновенно в личном кабинете! 🎬",
  "оплата": "Принимаем банковские карты и популярные платёжные системы. После оплаты доступ появляется сразу! 💳",
  "доступ": "Доступ к купленным видео сохраняется навсегда — смотрите в любое удобное время в личном кабинете. ♾️",
  "форум": "Carnival Dragon — наш форум, где команда отвечает на вопросы и публикует анонсы новинок. Загляните! 🐉",
  "возврат": "Каждый случай рассматриваем индивидуально. Опишите ситуацию подробнее, и мы разберёмся! 🤝",
  "видео": "В каталоге Carnival Pantera — эксклюзивный контент, которого нет больше нигде. Новинки появляются регулярно! ⭐",
  "новинки": "Все анонсы новинок публикуются первыми на форуме Carnival Dragon — не пропустите! 🔥",
  "пароль": "Для сброса пароля воспользуйтесь кнопкой «Забыли пароль?» на странице входа. Письмо придёт на вашу почту. 📧",
  "регистрация": "Регистрация простая: укажите email, придумайте пароль — и вы уже в системе! Занимает меньше минуты. ✅",
  "привет": "Привет! 👋 Я чат-бот техподдержки Carnival Pantera. Чем могу помочь? Спросите про покупку видео, форум Dragon или что-то другое!",
  "здравствуй": "Здравствуйте! 👋 Я здесь, чтобы помочь с вопросами о Carnival Pantera. Что вас интересует?",
  "помощь": "Я помогу с вопросами о покупках, доступе к видео, форуме Carnival Dragon и платёжными вопросами. Что именно вас интересует? 🛠️",
  "спасибо": "Рад помочь! 😊 Если появятся ещё вопросы — я здесь. Приятного просмотра на Carnival Pantera! 🎬",
}

function getBotResponse(userText: string): string {
  const lower = userText.toLowerCase()
  for (const [keyword, answer] of Object.entries(FAQ_ANSWERS)) {
    if (lower.includes(keyword)) return answer
  }
  return "Хороший вопрос! 🤔 Я передам ваш запрос команде — они ответят в ближайшее время. Также можете написать на форуме Carnival Dragon для быстрого ответа от команды! 🐉"
}

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Привет! 👋 Я чат-бот техподдержки Carnival Pantera. Спросите про покупку видео, форум Carnival Dragon или что-то другое!",
      isBot: true,
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const sendMessage = () => {
    if (!input.trim()) return

    const userMsg: Message = { id: Date.now(), text: input, isBot: false }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      const botResponse = getBotResponse(input)
      setIsTyping(false)
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: botResponse, isBot: true }])
    }, 900)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage()
  }

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[9998] w-80 sm:w-96 chat-pop">
          <div className="bg-[#0d0d1a] border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ height: 460 }}>
            {/* Header */}
            <div className="carnival-gradient-bg px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-base">🎪</div>
                <div>
                  <p className="text-white font-semibold text-sm font-orbitron">Техподдержка</p>
                  <p className="text-white/70 text-xs">Carnival Pantera</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-white/70 text-xs">Онлайн</span>
                <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white ml-2">
                  <Icon name="X" size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[#0d0d1a]">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
                  {msg.isBot && (
                    <div className="w-6 h-6 rounded-full carnival-gradient-bg flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-1">
                      🎪
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.isBot
                        ? "bg-[#1a1a2e] text-gray-200 rounded-tl-sm"
                        : "carnival-gradient-bg text-white rounded-tr-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="w-6 h-6 rounded-full carnival-gradient-bg flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-1">
                    🎪
                  </div>
                  <div className="bg-[#1a1a2e] px-4 py-3 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            <div className="px-4 py-2 bg-[#0d0d1a] border-t border-purple-500/10 flex gap-2 overflow-x-auto">
              {["Купить видео", "Форум Dragon", "Возврат"].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setInput(q)
                    setTimeout(() => {
                      const userMsg: Message = { id: Date.now(), text: q, isBot: false }
                      setMessages((prev) => [...prev, userMsg])
                      setInput("")
                      setIsTyping(true)
                      setTimeout(() => {
                        setIsTyping(false)
                        setMessages((prev) => [...prev, { id: Date.now() + 1, text: getBotResponse(q), isBot: true }])
                      }, 900)
                    }, 0)
                  }}
                  className="flex-shrink-0 text-xs px-3 py-1 rounded-full border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-colors whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-4 py-3 bg-[#0d0d1a] border-t border-purple-500/10 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Напишите вопрос..."
                className="bg-[#1a1a2e] border-purple-500/30 text-white placeholder:text-gray-500 focus:border-purple-400 text-sm"
              />
              <Button
                onClick={sendMessage}
                size="sm"
                className="carnival-gradient-bg hover:opacity-90 border-0 px-3"
                disabled={!input.trim()}
              >
                <Icon name="Send" size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full carnival-gradient-bg shadow-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center"
        style={{ boxShadow: "0 0 20px rgba(168,85,247,0.4)" }}
      >
        {isOpen ? (
          <Icon name="X" size={22} className="text-white" />
        ) : (
          <Icon name="MessageCircle" size={22} className="text-white" />
        )}
      </button>
    </>
  )
}
