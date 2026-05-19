import { useState } from "react"
import Icon from "@/components/ui/icon"

type Review = {
  id: number
  name: string
  avatar: string
  rating: number
  text: string
  date: string
  product: string
  verified: boolean
}

const REVIEWS: Review[] = [
  { id: 1, name: "Артём К.", avatar: "🦊", rating: 5, text: "Купил Steam аккаунт — всё чисто, игры на месте. Продавец ответил мгновенно, доступ получил за 10 минут. Рекомендую!", date: "18.05.2026", product: "Steam аккаунт", verified: true },
  { id: 2, name: "Настя В.", avatar: "🌸", rating: 5, text: "Заказала рекламу своего Minecraft сервера. Уже через день пришли первые игроки. Отличная работа, всё как договаривались!", date: "17.05.2026", product: "Реклама Minecraft", verified: true },
  { id: 3, name: "Макс Д.", avatar: "⚡", rating: 5, text: "Сайт крутой, команда профессиональная. Выиграл скидку в рулетке — реально дали купон, не обман. Буду покупать ещё.", date: "16.05.2026", product: "Рулетка", verified: true },
  { id: 4, name: "Лена С.", avatar: "💜", rating: 4, text: "Заказала фрукты через маркет. Привезли свежие, всё соответствовало описанию. Единственное — ждала чуть дольше обещанного.", date: "15.05.2026", product: "Маркет", verified: true },
  { id: 5, name: "Дима Р.", avatar: "🎮", rating: 5, text: "Discord Nitro пришёл сразу после оплаты. Никакого мошенничества, всё официально. Теперь только здесь покупаю.", date: "14.05.2026", product: "Discord Nitro", verified: true },
  { id: 6, name: "Алина М.", avatar: "🌟", rating: 5, text: "Подала заявку через сайт — мне перезвонили в течение часа! Очень вежливые, помогли разобраться со всем. 5 из 5!", date: "13.05.2026", product: "Заявка", verified: true },
  { id: 7, name: "Кирилл Т.", avatar: "🔥", rating: 5, text: "Реклама CS2 команды дала результат — за неделю набрали 15 новых игроков. Стоимость полностью окупилась!", date: "12.05.2026", product: "Реклама CS2", verified: true },
  { id: 8, name: "Оля П.", avatar: "🦋", rating: 4, text: "Купила аккаунт Instagram — всё как описано. Поддержка быстро ответила на вопросы. Буду советовать подругам.", date: "11.05.2026", product: "Instagram аккаунт", verified: true },
]

const PRODUCT_COLORS: Record<string, string> = {
  "Steam аккаунт": "text-blue-300 bg-blue-500/10",
  "Реклама Minecraft": "text-green-300 bg-green-500/10",
  "Рулетка": "text-orange-300 bg-orange-500/10",
  "Маркет": "text-emerald-300 bg-emerald-500/10",
  "Discord Nitro": "text-indigo-300 bg-indigo-500/10",
  "Заявка": "text-purple-300 bg-purple-500/10",
  "Реклама CS2": "text-cyan-300 bg-cyan-500/10",
  "Instagram аккаунт": "text-pink-300 bg-pink-500/10",
}

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Icon key={i} name="Star" size={size}
          className={i <= rating ? "text-yellow-400" : "text-gray-700"}
          style={i <= rating ? { filter: "drop-shadow(0 0 3px rgba(234,179,8,0.8))" } : {}} />
      ))}
    </div>
  )
}

export function ReviewsSection() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", product: "", rating: 5, text: "" })
  const [sent, setSent] = useState(false)

  const avg = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => { setSent(false); setShowForm(false); setForm({ name: "", product: "", rating: 5, text: "" }) }, 3000)
  }

  return (
    <section id="reviews" className="py-20 bg-black relative">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 text-sm mb-4"
            style={{ boxShadow: "0 0 15px rgba(234,179,8,0.2)" }}>
            <Icon name="Star" size={16} />
            Отзывы покупателей
          </div>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white mb-4">
            Что говорят <span style={{ background: "linear-gradient(135deg,#eab308,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>клиенты</span>
          </h2>

          {/* Summary rating */}
          <div className="inline-flex items-center gap-4 bg-[#0d0d1a] border border-yellow-500/20 rounded-2xl px-6 py-4 mt-2"
            style={{ boxShadow: "0 0 25px rgba(234,179,8,0.1)" }}>
            <div>
              <div className="text-4xl font-bold font-orbitron text-yellow-400"
                style={{ textShadow: "0 0 20px rgba(234,179,8,0.6)" }}>{avg}</div>
              <div className="text-gray-500 text-xs">из 5.0</div>
            </div>
            <div>
              <Stars rating={5} size={20} />
              <div className="text-gray-400 text-sm mt-1">{REVIEWS.length} отзывов</div>
            </div>
            <div className="hidden sm:block border-l border-white/10 pl-4">
              <div className="text-green-400 font-bold text-lg">100%</div>
              <div className="text-gray-500 text-xs">рекомендуют</div>
            </div>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {REVIEWS.map(r => (
            <div key={r.id}
              className="bg-[#0d0d1a] rounded-2xl p-5 border border-white/5 hover:border-yellow-500/20 transition-all duration-300 flex flex-col"
              style={{ boxShadow: "0 0 15px rgba(234,179,8,0.03)" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-lg flex-shrink-0">
                  {r.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-white font-semibold text-sm truncate">{r.name}</p>
                    {r.verified && (
                      <Icon name="BadgeCheck" size={13} className="text-blue-400 flex-shrink-0"
                        style={{ filter: "drop-shadow(0 0 4px rgba(59,130,246,0.8))" }} />
                    )}
                  </div>
                  <Stars rating={r.rating} />
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-3">"{r.text}"</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full ${PRODUCT_COLORS[r.product] || "text-gray-400 bg-gray-500/10"}`}>
                  {r.product}
                </span>
                <span className="text-gray-600 text-xs">{r.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Leave review button */}
        <div className="text-center">
          <button onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl neon-button font-semibold">
            <Icon name="PenLine" size={18} />
            Оставить отзыв
          </button>
        </div>
      </div>

      {/* Review form modal */}
      {showForm && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#0d0d1a] border border-yellow-500/30 rounded-2xl p-6 w-full max-w-md"
            style={{ boxShadow: "0 0 40px rgba(234,179,8,0.2)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg font-orbitron">Ваш отзыв</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                <Icon name="X" size={20} />
              </button>
            </div>
            {sent ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">⭐</div>
                <p className="text-yellow-400 font-semibold text-lg">Спасибо за отзыв!</p>
                <p className="text-gray-400 text-sm mt-1">Он появится после проверки.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ваше имя" required
                  className="w-full bg-[#1a1a2e] border border-yellow-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-yellow-500" />
                <input value={form.product} onChange={e => setForm(f => ({ ...f, product: e.target.value }))}
                  placeholder="Что купили / заказали?" required
                  className="w-full bg-[#1a1a2e] border border-yellow-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-yellow-500" />
                <div>
                  <p className="text-gray-400 text-sm mb-2">Оценка:</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} type="button" onClick={() => setForm(f => ({ ...f, rating: s }))}
                        className="transition-transform hover:scale-110">
                        <Icon name="Star" size={28}
                          className={s <= form.rating ? "text-yellow-400" : "text-gray-700"}
                          style={s <= form.rating ? { filter: "drop-shadow(0 0 6px rgba(234,179,8,0.8))" } : {}} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                  placeholder="Расскажите о своём опыте..." required rows={4}
                  className="w-full bg-[#1a1a2e] border border-yellow-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-yellow-500 resize-none" />
                <button type="submit"
                  className="w-full py-3 rounded-xl border border-yellow-500/50 text-yellow-300 font-bold hover:bg-yellow-500/10 transition-all"
                  style={{ boxShadow: "0 0 15px rgba(234,179,8,0.15)" }}>
                  Опубликовать отзыв
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
