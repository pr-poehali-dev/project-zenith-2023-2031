import { useState, useEffect, useRef, useCallback } from "react"
import Icon from "@/components/ui/icon"
import { CHAT_URL, ADMIN_PASSWORD, type ChatUser, type ChatMsg, parseBody } from "./admin-types"

export function AdminChat() {
  const [users, setUsers] = useState<ChatUser[]>([])
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [reply, setReply] = useState("")
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const scrollBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  useEffect(() => { scrollBottom() }, [messages])

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${CHAT_URL}?action=admin_list`, {
        headers: { "X-Admin-Token": ADMIN_PASSWORD }
      })
      const raw = await res.json()
      const data = parseBody<{ users: ChatUser[] }>(raw)
      setUsers(data.users || [])
    } catch { /* ignore */ }
  }, [])

  const fetchMessages = useCallback(async (userId: number) => {
    setLoading(true)
    try {
      const res = await fetch(`${CHAT_URL}?action=admin_history&user_id=${userId}`, {
        headers: { "X-Admin-Token": ADMIN_PASSWORD }
      })
      const raw = await res.json()
      const data = parseBody<{ messages: ChatMsg[] }>(raw)
      setMessages(data.messages || [])
    } catch { /* ignore */ } finally { setLoading(false) }
  }, [])

  useEffect(() => {
    fetchUsers()
    const interval = setInterval(fetchUsers, 10000)
    return () => clearInterval(interval)
  }, [fetchUsers])

  useEffect(() => {
    if (!selectedUser) return
    fetchMessages(selectedUser.id)
    pollRef.current = setInterval(() => fetchMessages(selectedUser.id), 5000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [selectedUser, fetchMessages])

  const sendReply = async () => {
    const text = reply.trim()
    if (!text || sending || !selectedUser) return
    setSending(true)
    try {
      await fetch(`${CHAT_URL}?action=admin_reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Token": ADMIN_PASSWORD },
        body: JSON.stringify({ user_id: selectedUser.id, text })
      })
      setReply("")
      await fetchMessages(selectedUser.id)
      await fetchUsers()
    } catch { /* ignore */ } finally { setSending(false) }
  }

  const formatTime = (str: string) => {
    try {
      return new Date(str).toLocaleString("ru", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })
    } catch { return "" }
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-220px)] min-h-[400px]">
      {/* Users list */}
      <div className="w-64 flex-shrink-0 bg-[#0d0d1a] rounded-xl border border-purple-500/20 overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <span className="text-white font-semibold text-sm">Пользователи</span>
          <button onClick={fetchUsers} className="text-gray-500 hover:text-purple-400 transition-colors">
            <Icon name="RefreshCw" size={14} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {users.length === 0 && (
            <p className="text-gray-600 text-xs text-center py-8">Нет пользователей</p>
          )}
          {users.map(u => (
            <button
              key={u.id}
              onClick={() => setSelectedUser(u)}
              className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 ${selectedUser?.id === u.id ? "bg-purple-500/10" : ""}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{u.username}</p>
                  <p className="text-gray-600 text-xs truncate">{u.email}</p>
                </div>
                {u.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center flex-shrink-0">
                    {u.unread}
                  </span>
                )}
              </div>
              {u.last_message && (
                <p className="text-gray-600 text-xs mt-1">{formatTime(u.last_message)}</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 bg-[#0d0d1a] rounded-xl border border-purple-500/20 overflow-hidden flex flex-col">
        {!selectedUser ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <Icon name="MessageSquare" size={40} className="text-purple-500/20 mb-3" />
            <p className="text-gray-600 text-sm">Выберите пользователя слева</p>
          </div>
        ) : (
          <>
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-sm">{selectedUser.username}</p>
                <p className="text-gray-600 text-xs">{selectedUser.email}</p>
              </div>
              <button onClick={() => fetchMessages(selectedUser.id)} className="text-gray-500 hover:text-purple-400 transition-colors">
                <Icon name="RefreshCw" size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {loading && messages.length === 0 && (
                <p className="text-gray-600 text-xs text-center py-4">Загрузка...</p>
              )}
              {messages.length === 0 && !loading && (
                <p className="text-gray-600 text-xs text-center py-8">Нет сообщений</p>
              )}
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.is_admin ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[75%]">
                    <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.is_admin
                        ? "text-white rounded-tr-sm"
                        : "bg-[#1e1e35] border border-purple-500/20 text-gray-200 rounded-tl-sm"
                    }`}
                    style={msg.is_admin ? { background: "linear-gradient(135deg, rgba(168,85,247,0.5), rgba(59,130,246,0.5))" } : {}}>
                      {msg.text}
                    </div>
                    <p className={`text-xs mt-0.5 text-gray-600 ${msg.is_admin ? "text-right" : "text-left"}`}>
                      {msg.is_admin ? "Вы · " : `${selectedUser.username} · `}{formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-3 py-3 border-t border-white/5">
              <div className="flex gap-2 items-center">
                <input
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendReply()}
                  placeholder={`Ответить ${selectedUser.username}...`}
                  className="flex-1 bg-[#1a1a2e] border border-purple-500/20 rounded-xl px-3 py-2.5 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-purple-500/50"
                />
                <button onClick={sendReply} disabled={sending}
                  className="w-10 h-10 rounded-xl carnival-gradient-bg flex items-center justify-center flex-shrink-0 disabled:opacity-50">
                  <Icon name="Send" size={16} className="text-white" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
