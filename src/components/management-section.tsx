import { useState } from "react"
import Icon from "@/components/ui/icon"

type Manager = {
  id: number
  name: string
  role: string
  avatar: string
  stars: number
  points: number
  reviews: number
  specialty: string
  vk?: string
  tg?: string
}

const MANAGERS: Manager[] = [
  { id: 1, name: "Александр В.", role: "Владелец", avatar: "👑", stars: 5, points: 9850, reviews: 142, specialty: "Общее руководство, стратегия", vk: "https://vk.com", tg: "https://t.me" },
  { id: 2, name: "Мария С.", role: "Директор", avatar: "💎", stars: 5, points: 7200, reviews: 89, specialty: "Продажи аккаунтов, работа с клиентами", tg: "https://t.me" },
  { id: 3, name: "Денис К.", role: "Руководитель", avatar: "🔥", stars: 4, points: 5400, reviews: 67, specialty: "Игровые проекты, реклама", vk: "https://vk.com" },
  { id: 4, name: "Екатерина Л.", role: "Администрация", avatar: "⭐", stars: 4, points: 3800, reviews: 45, specialty: "Маркет, продукция", tg: "https://t.me" },
  { id: 5, name: "Роман Т.", role: "Модератор", avatar: "🛡️", stars: 5, points: 2900, reviews: 38, specialty: "Безопасность, чёрные списки", vk: "https://vk.com" },
]

const ROLE_COLORS: Record<string, string> = {
  "Владелец": "from-yellow-500 to-orange-500",
  "Директор": "from-purple-500 to-pink-500",
  "Руководитель": "from-blue-500 to-cyan-500",
  "Администрация": "from-green-500 to-teal-500",
  "Модератор": "from-indigo-500 to-blue-500",
}

export function ManagementSection() {
  const [reviewModal, setReviewModal] = useState<Manager | null>(null)
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState("")
  const [reviewName, setReviewName] = useState("")
  const [sent, setSent] = useState(false)

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => { setSent(false); setReviewModal(null); setRating(5); setReviewText(""); setReviewName("") }, 3000)
  }

  return (
    <section id="management" className="py-20 bg-[#050508] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 text-sm mb-4"
            style={{ boxShadow: "0 0 15px rgba(234,179,8,0.2)" }}>
            <Icon name="Crown" size={16} />
            Команда
          </div>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white mb-4">
            Руководство <span style={{ background: "linear-gradient(135deg,#eab308,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>сайта</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">Наша команда — профессионалы, которым вы можете доверять. Оцените их работу!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MANAGERS.map(m => (
            <div key={m.id}
              className="bg-[#0d0d1a] rounded-2xl p-6 border border-white/5 hover:border-yellow-500/20 transition-all duration-300"
              style={{ boxShadow: "0 0 15px rgba(234,179,8,0.05)" }}>
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${ROLE_COLORS[m.role] || "from-gray-500 to-gray-700"} flex items-center justify-center text-2xl`}
                  style={{ boxShadow: "0 0 20px rgba(234,179,8,0.2)" }}>
                  {m.avatar}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">{m.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${ROLE_COLORS[m.role] || "from-gray-700 to-gray-600"} text-white font-semibold`}>
                    {m.role}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-black/30 rounded-xl p-2 text-center">
                  <div className="text-yellow-400 font-bold text-lg">{m.stars}</div>
                  <div className="text-gray-500 text-xs">Рейтинг</div>
                </div>
                <div className="bg-black/30 rounded-xl p-2 text-center">
                  <div className="text-purple-400 font-bold text-lg">{m.points.toLocaleString()}</div>
                  <div className="text-gray-500 text-xs">Баллы ⭐</div>
                </div>
                <div className="bg-black/30 rounded-xl p-2 text-center">
                  <div className="text-cyan-400 font-bold text-lg">{m.reviews}</div>
                  <div className="text-gray-500 text-xs">Отзывов</div>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="Star" size={16}
                    className={i < m.stars ? "text-yellow-400" : "text-gray-700"}
                    style={i < m.stars ? { filter: "drop-shadow(0 0 4px rgba(234,179,8,0.7))" } : {}}
                  />
                ))}
                <span className="text-gray-400 text-xs ml-1">({m.reviews} отзывов)</span>
              </div>

              <p className="text-gray-400 text-sm mb-4">{m.specialty}</p>

              {/* Links & actions */}
              <div className="flex gap-2">
                {m.vk && (
                  <a href={m.vk} target="_blank" rel="noopener noreferrer"
                    className="flex-1 py-2 rounded-xl text-center text-xs border border-blue-500/30 text-blue-300 hover:bg-blue-500/10 transition-colors">
                    VK
                  </a>
                )}
                {m.tg && (
                  <a href={m.tg} target="_blank" rel="noopener noreferrer"
                    className="flex-1 py-2 rounded-xl text-center text-xs border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 transition-colors">
                    Telegram
                  </a>
                )}
                <button onClick={() => setReviewModal(m)}
                  className="flex-1 py-2 rounded-xl text-center text-xs neon-button">
                  Оценить
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Star points info */}
        <div className="mt-12 p-6 bg-[#0d0d1a] carnival-border rounded-2xl">
          <div className="text-center">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="text-white font-bold text-xl mb-2 font-orbitron">Звёздные баллы</h3>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm">
              Каждый участник команды зарабатывает звёздные баллы за хорошую работу, положительные отзывы и качественное обслуживание клиентов. Баллы определяют рейтинг и привилегии в команде.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {[
                { label: "За каждый положительный отзыв", points: "+50 ⭐" },
                { label: "За выполненный заказ", points: "+100 ⭐" },
                { label: "За отличную оценку (5★)", points: "+200 ⭐" },
              ].map((item, i) => (
                <div key={i} className="bg-black/40 px-4 py-3 rounded-xl border border-yellow-500/20 text-sm">
                  <span className="text-gray-400">{item.label}: </span>
                  <span className="text-yellow-400 font-bold">{item.points}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#0d0d1a] border border-yellow-500/30 rounded-2xl p-6 w-full max-w-md"
            style={{ boxShadow: "0 0 40px rgba(234,179,8,0.2)" }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{reviewModal.avatar}</span>
                <div>
                  <h3 className="text-white font-bold">{reviewModal.name}</h3>
                  <p className="text-gray-400 text-xs">{reviewModal.role}</p>
                </div>
              </div>
              <button onClick={() => setReviewModal(null)} className="text-gray-400 hover:text-white">
                <Icon name="X" size={20} />
              </button>
            </div>
            {sent ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">⭐</div>
                <p className="text-yellow-400 font-semibold">Спасибо за оценку!</p>
              </div>
            ) : (
              <form onSubmit={handleReview} className="space-y-4">
                <div>
                  <p className="text-gray-300 text-sm mb-2">Ваша оценка:</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} type="button" onClick={() => setRating(s)}
                        className="transition-transform hover:scale-110">
                        <Icon name="Star" size={28}
                          className={s <= rating ? "text-yellow-400" : "text-gray-700"}
                          style={s <= rating ? { filter: "drop-shadow(0 0 6px rgba(234,179,8,0.8))" } : {}}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <input value={reviewName} onChange={e => setReviewName(e.target.value)}
                  placeholder="Ваше имя" required
                  className="w-full bg-[#1a1a2e] border border-yellow-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-yellow-500" />
                <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
                  placeholder="Ваш отзыв (необязательно)" rows={3}
                  className="w-full bg-[#1a1a2e] border border-yellow-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-yellow-500 resize-none" />
                <button type="submit"
                  className="w-full py-3 rounded-xl border border-yellow-500/50 text-yellow-300 font-bold hover:bg-yellow-500/10 transition-all"
                  style={{ boxShadow: "0 0 15px rgba(234,179,8,0.15)" }}>
                  Оставить оценку
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
