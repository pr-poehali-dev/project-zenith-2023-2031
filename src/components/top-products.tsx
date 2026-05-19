import Icon from "@/components/ui/icon"

type Product = {
  rank: number
  name: string
  category: string
  orders: number
  rating: number
  price: string
  emoji: string
  trend: "up" | "stable" | "new"
}

const TOP_PRODUCTS: Product[] = [
  { rank: 1, name: "ChatGPT Plus аккаунт", category: "Аккаунты", orders: 284, rating: 4.9, price: "1 800 ₽", emoji: "🤖", trend: "up" },
  { rank: 2, name: "Steam аккаунт с играми", category: "Аккаунты", orders: 241, rating: 4.8, price: "3 500 ₽", emoji: "🎮", trend: "up" },
  { rank: 3, name: "Реклама CS2 команды", category: "Игры", orders: 189, rating: 4.9, price: "3 500 ₽", emoji: "🔫", trend: "stable" },
  { rank: 4, name: "Discord Nitro аккаунт", category: "Аккаунты", orders: 176, rating: 4.7, price: "2 200 ₽", emoji: "✨", trend: "up" },
  { rank: 5, name: "VPN ProtonVPN аккаунт", category: "Аккаунты", orders: 154, rating: 4.8, price: "2 800 ₽", emoji: "🔒", trend: "new" },
  { rank: 6, name: "Реклама Minecraft сервера", category: "Игры", orders: 142, rating: 4.6, price: "2 500 ₽", emoji: "⛏️", trend: "stable" },
  { rank: 7, name: "Valorant буст реклама", category: "Игры", orders: 118, rating: 4.9, price: "4 000 ₽", emoji: "🎯", trend: "up" },
  { rank: 8, name: "Яблоки Голден (кг)", category: "Маркет", orders: 97, rating: 4.7, price: "120 ₽/кг", emoji: "🍎", trend: "new" },
  { rank: 9, name: "Spotify Premium", category: "Аккаунты", orders: 89, rating: 4.8, price: "1 200 ₽", emoji: "🎵", trend: "stable" },
  { rank: 10, name: "Instagram 10k аккаунт", category: "Аккаунты", orders: 76, rating: 4.6, price: "4 500 ₽", emoji: "📷", trend: "up" },
]

const TREND_CONFIG = {
  up: { icon: "TrendingUp", color: "text-green-400", label: "Растёт" },
  stable: { icon: "Minus", color: "text-gray-400", label: "Стабильно" },
  new: { icon: "Sparkles", color: "text-yellow-400", label: "Новинка" },
}

const RANK_STYLES: Record<number, { bg: string; text: string; glow: string }> = {
  1: { bg: "bg-gradient-to-br from-yellow-500 to-orange-500", text: "text-black", glow: "rgba(234,179,8,0.6)" },
  2: { bg: "bg-gradient-to-br from-gray-300 to-gray-500", text: "text-black", glow: "rgba(156,163,175,0.5)" },
  3: { bg: "bg-gradient-to-br from-amber-600 to-orange-700", text: "text-white", glow: "rgba(180,83,9,0.5)" },
}

const CATEGORY_COLORS: Record<string, string> = {
  "Аккаунты": "text-purple-300 bg-purple-500/10",
  "Игры": "text-cyan-300 bg-cyan-500/10",
  "Маркет": "text-green-300 bg-green-500/10",
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Icon name="Star" size={12} className="text-yellow-400" style={{ filter: "drop-shadow(0 0 3px rgba(234,179,8,0.8))" }} />
      <span className="text-yellow-400 text-xs font-semibold">{rating}</span>
    </div>
  )
}

export function TopProducts() {
  const maxOrders = TOP_PRODUCTS[0].orders

  return (
    <section id="top" className="py-20 bg-[#050508] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-orange-900/5 to-transparent pointer-events-none" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-300 text-sm mb-4"
            style={{ boxShadow: "0 0 15px rgba(249,115,22,0.2)" }}>
            <Icon name="Trophy" size={16} />
            Топ продаж
          </div>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white mb-4">
            Рейтинг <span style={{ background: "linear-gradient(135deg,#f97316,#eab308)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>покупок</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">Самые популярные товары и услуги по количеству заказов и оценкам.</p>
        </div>

        {/* Top-3 podium */}
        <div className="grid grid-cols-3 gap-4 mb-8 items-end">
          {[TOP_PRODUCTS[1], TOP_PRODUCTS[0], TOP_PRODUCTS[2]].map((p, idx) => {
            const actualRank = idx === 0 ? 2 : idx === 1 ? 1 : 3
            const style = RANK_STYLES[actualRank]
            const heights = ["h-28", "h-36", "h-24"]
            return (
              <div key={p.rank} className={`bg-[#0d0d1a] rounded-2xl p-4 border border-white/5 text-center flex flex-col items-center justify-end ${heights[idx]}`}
                style={{ boxShadow: `0 0 25px ${style?.glow || "rgba(255,255,255,0.05)"}` }}>
                <div className="text-3xl mb-2">{p.emoji}</div>
                <div className={`w-8 h-8 rounded-full ${style?.bg || "bg-gray-700"} flex items-center justify-center font-bold text-sm ${style?.text || "text-white"} mb-1`}
                  style={{ boxShadow: `0 0 12px ${style?.glow || "transparent"}` }}>
                  {actualRank}
                </div>
                <p className="text-white text-xs font-semibold leading-tight text-center">{p.name}</p>
                <p className="text-gray-400 text-xs mt-1">{p.orders} заказов</p>
              </div>
            )
          })}
        </div>

        {/* Full list */}
        <div className="space-y-2">
          {TOP_PRODUCTS.map(p => {
            const trend = TREND_CONFIG[p.trend]
            const style = RANK_STYLES[p.rank]
            const barWidth = Math.round((p.orders / maxOrders) * 100)

            return (
              <div key={p.rank}
                className="bg-[#0d0d1a] rounded-2xl px-4 py-3 border border-white/5 hover:border-white/10 transition-all duration-200 group">
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm ${style ? `${style.bg} ${style.text}` : "bg-gray-800 text-gray-400"}`}
                    style={style ? { boxShadow: `0 0 10px ${style.glow}` } : {}}>
                    {p.rank}
                  </div>

                  {/* Emoji */}
                  <span className="text-2xl flex-shrink-0">{p.emoji}</span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-semibold text-sm group-hover:text-purple-300 transition-colors truncate">{p.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[p.category] || "text-gray-400 bg-gray-500/10"}`}>
                        {p.category}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${barWidth}%`, background: "linear-gradient(90deg,#a855f7,#06b6d4)" }} />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <Stars rating={p.rating} />
                      <span className="text-gray-400 text-xs">{p.orders} заказов</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold text-sm">{p.price}</span>
                      <div className={`flex items-center gap-0.5 ${trend.color}`}>
                        <Icon name={trend.icon} size={12} />
                        <span className="text-xs hidden sm:inline">{trend.label}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
