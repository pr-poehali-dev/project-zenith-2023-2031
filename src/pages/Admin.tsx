import { useState, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import Icon from "@/components/ui/icon"

const API = "https://functions.poehali.dev/6d575e2a-93a2-41c0-b2ff-4a247ee4f5b4"
const ADMIN_PASSWORD = "carnival2025"

type ForumPost = {
  id: number
  author: string
  avatar: string
  text: string
  date: string
  answer?: string | null
  answered: boolean
}

type Tab = "questions" | "requests"

const AVATAR_GRADIENTS = [
  "bg-gradient-to-br from-purple-500 to-blue-600",
  "bg-gradient-to-br from-blue-500 to-cyan-600",
  "bg-gradient-to-br from-orange-500 to-red-600",
  "bg-gradient-to-br from-cyan-500 to-purple-600",
  "bg-gradient-to-br from-pink-500 to-orange-500",
]

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState("")
  const [pwError, setPwError] = useState(false)

  const [tab, setTab] = useState<Tab>("questions")
  const [questions, setQuestions] = useState<ForumPost[]>([])
  const [requests, setRequests] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(false)

  const [answerMap, setAnswerMap] = useState<Record<number, string>>({})
  const [saving, setSaving] = useState<number | null>(null)
  const [saved, setSaved] = useState<number | null>(null)

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
    } else {
      setPwError(true)
      setTimeout(() => setPwError(false), 2000)
    }
  }

  const fetchPosts = useCallback(async (kind: Tab) => {
    setLoading(true)
    try {
      const res = await fetch(`${API}?kind=${kind}&action=list`)
      const data = await res.json()
      const posts: ForumPost[] = (Array.isArray(data) ? data : JSON.parse(data)).map((p: ForumPost) => ({
        ...p, answer: p.answer || null,
      }))
      if (kind === "questions") setQuestions(posts)
      else setRequests(posts)
    } catch { /* молча */ } finally { setLoading(false) }
  }, [])

  useEffect(() => {
    if (authed) fetchPosts(tab)
  }, [authed, tab, fetchPosts])

  const sendAnswer = async (kind: Tab, id: number) => {
    const answer = answerMap[id]?.trim()
    if (!answer) return
    setSaving(id)
    try {
      const res = await fetch(`${API}?kind=${kind}&action=answer`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, answer }),
      })
      const raw = await res.json()
      const updated: ForumPost = typeof raw === "string" ? JSON.parse(raw) : raw
      const setter = kind === "questions" ? setQuestions : setRequests
      setter(prev => prev.map(p => p.id === id ? { ...updated, answer: updated.answer || null } : p))
      setAnswerMap(prev => { const n = { ...prev }; delete n[id]; return n })
      setSaved(id); setTimeout(() => setSaved(null), 2500)
    } catch { /* молча */ } finally { setSaving(null) }
  }

  const posts = tab === "questions" ? questions : requests
  const unanswered = posts.filter(p => !p.answered).length

  if (!authed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 carnival-gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="Shield" size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white font-orbitron">Панель администратора</h1>
            <p className="text-gray-500 text-sm mt-1">Carnival Pantera & Dragon</p>
          </div>
          <div className="bg-[#0d0d1a] rounded-2xl border border-purple-500/20 p-6 space-y-4">
            <Input
              type="password"
              placeholder="Пароль администратора"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()}
              className={`bg-[#1a1a2e] text-white placeholder:text-gray-500 ${pwError ? "border-red-500" : "border-purple-500/30"}`}
            />
            {pwError && <p className="text-red-400 text-xs text-center">Неверный пароль</p>}
            <Button onClick={login} className="w-full carnival-gradient-bg hover:opacity-90 text-white border-0 font-semibold">
              Войти
            </Button>
          </div>
          <p className="text-center mt-4">
            <a href="/" className="text-gray-500 text-sm hover:text-purple-400 transition-colors">← На сайт</a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-purple-500/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 carnival-gradient-bg rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-orbitron font-bold text-sm">Панель администратора</p>
            <p className="text-gray-500 text-xs">Carnival Dragon Forum</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="text-gray-400 hover:text-purple-400 text-sm transition-colors flex items-center gap-1">
            <Icon name="ExternalLink" size={14} /> Сайт
          </a>
          <button
            onClick={() => setAuthed(false)}
            className="text-gray-500 hover:text-red-400 text-sm transition-colors flex items-center gap-1"
          >
            <Icon name="LogOut" size={14} /> Выйти
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Вопросов", value: questions.length, color: "text-purple-400", icon: "MessageSquare" },
            { label: "Без ответа", value: questions.filter(p => !p.answered).length, color: "text-yellow-400", icon: "Clock" },
            { label: "Заявок", value: requests.length, color: "text-orange-400", icon: "ClipboardList" },
            { label: "В работе", value: requests.filter(p => !p.answered).length, color: "text-red-400", icon: "AlertCircle" },
          ].map(s => (
            <div key={s.label} className="bg-[#0d0d1a] rounded-xl border border-purple-500/15 p-4 text-center">
              <Icon name={s.icon} size={20} className={`${s.color} mx-auto mb-1`} />
              <p className={`text-2xl font-bold font-orbitron ${s.color}`}>{s.value}</p>
              <p className="text-gray-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-[#0d0d1a] p-1.5 rounded-2xl border border-purple-500/20">
          {([
            { key: "questions" as Tab, label: "Вопросы", icon: "MessageSquare" },
            { key: "requests" as Tab, label: "Заявки", icon: "ClipboardList" },
          ]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${tab === t.key ? "carnival-gradient-bg text-white" : "text-gray-400 hover:text-white"}`}>
              <Icon name={t.icon} size={15} /> {t.label}
              {tab !== t.key && unanswered > 0 && (
                <span className="w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  {(t.key === "questions" ? questions : requests).filter(p => !p.answered).length || ""}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Refresh */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-500 text-sm">{posts.length} записей</p>
          <button onClick={() => fetchPosts(tab)} className="flex items-center gap-1 text-purple-400 text-sm hover:text-purple-300 transition-colors">
            <Icon name="RefreshCw" size={14} /> Обновить
          </button>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="text-center py-16 text-gray-500">
            <Icon name="Loader" size={32} className="animate-spin mx-auto mb-3" />
            <p>Загружаем данные...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <Icon name="Inbox" size={40} className="mx-auto mb-3 opacity-40" />
            <p>Нет записей</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, i) => (
              <div key={post.id} className={`rounded-2xl border ${post.answered ? "border-green-500/15" : tab === "questions" ? "border-purple-500/25" : "border-orange-500/25"} bg-[#0d0d1a] p-5`}>
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]}`}>
                    {post.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{post.author}</p>
                    <p className="text-gray-500 text-xs">{post.date} · ID #{post.id}</p>
                  </div>
                  {post.answered
                    ? <Badge className="bg-green-500/20 text-green-300 border-0 text-xs">{tab === "questions" ? "Отвечено" : "Закрыта"}</Badge>
                    : <Badge className={`${tab === "questions" ? "bg-yellow-500/20 text-yellow-300" : "bg-orange-500/20 text-orange-300"} border-0 text-xs`}>{tab === "questions" ? "Ожидает" : "В работе"}</Badge>
                  }
                </div>

                {/* Text */}
                <p className="text-gray-200 text-sm leading-relaxed mb-3 bg-white/5 rounded-xl p-3">{post.text}</p>

                {/* Existing answer */}
                {post.answer && (
                  <div className={`ml-3 pl-3 border-l-2 ${tab === "questions" ? "border-purple-500/50" : "border-orange-500/50"} mb-3`}>
                    <p className={`text-xs font-bold mb-1 ${tab === "questions" ? "text-purple-300" : "text-orange-300"}`}>🐉 Ответ команды</p>
                    <p className="text-gray-300 text-sm">{post.answer}</p>
                  </div>
                )}

                {/* Answer form */}
                {!post.answered && (
                  <div className="space-y-2 mt-3">
                    <Textarea
                      placeholder={tab === "questions" ? "Введите ответ на вопрос..." : "Введите ответ по заявке..."}
                      value={answerMap[post.id] || ""}
                      onChange={e => setAnswerMap(prev => ({ ...prev, [post.id]: e.target.value }))}
                      rows={3}
                      className={`bg-[#1a1a2e] text-white placeholder:text-gray-600 text-sm resize-none ${tab === "questions" ? "border-purple-500/30" : "border-orange-500/30"}`}
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => sendAnswer(tab, post.id)}
                        disabled={!answerMap[post.id]?.trim() || saving === post.id}
                        size="sm"
                        className="carnival-gradient-bg hover:opacity-90 text-white border-0 text-xs"
                      >
                        {saving === post.id ? "Сохраняем..." : "Ответить и закрыть"}
                      </Button>
                      {saved === post.id && (
                        <span className="text-green-400 text-xs flex items-center gap-1">
                          <Icon name="CheckCircle" size={12} /> Ответ сохранён
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
