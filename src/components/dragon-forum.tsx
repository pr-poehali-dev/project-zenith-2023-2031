import { useState, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Icon from "@/components/ui/icon"

const API = "https://functions.poehali.dev/6d575e2a-93a2-41c0-b2ff-4a247ee4f5b4"

type Tab = "news" | "questions" | "requests"

type NewsItem = {
  id: number
  title: string
  body: string
  date: string
  tag: string
  tagColor: string
}

type ForumPost = {
  id: number
  author: string
  avatar: string
  text: string
  date: string
  answer?: string | null
  answered: boolean
}

const NEWS: NewsItem[] = [
  {
    id: 1,
    title: "Новое пополнение каталога — 12 видео!",
    body: "Добавили свежую партию эксклюзивного контента. Загляните в каталог Carnival Pantera — там уже всё доступно для покупки.",
    date: "15 мая 2025",
    tag: "Новинки",
    tagColor: "bg-purple-500/20 text-purple-300",
  },
  {
    id: 2,
    title: "Carnival Dragon теперь с системой заявок",
    body: "Запустили официальный раздел заявок на форуме. Теперь оставлять обращения удобно прямо здесь — команда отвечает в течение суток.",
    date: "10 мая 2025",
    tag: "Обновление",
    tagColor: "bg-blue-500/20 text-blue-300",
  },
  {
    id: 3,
    title: "Техподдержка переехала в чат-бот",
    body: "Для быстрых вопросов запустили чат-бот в правом углу. Стандартные вопросы — мгновенный ответ. Сложные — передаёт напрямую автору.",
    date: "3 мая 2025",
    tag: "Анонс",
    tagColor: "bg-cyan-500/20 text-cyan-300",
  },
]

const AVATAR_GRADIENTS = [
  "bg-gradient-to-br from-purple-500 to-blue-600",
  "bg-gradient-to-br from-blue-500 to-cyan-600",
  "bg-gradient-to-br from-orange-500 to-red-600",
  "bg-gradient-to-br from-cyan-500 to-purple-600",
  "bg-gradient-to-br from-pink-500 to-orange-500",
]

function AvatarCircle({ initials, index }: { initials: string; index: number }) {
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]}`}>
      {initials}
    </div>
  )
}

function PostItem({ post, index, accentColor }: { post: ForumPost; index: number; accentColor: string }) {
  return (
    <div className={`rounded-2xl border ${accentColor === "purple" ? "border-purple-500/15" : "border-orange-500/15"} bg-[#0d0d1a] p-4 space-y-3`}>
      <div className="flex items-center gap-3">
        <AvatarCircle initials={post.avatar} index={index} />
        <div>
          <p className="text-white text-sm font-semibold">{post.author}</p>
          <p className="text-gray-500 text-xs">{post.date}</p>
        </div>
        <div className="ml-auto">
          {post.answered
            ? <Badge className="bg-green-500/20 text-green-300 border-0 text-xs">{accentColor === "orange" ? "Закрыта" : "Отвечено"}</Badge>
            : <Badge className={`${accentColor === "orange" ? "bg-orange-500/20 text-orange-300" : "bg-yellow-500/20 text-yellow-300"} border-0 text-xs`}>{accentColor === "orange" ? "В работе" : "Ожидает"}</Badge>
          }
        </div>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">{post.text}</p>
      {post.answer && (
        <div className={`ml-4 pl-4 border-l-2 ${accentColor === "orange" ? "border-orange-500/40" : "border-purple-500/40"}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">🐉</span>
            <p className={`${accentColor === "orange" ? "text-orange-300" : "text-purple-300"} text-xs font-bold font-orbitron`}>Команда Carnival Dragon</p>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{post.answer}</p>
        </div>
      )}
    </div>
  )
}

export function DragonForum() {
  const [tab, setTab] = useState<Tab>("news")
  const [questions, setQuestions] = useState<ForumPost[]>([])
  const [requests, setRequests] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(false)

  const [qName, setQName] = useState("")
  const [qText, setQText] = useState("")
  const [rName, setRName] = useState("")
  const [rText, setRText] = useState("")
  const [qSent, setQSent] = useState(false)
  const [rSent, setRSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const fetchPosts = useCallback(async (kind: "questions" | "requests") => {
    setLoading(true)
    try {
      const res = await fetch(`${API}?kind=${kind}&action=list`)
      const data = await res.json()
      const posts: ForumPost[] = (Array.isArray(data) ? data : JSON.parse(data)).map((p: ForumPost) => ({
        ...p,
        answer: p.answer || null,
      }))
      if (kind === "questions") setQuestions(posts)
      else setRequests(posts)
    } catch {
      // молча игнорируем
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (tab === "questions") fetchPosts("questions")
    if (tab === "requests") fetchPosts("requests")
  }, [tab, fetchPosts])

  const submitQuestion = async () => {
    if (!qName.trim() || !qText.trim() || submitting) return
    setSubmitting(true)
    try {
      const res = await fetch(`${API}?kind=questions&action=create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: qName.trim(), text: qText.trim() }),
      })
      const raw = await res.json()
      const post: ForumPost = typeof raw === "string" ? JSON.parse(raw) : raw
      setQuestions(prev => [{ ...post, answer: post.answer || null }, ...prev])
      setQName("")
      setQText("")
      setQSent(true)
      setTimeout(() => setQSent(false), 3000)
    } catch {
      // молча игнорируем
    } finally {
      setSubmitting(false)
    }
  }

  const submitRequest = async () => {
    if (!rName.trim() || !rText.trim() || submitting) return
    setSubmitting(true)
    try {
      const res = await fetch(`${API}?kind=requests&action=create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: rName.trim(), text: rText.trim() }),
      })
      const raw = await res.json()
      const post: ForumPost = typeof raw === "string" ? JSON.parse(raw) : raw
      setRequests(prev => [{ ...post, answer: post.answer || null }, ...prev])
      setRName("")
      setRText("")
      setRSent(true)
      setTimeout(() => setRSent(false), 3000)
    } catch {
      // молча игнорируем
    } finally {
      setSubmitting(false)
    }
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "news", label: "Новости", icon: "Newspaper" },
    { key: "questions", label: "Вопросы", icon: "MessageSquare" },
    { key: "requests", label: "Заявки", icon: "ClipboardList" },
  ]

  return (
    <section id="forum" className="py-24 bg-black">
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-4xl">🐉</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white font-orbitron">
              Carnival <span className="carnival-gradient">Dragon</span>
            </h2>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Официальный форум сообщества — новости, ответы на вопросы и обработка заявок командой
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-[#0d0d1a] p-1.5 rounded-2xl border border-purple-500/20">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                tab === t.key ? "carnival-gradient-bg text-white shadow-lg" : "text-gray-400 hover:text-white"
              }`}
            >
              <Icon name={t.icon} size={15} />
              <span className="hidden sm:inline">{t.label}</span>
              <span className="sm:hidden">{t.label.slice(0, 4)}</span>
            </button>
          ))}
        </div>

        {/* NEWS TAB */}
        {tab === "news" && (
          <div className="space-y-4">
            {NEWS.map(item => (
              <Card key={item.id} className="carnival-border bg-[#0d0d1a] border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-white font-orbitron font-bold text-base leading-snug">{item.title}</h3>
                    <Badge className={`${item.tagColor} border-0 flex-shrink-0 text-xs`}>{item.tag}</Badge>
                  </div>
                  <p className="text-gray-500 text-xs">{item.date}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm leading-relaxed">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* QUESTIONS TAB */}
        {tab === "questions" && (
          <div className="space-y-6">
            <Card className="carnival-border bg-[#0d0d1a] border-0">
              <CardContent className="pt-5 space-y-3">
                <p className="text-white font-orbitron font-semibold text-sm mb-3">Задать вопрос команде</p>
                <Input
                  placeholder="Ваше имя"
                  value={qName}
                  onChange={e => setQName(e.target.value)}
                  className="bg-[#1a1a2e] border-purple-500/30 text-white placeholder:text-gray-500 text-sm"
                />
                <Textarea
                  placeholder="Ваш вопрос..."
                  value={qText}
                  onChange={e => setQText(e.target.value)}
                  rows={3}
                  className="bg-[#1a1a2e] border-purple-500/30 text-white placeholder:text-gray-500 text-sm resize-none"
                />
                {qSent && (
                  <p className="text-green-400 text-xs flex items-center gap-1">
                    <Icon name="CheckCircle" size={13} /> Вопрос отправлен — команда ответит в ближайшее время!
                  </p>
                )}
                <Button
                  onClick={submitQuestion}
                  disabled={!qName.trim() || !qText.trim() || submitting}
                  className="carnival-gradient-bg hover:opacity-90 text-white border-0 text-sm"
                >
                  {submitting ? "Отправляем..." : "Отправить вопрос"}
                </Button>
              </CardContent>
            </Card>

            {loading ? (
              <div className="text-center text-gray-500 py-8">
                <Icon name="Loader" size={24} className="animate-spin mx-auto mb-2" />
                <p className="text-sm">Загружаем вопросы...</p>
              </div>
            ) : questions.length === 0 ? (
              <p className="text-center text-gray-600 py-8 text-sm">Вопросов пока нет — будьте первым!</p>
            ) : (
              <div className="space-y-4">
                {questions.map((q, i) => <PostItem key={q.id} post={q} index={i} accentColor="purple" />)}
              </div>
            )}
          </div>
        )}

        {/* REQUESTS TAB */}
        {tab === "requests" && (
          <div className="space-y-6">
            <Card className="carnival-border bg-[#0d0d1a] border-0">
              <CardContent className="pt-5 space-y-3">
                <p className="text-white font-orbitron font-semibold text-sm mb-1">Создать заявку</p>
                <p className="text-gray-500 text-xs mb-3">Опишите проблему подробно — команда рассмотрит в течение суток</p>
                <Input
                  placeholder="Ваше имя"
                  value={rName}
                  onChange={e => setRName(e.target.value)}
                  className="bg-[#1a1a2e] border-orange-500/30 text-white placeholder:text-gray-500 text-sm"
                />
                <Textarea
                  placeholder="Опишите проблему или запрос..."
                  value={rText}
                  onChange={e => setRText(e.target.value)}
                  rows={4}
                  className="bg-[#1a1a2e] border-orange-500/30 text-white placeholder:text-gray-500 text-sm resize-none"
                />
                {rSent && (
                  <p className="text-green-400 text-xs flex items-center gap-1">
                    <Icon name="CheckCircle" size={13} /> Заявка принята — рассмотрим в ближайшее время!
                  </p>
                )}
                <Button
                  onClick={submitRequest}
                  disabled={!rName.trim() || !rText.trim() || submitting}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 text-white border-0 text-sm"
                >
                  {submitting ? "Отправляем..." : "Отправить заявку"}
                </Button>
              </CardContent>
            </Card>

            {loading ? (
              <div className="text-center text-gray-500 py-8">
                <Icon name="Loader" size={24} className="animate-spin mx-auto mb-2" />
                <p className="text-sm">Загружаем заявки...</p>
              </div>
            ) : requests.length === 0 ? (
              <p className="text-center text-gray-600 py-8 text-sm">Заявок пока нет</p>
            ) : (
              <div className="space-y-4">
                {requests.map((r, i) => <PostItem key={r.id} post={r} index={i + 2} accentColor="orange" />)}
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  )
}
