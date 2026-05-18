import { useState } from "react"
import Icon from "@/components/ui/icon"

type Content = {
  id: number
  title: string
  category: string
  price: number
  description: string
  preview: string
}

const CONTENT: Content[] = [
  { id: 1, title: "Эксклюзивный пакет #1", category: "Фото", price: 500, description: "Закрытый альбом, 50+ фото", preview: "🔞" },
  { id: 2, title: "Видео коллекция Premium", category: "Видео", price: 1500, description: "Эксклюзивное видео, Full HD", preview: "🎬" },
  { id: 3, title: "Личная переписка +контент", category: "Персонально", price: 2000, description: "Персональный контент по запросу", preview: "💌" },
  { id: 4, title: "Месячная подписка", category: "Подписка", price: 3000, description: "Весь контент за месяц неограниченно", preview: "⭐" },
]

export function AdultSection() {
  const [confirmed, setConfirmed] = useState(false)
  const [showPurchase, setShowPurchase] = useState<Content | null>(null)
  const [form, setForm] = useState({ contact: "", comment: "" })
  const [sent, setSent] = useState(false)

  const handleBuy = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => { setSent(false); setShowPurchase(null) }, 3000)
  }

  if (!confirmed) {
    return (
      <section id="adult" className="py-20 bg-[#050508] relative">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="bg-[#0d0d1a] border border-pink-500/30 rounded-3xl p-8"
            style={{ boxShadow: "0 0 50px rgba(236,72,153,0.15)" }}>
            <div className="text-6xl mb-6">🔞</div>
            <h2 className="font-orbitron text-3xl font-bold text-white mb-3">Раздел 18+</h2>
            <p className="text-gray-400 mb-2">Данный раздел содержит контент для взрослых (18+).</p>
            <p className="text-gray-500 text-sm mb-8">Нажимая «Мне есть 18 лет», вы подтверждаете, что являетесь совершеннолетним и осознаёте, что данный контент предназначен исключительно для взрослых.</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setConfirmed(true)}
                className="neon-button-pink py-4 rounded-2xl font-bold text-lg w-full">
                ✅ Мне есть 18 лет — войти
              </button>
              <a href="/"
                className="py-3 rounded-2xl border border-gray-700 text-gray-400 font-semibold text-sm hover:text-gray-200 transition-colors">
                ← Вернуться на главную
              </a>
            </div>
            <p className="text-gray-600 text-xs mt-6">Нажимая кнопку, вы соглашаетесь с тем, что вам исполнилось 18 лет и вы несёте ответственность за просмотр данного контента.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="adult" className="py-20 bg-[#050508] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-pink-900/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-300 text-sm mb-4"
            style={{ boxShadow: "0 0 15px rgba(236,72,153,0.2)" }}>
            🔞 Контент для взрослых
          </div>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white mb-4">
            Раздел <span style={{ background: "linear-gradient(135deg,#ec4899,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>18+</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">Эксклюзивный контент для взрослых. Все материалы публикуются с согласия авторов.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CONTENT.map(item => (
            <div key={item.id}
              className="bg-[#0d0d1a] rounded-2xl p-6 border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300 group text-center"
              style={{ boxShadow: "0 0 15px rgba(236,72,153,0.05)" }}>
              <div className="text-5xl mb-4">{item.preview}</div>
              <span className="text-xs px-2 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                {item.category}
              </span>
              <h3 className="text-white font-semibold mt-3 mb-2 group-hover:text-pink-300 transition-colors">{item.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{item.description}</p>
              <div className="text-2xl font-bold mb-4" style={{ background: "linear-gradient(135deg,#ec4899,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {item.price.toLocaleString()} ₽
              </div>
              <button onClick={() => setShowPurchase(item)} className="w-full neon-button-pink py-2.5 rounded-xl text-sm">
                Купить
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 border border-yellow-500/20 bg-yellow-500/5 rounded-2xl text-center">
          <p className="text-yellow-400 text-sm">⚠️ Только для совершеннолетних. Весь контент публикуется с согласия авторов и соответствует законодательству.</p>
        </div>

        {/* Purchase Modal */}
        {showPurchase && (
          <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div className="bg-[#0d0d1a] border border-pink-500/30 rounded-2xl p-6 w-full max-w-md"
              style={{ boxShadow: "0 0 40px rgba(236,72,153,0.3)" }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-bold text-lg">Оформить покупку</h3>
                <button onClick={() => setShowPurchase(null)} className="text-gray-400 hover:text-white">
                  <Icon name="X" size={20} />
                </button>
              </div>
              <div className="mb-4 p-3 bg-pink-500/10 border border-pink-500/20 rounded-xl text-center">
                <div className="text-3xl">{showPurchase.preview}</div>
                <p className="text-pink-300 font-semibold mt-1">{showPurchase.title}</p>
                <p className="text-white font-bold text-xl">{showPurchase.price.toLocaleString()} ₽</p>
              </div>
              {sent ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="text-green-400 font-semibold">Заявка принята! Пришлём доступ.</p>
                </div>
              ) : (
                <form onSubmit={handleBuy} className="space-y-4">
                  <input value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                    placeholder="Ваш контакт (VK, Telegram, телефон)" required
                    className="w-full bg-[#1a1a2e] border border-pink-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-pink-500" />
                  <textarea value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                    placeholder="Комментарий (необязательно)" rows={2}
                    className="w-full bg-[#1a1a2e] border border-pink-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-pink-500 resize-none" />
                  <button type="submit" className="w-full neon-button-pink py-3 rounded-xl font-semibold">
                    Оплатить
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
