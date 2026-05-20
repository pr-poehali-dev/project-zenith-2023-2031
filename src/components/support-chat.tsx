import { useState, useRef, useEffect, useCallback } from "react"
import Icon from "@/components/ui/icon"

const AUTH_URL = "https://functions.poehali.dev/74b7a868-4833-440f-bd37-34cfa1fbb7ea"
const CHAT_URL = "https://functions.poehali.dev/6e998cf5-9a0d-4dd8-8d73-effc01322bfd"

type ChatMessage = {
  id: number
  text: string
  is_admin: boolean
  created_at: string
}

type User = {
  id: number
  username: string
  email: string
}

type AuthMode = "login" | "register"

function parseBody<T>(raw: unknown): T {
  if (typeof raw === "string") return JSON.parse(raw) as T
  return raw as T
}

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem("cp_user") || "null") } catch { return null }
  })
  const [token, setToken] = useState<string>(() => localStorage.getItem("cp_token") || "")

  const [authMode, setAuthMode] = useState<AuthMode>("login")
  const [authForm, setAuthForm] = useState({ username: "", email: "", password: "" })
  const [authError, setAuthError] = useState("")
  const [authLoading, setAuthLoading] = useState(false)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [onlineCount] = useState(23)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const scrollBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

  useEffect(() => { scrollBottom() }, [messages])

  const fetchHistory = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch(`${CHAT_URL}?action=history`, {
        headers: { "X-Session-Token": token }
      })
      const raw = await res.json()
      const data = parseBody<{ messages: ChatMessage[] }>(raw)
      setMessages(data.messages || [])
    } catch { /* ignore */ }
  }, [token])

  useEffect(() => {
    if (user && token) {
      fetchHistory()
      pollRef.current = setInterval(fetchHistory, 5000)
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [user, token, fetchHistory])

  const doAuth = async () => {
    setAuthError("")
    setAuthLoading(true)
    try {
      const body: Record<string, string> = { email: authForm.email, password: authForm.password }
      if (authMode === "register") body.username = authForm.username

      const res = await fetch(`${AUTH_URL}?action=${authMode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      const raw = await res.json()
      const data = parseBody<{ user?: User; token?: string; error?: string }>(raw)

      if (!res.ok || data.error) {
        setAuthError(data.error || "Ошибка входа")
        return
      }
      if (data.user && data.token) {
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem("cp_user", JSON.stringify(data.user))
        localStorage.setItem("cp_token", data.token)
      }
    } catch {
      setAuthError("Ошибка соединения")
    } finally {
      setAuthLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken("")
    setMessages([])
    localStorage.removeItem("cp_user")
    localStorage.removeItem("cp_token")
  }

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || sending || !token) return
    setSending(true)
    setInput("")
    try {
      await fetch(`${CHAT_URL}?action=send`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Token": token },
        body: JSON.stringify({ text })
      })
      await fetchHistory()
    } catch { /* ignore */ } finally {
      setSending(false)
    }
  }

  const formatTime = (str: string) => {
    try {
      const d = new Date(str)
      return d.toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })
    } catch { return "" }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9997] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 neon-button-primary"
        style={{ boxShadow: "0 0 20px rgba(168,85,247,0.5)" }}>
        {isOpen ? <Icon name="X" size={22} /> : <Icon name="MessageCircle" size={24} />}
      </button>

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
                  alt="CP" className="w-8 h-8 rounded-full object-cover"
                  style={{ boxShadow: "0 0 8px rgba(168,85,247,0.5)" }} />
                <div>
                  <p className="text-white font-semibold text-sm font-orbitron">Чат поддержки</p>
                  <p className="text-purple-300/70 text-xs">Carnival Pantera</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full" style={{ boxShadow: "0 0 6px rgba(74,222,128,0.8)" }} />
                <span className="text-green-300 text-xs font-semibold">{onlineCount} онлайн</span>
                {user && (
                  <button onClick={logout} className="text-white/40 hover:text-red-400 ml-1 transition-colors" title="Выйти">
                    <Icon name="LogOut" size={14} />
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white ml-1 transition-colors">
                  <Icon name="X" size={16} />
                </button>
              </div>
            </div>

            {/* Auth screen */}
            {!user ? (
              <div className="flex-1 flex flex-col justify-center px-6 py-4 bg-[#0d0d1a]">
                <p className="text-white font-semibold text-center mb-1 font-orbitron">
                  {authMode === "login" ? "Войти в чат" : "Регистрация"}
                </p>
                <p className="text-gray-500 text-xs text-center mb-4">
                  {authMode === "login" ? "Войдите, чтобы написать нам" : "Создайте аккаунт для связи с поддержкой"}
                </p>

                <div className="space-y-2">
                  {authMode === "register" && (
                    <input
                      placeholder="Имя пользователя"
                      value={authForm.username}
                      onChange={e => setAuthForm(f => ({ ...f, username: e.target.value }))}
                      className="w-full bg-[#1a1a2e] border border-purple-500/20 rounded-xl px-3 py-2 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-purple-500/50"
                    />
                  )}
                  <input
                    placeholder="Email"
                    type="email"
                    value={authForm.email}
                    onChange={e => setAuthForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-purple-500/20 rounded-xl px-3 py-2 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-purple-500/50"
                  />
                  <input
                    placeholder="Пароль"
                    type="password"
                    value={authForm.password}
                    onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))}
                    onKeyDown={e => e.key === "Enter" && doAuth()}
                    className="w-full bg-[#1a1a2e] border border-purple-500/20 rounded-xl px-3 py-2 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-purple-500/50"
                  />
                  {authError && <p className="text-red-400 text-xs text-center">{authError}</p>}
                  <button
                    onClick={doAuth}
                    disabled={authLoading}
                    className="w-full py-2.5 rounded-xl neon-button-primary text-white text-sm font-semibold disabled:opacity-50">
                    {authLoading ? "..." : authMode === "login" ? "Войти" : "Зарегистрироваться"}
                  </button>
                </div>

                <button
                  onClick={() => { setAuthMode(m => m === "login" ? "register" : "login"); setAuthError("") }}
                  className="mt-3 text-purple-400 text-xs text-center hover:text-purple-300 transition-colors">
                  {authMode === "login" ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
                </button>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[#0d0d1a]">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Icon name="MessageCircle" size={32} className="text-purple-500/30 mb-2" />
                      <p className="text-gray-600 text-sm">Напишите нам — мы ответим!</p>
                    </div>
                  )}
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.is_admin ? "justify-start" : "justify-end"} w-full`}>
                      {msg.is_admin && (
                        <img src="https://cdn.poehali.dev/projects/3d74854d-9358-4a23-8c6e-df0850b2ae4f/bucket/393248e3-d91b-458e-8812-026d76f4809e.jpg"
                          alt="CP" className="w-6 h-6 rounded-full object-cover mr-2 flex-shrink-0 mt-1" />
                      )}
                      <div className="max-w-[75%]">
                        <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                          msg.is_admin
                            ? "bg-[#1e1e35] border border-purple-500/20 text-gray-200 rounded-tl-sm"
                            : "text-white rounded-tr-sm"
                        }`}
                        style={!msg.is_admin ? { background: "linear-gradient(135deg, rgba(168,85,247,0.5), rgba(59,130,246,0.5))" } : {}}>
                          {msg.text}
                        </div>
                        <p className={`text-xs mt-0.5 text-gray-600 ${msg.is_admin ? "text-left" : "text-right"}`}>
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="px-3 py-3 bg-[#0d0d1a] border-t border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-purple-300/60 text-xs">
                      <Icon name="User" size={10} className="inline mr-1" />{user.username}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && sendMessage()}
                      placeholder="Напишите сообщение..."
                      className="flex-1 bg-[#1a1a2e] border border-purple-500/20 rounded-xl px-3 py-2.5 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-purple-500/50"
                    />
                    <button onClick={sendMessage} disabled={sending}
                      className="w-10 h-10 rounded-xl neon-button-primary flex items-center justify-center flex-shrink-0 disabled:opacity-50">
                      <Icon name="Send" size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
