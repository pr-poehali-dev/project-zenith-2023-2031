import { useState, useEffect, useCallback } from "react"
import Icon from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AdminPosts } from "@/components/admin/AdminPosts"
import { AdminMembers } from "@/components/admin/AdminMembers"
import { AdminBlacklist } from "@/components/admin/AdminBlacklist"
import {
  API, ADMIN_PASSWORD,
  type AdminTab, type ForumPost, type Member, type BlacklistEntry,
  parseBody,
} from "@/components/admin/admin-types"

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
            {(tab === "questions" || tab === "requests") && (
              <AdminPosts
                tab={tab}
                posts={posts}
                answerMap={answerMap}
                saving={saving}
                saved={saved}
                setAnswerMap={setAnswerMap}
                sendAnswer={sendAnswer}
              />
            )}

            {tab === "members" && (
              <AdminMembers
                members={members}
                moderators={moderators}
                newMember={newMember}
                addingMember={addingMember}
                memberAdded={memberAdded}
                editId={editId}
                editData={editData}
                setNewMember={setNewMember}
                setEditId={setEditId}
                setEditData={setEditData}
                addMember={addMember}
                saveMember={saveMember}
                deleteMember={deleteMember}
              />
            )}

            {(tab === "blacklist" || tab === "bans") && (
              <AdminBlacklist
                tab={tab}
                blacklist={blacklist}
                newEntry={newEntry}
                setNewEntry={setNewEntry}
                setBlacklist={setBlacklist}
              />
            )}
          </>
        )}

        {/* Publish passwords info */}
        <div className="mt-10 p-5 bg-[#0d0d1a] rounded-2xl border border-yellow-500/20">
          <p className="text-yellow-300 font-semibold text-sm flex items-center gap-2 mb-3">
            <Icon name="Lock" size={15} /> Пароли для публикации на сайте
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-black/30 px-4 py-2.5 rounded-xl">
              <span className="text-gray-400 text-sm">Владелец</span>
              <code className="text-yellow-300 text-sm font-mono bg-yellow-500/10 px-2 py-0.5 rounded">owner2025</code>
            </div>
            <div className="flex items-center justify-between bg-black/30 px-4 py-2.5 rounded-xl">
              <span className="text-gray-400 text-sm">Директор</span>
              <code className="text-purple-300 text-sm font-mono bg-purple-500/10 px-2 py-0.5 rounded">director2025</code>
            </div>
          </div>
          <p className="text-gray-600 text-xs mt-3">Введите пароль при нажатии кнопок «Опубликовать» и «Разместить» на сайте.</p>
        </div>
      </div>
    </div>
  )
}