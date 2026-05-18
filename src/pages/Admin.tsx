import { useState, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Icon from "@/components/ui/icon"

const API = "https://functions.poehali.dev/6d575e2a-93a2-41c0-b2ff-4a247ee4f5b4"
const ADMIN_PASSWORD = "carnival2025"

const ROLES = [
  "Владелец",
  "Заместитель Владельца",
  "Директор",
  "Руководитель",
  "Заместитель Руководителя",
  "Администрация",
  "Техническая поддержка",
  "Бухгалтер",
  "Модератор",
  "Участник",
]

const ROLE_COLORS: Record<string, string> = {
  "Владелец": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "Заместитель Владельца": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Директор": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Руководитель": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Заместитель Руководителя": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "Администрация": "bg-green-500/20 text-green-300 border-green-500/30",
  "Техническая поддержка": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Бухгалтер": "bg-pink-500/20 text-pink-300 border-pink-500/30",
  "Модератор": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  "Участник": "bg-gray-500/20 text-gray-300 border-gray-500/30",
}

const AVATAR_GRADIENTS = [
  "bg-gradient-to-br from-purple-500 to-blue-600",
  "bg-gradient-to-br from-blue-500 to-cyan-600",
  "bg-gradient-to-br from-orange-500 to-red-600",
  "bg-gradient-to-br from-cyan-500 to-purple-600",
  "bg-gradient-to-br from-pink-500 to-orange-500",
]

type AdminTab = "questions" | "requests" | "members" | "blacklist" | "bans"

type ForumPost = {
  id: number
  author: string
  avatar: string
  text: string
  date: string
  answer?: string | null
  answered: boolean
}

type Member = {
  id: number
  name: string
  vk_link: string
  tg_link: string
  role: string
  is_moderator: boolean
  note: string
  date: string
}

const parseBody = <T,>(raw: unknown): T => {
  if (typeof raw === "string") return JSON.parse(raw) as T
  return raw as T
}

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState("")
  const [pwError, setPwError] = useState(false)
  const [tab, setTab] = useState<AdminTab>("questions")

  const [questions, setQuestions] = useState<ForumPost[]>([])
  const [requests, setRequests] = useState<ForumPost[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(false)

  const [answerMap, setAnswerMap] = useState<Record<number, string>>({})
  const [saving, setSaving] = useState<number | null>(null)
  const [saved, setSaved] = useState<number | null>(null)

  const [newMember, setNewMember] = useState({ name: "", vk_link: "", tg_link: "", role: "Модератор", is_moderator: false, note: "" })
  const [addingMember, setAddingMember] = useState(false)
  const [memberAdded, setMemberAdded] = useState(false)

  const [editId, setEditId] = useState<number | null>(null)
  const [editData, setEditData] = useState<Partial<Member>>({})

  type BlacklistEntry = { id: number; name: string; reason: string; date: string; type: "blacklist" | "ban"; duration?: string }
  const [blacklist, setBlacklist] = useState<BlacklistEntry[]>([
    { id: 1, name: "Дмитрий П.", reason: "Мошенничество при покупке", date: "15.05.2026", type: "blacklist" },
    { id: 2, name: "Анонимный#2281", reason: "Спам и флуд в чате", date: "18.05.2026", type: "ban", duration: "7 дней" },
    { id: 3, name: "Виктор С.", reason: "Попытка взлома аккаунта", date: "19.05.2026", type: "ban", duration: "Навсегда" },
  ])
  const [newEntry, setNewEntry] = useState({ name: "", reason: "", type: "blacklist" as "blacklist" | "ban", duration: "" })

  const login = () => {
    if (password === ADMIN_PASSWORD) { setAuthed(true) }
    else { setPwError(true); setTimeout(() => setPwError(false), 2000) }
  }

  const fetchData = useCallback(async (kind: AdminTab) => {
    setLoading(true)
    try {
      const res = await fetch(`${API}?kind=${kind}&action=list`)
      const raw = await res.json()
      const data = parseBody<ForumPost[] | Member[]>(raw)
      if (kind === "questions") setQuestions(data as ForumPost[])
      else if (kind === "requests") setRequests(data as ForumPost[])
      else setMembers(data as Member[])
    } catch { /* молча */ } finally { setLoading(false) }
  }, [])

  useEffect(() => { if (authed) fetchData(tab) }, [authed, tab, fetchData])

  const sendAnswer = async (kind: "questions" | "requests", id: number) => {
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
      const updated = parseBody<ForumPost>(raw)
      const setter = kind === "questions" ? setQuestions : setRequests
      setter(prev => prev.map(p => p.id === id ? { ...updated, answer: updated.answer || null } : p))
      setAnswerMap(prev => { const n = { ...prev }; delete n[id]; return n })
      setSaved(id); setTimeout(() => setSaved(null), 2500)
    } catch { /* молча */ } finally { setSaving(null) }
  }

  const addMember = async () => {
    if (!newMember.name.trim() || addingMember) return
    setAddingMember(true)
    try {
      const res = await fetch(`${API}?kind=members&action=create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      })
      const raw = await res.json()
      const m = parseBody<Member>(raw)
      setMembers(prev => [m, ...prev])
      setNewMember({ name: "", vk_link: "", tg_link: "", role: "Модератор", is_moderator: false, note: "" })
      setMemberAdded(true); setTimeout(() => setMemberAdded(false), 2500)
    } catch { /* молча */ } finally { setAddingMember(false) }
  }

  const saveMember = async (id: number) => {
    try {
      const res = await fetch(`${API}?kind=members&action=update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editData }),
      })
      const raw = await res.json()
      const m = parseBody<Member>(raw)
      setMembers(prev => prev.map(p => p.id === id ? m : p))
      setEditId(null); setEditData({})
    } catch { /* молча */ }
  }

  const deleteMember = async (id: number) => {
    if (!confirm("Удалить участника?")) return
    try {
      await fetch(`${API}?kind=members&action=delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      setMembers(prev => prev.filter(p => p.id !== id))
    } catch { /* молча */ }
  }

  const posts = tab === "questions" ? questions : requests
  const moderators = members.filter(m => m.is_moderator)

  // ── LOGIN ─────────────────────────────────────────────────────────────────
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
            <Input type="password" placeholder="Пароль администратора"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()}
              className={`bg-[#1a1a2e] text-white placeholder:text-gray-500 ${pwError ? "border-red-500" : "border-purple-500/30"}`} />
            {pwError && <p className="text-red-400 text-xs text-center">Неверный пароль</p>}
            <Button onClick={login} className="w-full carnival-gradient-bg hover:opacity-90 text-white border-0 font-semibold">Войти</Button>
          </div>
          <p className="text-center mt-4">
            <a href="/" className="text-gray-500 text-sm hover:text-purple-400 transition-colors">← На сайт</a>
          </p>
        </div>
      </div>
    )
  }

  // ── PANEL ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black">
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-purple-500/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 carnival-gradient-bg rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-orbitron font-bold text-sm">Панель администратора</p>
            <p className="text-gray-500 text-xs">Carnival Dragon</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="text-gray-400 hover:text-purple-400 text-sm transition-colors flex items-center gap-1">
            <Icon name="ExternalLink" size={14} /> Сайт
          </a>
          <button onClick={() => setAuthed(false)} className="text-gray-500 hover:text-red-400 text-sm transition-colors flex items-center gap-1">
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
            { label: "Участников", value: members.length, color: "text-green-400", icon: "Users" },
          ].map(s => (
            <div key={s.label} className="bg-[#0d0d1a] rounded-xl border border-purple-500/15 p-4 text-center">
              <Icon name={s.icon} size={20} className={`${s.color} mx-auto mb-1`} />
              <p className={`text-2xl font-bold font-orbitron ${s.color}`}>{s.value}</p>
              <p className="text-gray-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {([
            { key: "questions" as AdminTab, label: "Вопросы", icon: "MessageSquare", color: "bg-purple-500/20 text-purple-300" },
            { key: "requests" as AdminTab, label: "Заявки", icon: "ClipboardList", color: "bg-orange-500/20 text-orange-300" },
            { key: "members" as AdminTab, label: "Участники", icon: "Users", color: "bg-blue-500/20 text-blue-300" },
            { key: "blacklist" as AdminTab, label: "Чёрный список", icon: "UserX", color: "bg-red-500/20 text-red-300" },
            { key: "bans" as AdminTab, label: "Баны", icon: "Ban", color: "bg-red-900/30 text-red-400" },
          ]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${tab === t.key ? `${t.color} border-current` : "border-gray-800 text-gray-500 hover:text-gray-300"}`}>
              <Icon name={t.icon} size={14} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-500 text-sm">
            {tab === "members" ? `${members.length} участников · ${moderators.length} модераторов` : `${posts.length} записей`}
          </p>
          <button onClick={() => fetchData(tab)} className="flex items-center gap-1 text-purple-400 text-sm hover:text-purple-300 transition-colors">
            <Icon name="RefreshCw" size={14} /> Обновить
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">
            <Icon name="Loader" size={32} className="animate-spin mx-auto mb-3" />
            <p>Загружаем данные...</p>
          </div>
        ) : (
          <>
            {/* ── ВОПРОСЫ / ЗАЯВКИ ── */}
            {(tab === "questions" || tab === "requests") && (
              posts.length === 0
                ? <div className="text-center py-16 text-gray-600"><Icon name="Inbox" size={40} className="mx-auto mb-3 opacity-40" /><p>Нет записей</p></div>
                : <div className="space-y-4">
                  {posts.map((post, i) => (
                    <div key={post.id} className={`rounded-2xl border ${post.answered ? "border-green-500/15" : tab === "questions" ? "border-purple-500/25" : "border-orange-500/25"} bg-[#0d0d1a] p-5`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]}`}>{post.avatar}</div>
                        <div className="flex-1">
                          <p className="text-white font-semibold text-sm">{post.author}</p>
                          <p className="text-gray-500 text-xs">{post.date} · ID #{post.id}</p>
                        </div>
                        {post.answered
                          ? <Badge className="bg-green-500/20 text-green-300 border-0 text-xs">{tab === "questions" ? "Отвечено" : "Закрыта"}</Badge>
                          : <Badge className={`${tab === "questions" ? "bg-yellow-500/20 text-yellow-300" : "bg-orange-500/20 text-orange-300"} border-0 text-xs`}>{tab === "questions" ? "Ожидает" : "В работе"}</Badge>
                        }
                      </div>
                      <p className="text-gray-200 text-sm leading-relaxed mb-3 bg-white/5 rounded-xl p-3">{post.text}</p>
                      {post.answer && (
                        <div className={`ml-3 pl-3 border-l-2 ${tab === "questions" ? "border-purple-500/50" : "border-orange-500/50"} mb-3`}>
                          <p className={`text-xs font-bold mb-1 ${tab === "questions" ? "text-purple-300" : "text-orange-300"}`}>🐉 Ответ команды</p>
                          <p className="text-gray-300 text-sm">{post.answer}</p>
                        </div>
                      )}
                      {!post.answered && (
                        <div className="space-y-2 mt-3">
                          <Textarea placeholder="Введите ответ..."
                            value={answerMap[post.id] || ""} onChange={e => setAnswerMap(prev => ({ ...prev, [post.id]: e.target.value }))}
                            rows={3} className={`bg-[#1a1a2e] text-white placeholder:text-gray-600 text-sm resize-none ${tab === "questions" ? "border-purple-500/30" : "border-orange-500/30"}`} />
                          <div className="flex items-center gap-2">
                            <Button onClick={() => sendAnswer(tab, post.id)} disabled={!answerMap[post.id]?.trim() || saving === post.id}
                              size="sm" className="carnival-gradient-bg hover:opacity-90 text-white border-0 text-xs">
                              {saving === post.id ? "Сохраняем..." : "Ответить и закрыть"}
                            </Button>
                            {saved === post.id && <span className="text-green-400 text-xs flex items-center gap-1"><Icon name="CheckCircle" size={12} /> Сохранено</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
            )}

            {/* ── УЧАСТНИКИ & РОЛИ ── */}
            {tab === "members" && (
              <div className="space-y-6">

                {/* Форма добавления */}
                <Card className="carnival-border bg-[#0d0d1a] border-0">
                  <CardContent className="pt-5 space-y-3">
                    <p className="text-white font-orbitron font-semibold text-sm">Добавить участника / выдать роль</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input placeholder="Имя *" value={newMember.name} onChange={e => setNewMember(p => ({ ...p, name: e.target.value }))}
                        className="bg-[#1a1a2e] border-purple-500/30 text-white placeholder:text-gray-500 text-sm" />
                      <select value={newMember.role} onChange={e => setNewMember(p => ({ ...p, role: e.target.value }))}
                        className="bg-[#1a1a2e] border border-purple-500/30 text-white rounded-md px-3 py-2 text-sm">
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <Input placeholder="Ссылка ВКонтакте" value={newMember.vk_link} onChange={e => setNewMember(p => ({ ...p, vk_link: e.target.value }))}
                        className="bg-[#1a1a2e] border-purple-500/30 text-white placeholder:text-gray-500 text-sm" />
                      <Input placeholder="Telegram @username" value={newMember.tg_link} onChange={e => setNewMember(p => ({ ...p, tg_link: e.target.value }))}
                        className="bg-[#1a1a2e] border-purple-500/30 text-white placeholder:text-gray-500 text-sm" />
                    </div>
                    <Input placeholder="Заметка (необязательно)" value={newMember.note} onChange={e => setNewMember(p => ({ ...p, note: e.target.value }))}
                      className="bg-[#1a1a2e] border-purple-500/30 text-white placeholder:text-gray-500 text-sm" />
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <div onClick={() => setNewMember(p => ({ ...p, is_moderator: !p.is_moderator }))}
                        className={`w-10 h-5 rounded-full transition-all duration-200 flex-shrink-0 ${newMember.is_moderator ? "carnival-gradient-bg" : "bg-gray-700"} relative`}>
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 ${newMember.is_moderator ? "left-5" : "left-0.5"}`} />
                      </div>
                      <span className="text-gray-300 text-sm">Назначить модератором</span>
                    </label>
                    {memberAdded && <p className="text-green-400 text-xs flex items-center gap-1"><Icon name="CheckCircle" size={13} /> Участник добавлен!</p>}
                    <Button onClick={addMember} disabled={!newMember.name.trim() || addingMember}
                      className="carnival-gradient-bg hover:opacity-90 text-white border-0 text-sm">
                      {addingMember ? "Добавляем..." : "Добавить участника"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Модераторы */}
                {moderators.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Icon name="ShieldCheck" size={12} className="text-indigo-400" /> Модераторы ({moderators.length})
                    </p>
                    <div className="space-y-2">
                      {moderators.map((m, i) => (
                        <MemberRow key={m.id} member={m} index={i} editId={editId} editData={editData}
                          setEditId={setEditId} setEditData={setEditData} onSave={saveMember} onDelete={deleteMember} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Все участники */}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Icon name="Users" size={12} className="text-purple-400" /> Все участники ({members.length})
                  </p>
                  {members.length === 0
                    ? <p className="text-center text-gray-600 py-8 text-sm">Участников пока нет — добавьте первого!</p>
                    : <div className="space-y-2">
                      {members.map((m, i) => (
                        <MemberRow key={m.id} member={m} index={i} editId={editId} editData={editData}
                          setEditId={setEditId} setEditData={setEditData} onSave={saveMember} onDelete={deleteMember} />
                      ))}
                    </div>
                  }
                </div>
              </div>
            )}
            {/* ── ЧЁРНЫЙ СПИСОК / БАНЫ ── */}
            {(tab === "blacklist" || tab === "bans") && (
              <div className="space-y-6">
                {/* Add form */}
                <div className="bg-[#0d0d1a] rounded-2xl border border-red-500/20 p-5">
                  <p className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Icon name={tab === "bans" ? "Ban" : "UserX"} size={16} className="text-red-400" />
                    {tab === "bans" ? "Выдать бан" : "Добавить в чёрный список"}
                  </p>
                  <div className="space-y-3">
                    <Input placeholder="Имя / никнейм пользователя" value={newEntry.name}
                      onChange={e => setNewEntry(p => ({ ...p, name: e.target.value }))}
                      className="bg-[#1a1a2e] border-red-500/30 text-white placeholder:text-gray-500 text-sm" />
                    <Input placeholder="Причина" value={newEntry.reason}
                      onChange={e => setNewEntry(p => ({ ...p, reason: e.target.value }))}
                      className="bg-[#1a1a2e] border-red-500/30 text-white placeholder:text-gray-500 text-sm" />
                    <div className="flex gap-3">
                      <select value={newEntry.type}
                        onChange={e => setNewEntry(p => ({ ...p, type: e.target.value as "blacklist" | "ban" }))}
                        className="flex-1 bg-[#1a1a2e] border border-red-500/30 text-white rounded-md px-3 py-2 text-sm">
                        <option value="blacklist">Чёрный список</option>
                        <option value="ban">Бан</option>
                      </select>
                      {newEntry.type === "ban" && (
                        <Input placeholder="Срок (7 дней / Навсегда)" value={newEntry.duration}
                          onChange={e => setNewEntry(p => ({ ...p, duration: e.target.value }))}
                          className="flex-1 bg-[#1a1a2e] border-red-500/30 text-white placeholder:text-gray-500 text-sm" />
                      )}
                    </div>
                    <Button
                      onClick={() => {
                        if (!newEntry.name.trim()) return
                        const entry = { id: Date.now(), name: newEntry.name, reason: newEntry.reason, date: new Date().toLocaleDateString("ru-RU"), type: newEntry.type, duration: newEntry.duration || undefined }
                        setBlacklist(prev => [entry, ...prev])
                        setNewEntry({ name: "", reason: "", type: "blacklist", duration: "" })
                      }}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-sm">
                      {tab === "bans" ? "Выдать бан" : "Добавить в список"}
                    </Button>
                  </div>
                </div>

                {/* List */}
                <div className="space-y-3">
                  {blacklist.filter(e => tab === "bans" ? e.type === "ban" : e.type === "blacklist").map(entry => (
                    <div key={entry.id} className="bg-[#0d0d1a] rounded-xl border border-red-500/15 p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <Icon name={entry.type === "ban" ? "Ban" : "UserX"} size={18} className="text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm">{entry.name}</p>
                        <p className="text-gray-400 text-xs">{entry.reason}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-gray-600 text-xs">{entry.date}</span>
                          {entry.duration && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">{entry.duration}</span>}
                        </div>
                      </div>
                      <button onClick={() => setBlacklist(prev => prev.filter(e => e.id !== entry.id))}
                        className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                  ))}
                  {blacklist.filter(e => tab === "bans" ? e.type === "ban" : e.type === "blacklist").length === 0 && (
                    <div className="text-center py-12 text-gray-600">
                      <Icon name="CheckCircle" size={36} className="mx-auto mb-3 opacity-40" />
                      <p>Список пуст — всё чисто!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function MemberRow({ member, index, editId, editData, setEditId, setEditData, onSave, onDelete }: {
  member: Member
  index: number
  editId: number | null
  editData: Partial<Member>
  setEditId: (id: number | null) => void
  setEditData: (d: Partial<Member>) => void
  onSave: (id: number) => void
  onDelete: (id: number) => void
}) {
  const isEditing = editId === member.id
  const roleClass = ROLE_COLORS[member.role] || ROLE_COLORS["Участник"]

  const startEdit = () => {
    setEditId(member.id)
    setEditData({ role: member.role, vk_link: member.vk_link, tg_link: member.tg_link, note: member.note, is_moderator: member.is_moderator })
  }

  return (
    <div className={`rounded-xl border ${member.is_moderator ? "border-indigo-500/25" : "border-purple-500/10"} bg-[#0d0d1a] p-4`}>
      {!isEditing ? (
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]}`}>
            {member.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-white font-semibold text-sm">{member.name}</p>
              {member.is_moderator && <Icon name="ShieldCheck" size={13} className="text-indigo-400" />}
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge className={`${roleClass} border text-xs`}>{member.role}</Badge>
              {member.vk_link && <a href={member.vk_link} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs hover:underline">VK</a>}
              {member.tg_link && (
                <a href={member.tg_link.startsWith("http") ? member.tg_link : `https://t.me/${member.tg_link.replace("@", "")}`}
                  target="_blank" rel="noopener noreferrer" className="text-sky-400 text-xs hover:underline">TG</a>
              )}
              {member.note && <span className="text-gray-500 text-xs truncate max-w-[120px]">{member.note}</span>}
            </div>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={startEdit} className="p-1.5 rounded-lg text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 transition-all">
              <Icon name="Pencil" size={14} />
            </button>
            <button onClick={() => onDelete(member.id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
              <Icon name="Trash2" size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-purple-300 text-xs font-orbitron font-semibold mb-2">Редактирование: {member.name}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select value={editData.role || member.role} onChange={e => setEditData({ ...editData, role: e.target.value })}
              className="bg-[#1a1a2e] border border-purple-500/30 text-white rounded-md px-3 py-1.5 text-sm">
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <Input placeholder="ВКонтакте" value={editData.vk_link ?? member.vk_link} onChange={e => setEditData({ ...editData, vk_link: e.target.value })}
              className="bg-[#1a1a2e] border-purple-500/30 text-white placeholder:text-gray-600 text-sm h-9" />
            <Input placeholder="Telegram" value={editData.tg_link ?? member.tg_link} onChange={e => setEditData({ ...editData, tg_link: e.target.value })}
              className="bg-[#1a1a2e] border-purple-500/30 text-white placeholder:text-gray-600 text-sm h-9" />
            <Input placeholder="Заметка" value={editData.note ?? member.note} onChange={e => setEditData({ ...editData, note: e.target.value })}
              className="bg-[#1a1a2e] border-purple-500/30 text-white placeholder:text-gray-600 text-sm h-9" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div onClick={() => setEditData({ ...editData, is_moderator: !editData.is_moderator })}
              className={`w-10 h-5 rounded-full transition-all duration-200 flex-shrink-0 ${editData.is_moderator ? "carnival-gradient-bg" : "bg-gray-700"} relative`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 ${editData.is_moderator ? "left-5" : "left-0.5"}`} />
            </div>
            <span className="text-gray-400 text-xs">Является модератором</span>
          </label>
          <div className="flex gap-2">
            <Button onClick={() => onSave(member.id)} size="sm" className="carnival-gradient-bg hover:opacity-90 text-white border-0 text-xs h-8">Сохранить</Button>
            <Button onClick={() => { setEditId(null); setEditData({}) }} size="sm" variant="outline"
              className="text-gray-400 border-gray-600 hover:bg-gray-700 text-xs h-8 bg-transparent">Отмена</Button>
          </div>
        </div>
      )}
    </div>
  )
}