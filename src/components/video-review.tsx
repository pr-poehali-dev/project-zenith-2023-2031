import Icon from "@/components/ui/icon"

const REVIEW = {
  name: "Артём Коваленко",
  avatar: "🦁",
  role: "Постоянный клиент",
  rating: 5,
  date: "18 мая 2026",
  title: "Лучший сайт для покупок!",
  text: "Carnival Pantera — это что-то невероятное. Заказывал аккаунты, рекламу для своего проекта и даже выиграл в рулетке. Каждый раз всё быстро, честно и качественно. Команда отвечает в течение минуты, проблем никогда не было. Однозначно рекомендую всем своим друзьям — это реально работает!",
  purchases: ["Steam аккаунт", "Реклама CS2", "Рулетка — выиграл скидку 20%"],
  verified: true,
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Icon key={i} name="Star" size={18}
          className={i <= count ? "text-yellow-400" : "text-gray-700"}
          style={i <= count ? { filter: "drop-shadow(0 0 4px rgba(234,179,8,0.8))" } : {}} />
      ))}
    </div>
  )
}

export function VideoReview() {
  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm mb-4"
            style={{ boxShadow: "0 0 15px rgba(168,85,247,0.2)" }}>
            <Icon name="Quote" size={16} />
            Отзыв о сайте
          </div>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white mb-2">
            Говорят о <span className="carnival-gradient">Carnival Pantera</span>
          </h2>
          <p className="text-gray-400 text-sm">Реальный отзыв от нашего клиента</p>
        </div>

        <div className="carnival-border rounded-3xl p-8 md:p-12 bg-[#0d0d1a] relative"
          style={{ boxShadow: "0 0 60px rgba(168,85,247,0.12)" }}>

          {/* Big quote icon */}
          <div className="absolute top-6 right-8 opacity-10">
            <Icon name="Quote" size={80} className="text-purple-400" />
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar side */}
            <div className="flex-shrink-0 text-center md:text-left">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-5xl mx-auto md:mx-0 mb-4"
                style={{ boxShadow: "0 0 30px rgba(168,85,247,0.4)" }}>
                {REVIEW.avatar}
              </div>
              <p className="text-white font-bold text-lg">{REVIEW.name}</p>
              <p className="text-gray-400 text-sm mb-3">{REVIEW.role}</p>
              <Stars count={REVIEW.rating} />
              {REVIEW.verified && (
                <div className="flex items-center gap-1 mt-3 justify-center md:justify-start">
                  <Icon name="BadgeCheck" size={16} className="text-blue-400"
                    style={{ filter: "drop-shadow(0 0 4px rgba(59,130,246,0.8))" }} />
                  <span className="text-blue-400 text-xs font-semibold">Проверенный покупатель</span>
                </div>
              )}
              <p className="text-gray-600 text-xs mt-2">{REVIEW.date}</p>
            </div>

            {/* Review content */}
            <div className="flex-1">
              <h3 className="text-white font-bold text-xl md:text-2xl font-orbitron mb-4 carnival-gradient">
                "{REVIEW.title}"
              </h3>
              <p className="text-gray-300 text-base leading-relaxed mb-6 italic">
                "{REVIEW.text}"
              </p>

              {/* What was purchased */}
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Icon name="ShoppingBag" size={12} className="text-purple-400" />
                  Что покупал:
                </p>
                <div className="flex flex-wrap gap-2">
                  {REVIEW.purchases.map((p, i) => (
                    <span key={i}
                      className="text-sm px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 flex items-center gap-1.5">
                      <Icon name="CheckCircle" size={12} className="text-green-400" />
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center sm:text-left">
              Присоединяйся к <span className="text-purple-300 font-semibold">1 247+</span> довольным клиентам Carnival Pantera
            </p>
            <a href="#accounts"
              className="neon-button-primary px-6 py-2.5 rounded-xl text-white font-semibold text-sm inline-flex items-center gap-2 whitespace-nowrap">
              <Icon name="ShoppingCart" size={16} />
              Перейти к покупкам
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
