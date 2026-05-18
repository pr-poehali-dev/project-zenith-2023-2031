import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Icon from "@/components/ui/icon"
import { AVATAR_GRADIENTS, type AdminTab, type ForumPost } from "./admin-types"

type Props = {
  tab: AdminTab
  posts: ForumPost[]
  answerMap: Record<number, string>
  saving: number | null
  saved: number | null
  setAnswerMap: React.Dispatch<React.SetStateAction<Record<number, string>>>
  sendAnswer: (kind: "questions" | "requests", id: number) => void
}

export function AdminPosts({ tab, posts, answerMap, saving, saved, setAnswerMap, sendAnswer }: Props) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-gray-600">
        <Icon name="Inbox" size={40} className="mx-auto mb-3 opacity-40" />
        <p>Нет записей</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
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
                <Button onClick={() => sendAnswer(tab as "questions" | "requests", post.id)} disabled={!answerMap[post.id]?.trim() || saving === post.id}
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
  )
}
