import { useState } from "react"
import Icon from "@/components/ui/icon"

type Game = {
  id: number
  title: string
  description: string
  price: number
  genre: string
  platform: string
  image: string
  badge?: string
}

const GAMES: Game[] = [
  { id: 1, title: "GTA V Online — Реклама сервера", description: "Продвижение вашего RP-сервера через стримы и видео", price: 5000, genre: "Action", platform: "PC/PS5", image: "🎮", badge: "Хит" },
  { id: 2, title: "Minecraft — Реклама проекта", description: "Упоминание вашего сервера/канала в контенте", price: 2500, genre: "Sandbox", platform: "PC", image: "⛏️" },
  { id: 3, title: "CS2 — Реклама команды", description: "Реклама вашей команды/клана через социальные сети", price: 3500, genre: "Шутер", platform: "PC", image: "🔫", badge: "Новинка" },
  { id: 4, title: "Roblox — Промо ивент", description: "Анонс вашего ивента в Roblox в сообществе", price: 1500, genre: "Платформер", platform: "PC/Mobile", image: "🟥" },
  { id: 5, title: "Fortnite — Реклама аккаунта", description: "Реклама продажи/аренды аккаунта", price: 500, genre: "Battle Royale", platform: "PC/Console", image: "🏆" },
  { id: 6, title: "PUBG Mobile — Клан промо", description: "Продвижение вашего клана, набор участников", price: 2000, genre: "Battle Royale", platform: "Mobile", image: "📱" },
  { id: 7, title: "Valorant — Реклама буста", description: "Реклама ваших услуг по поднятию рейтинга", price: 4000, genre: "Тактика", platform: "PC", image: "🎯", badge: "ТОП" },
  { id: 8, title: "WoW — Реклама гильдии", description: "Продвижение вашей гильдии, набор игроков", price: 3000, genre: "MMORPG", platform: "PC", image: "⚔️" },
  { id: 9, title: "Кастомный пакет", description: "Реклама любой игры или проекта — обсуждаем индивидуально", price: 20000, genre: "Любой", platform: "Любая", image: "✨", badge: "VIP" },
]

export function GamesSection() {
  const [showForm, setShowForm] = useState(false)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [form, setForm] = useState({ name: "", game: "", budget: "", contact: "", details: "" })
  const [sent, setSent] = useState(false)

  const handleOrder = (game: Game) => {
    setSelectedGame(game)
    setForm(f => ({ ...f, game: game.title, budget: String(game.price) }))
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => { setSent(false); setShowForm(false); setForm({ name: "", game: "", budget: "", contact: "", details: "" }) }, 3000)
  }

  return (
    <section id="games" className="py-20 bg-[#050508] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm mb-4"
            style={{ boxShadow: "0 0 15px rgba(6,182,212,0.2)" }}>
            <Icon name="Gamepad2" size={16} />
            Реклама видеоигр
          </div>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white mb-4">
            Реклама <span style={{ background: "linear-gradient(135deg,#06b6d4,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>игр и проектов</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">Продвижение ваших игровых проектов от 500 до 20 000 рублей.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GAMES.map(game => (
            <div key={game.id}
              className="bg-[#0d0d1a] rounded-2xl p-5 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 group"
              style={{ boxShadow: "0 0 15px rgba(6,182,212,0.05)" }}>
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{game.image}</span>
                <div className="flex flex-col items-end gap-1">
                  {game.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {game.badge}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">{game.platform}</span>
                </div>
              </div>
              <h3 className="text-white font-semibold text-base mb-1 group-hover:text-cyan-300 transition-colors">{game.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{game.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold" style={{ background: "linear-gradient(135deg,#06b6d4,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {game.price.toLocaleString()} ₽
                </span>
                <span className="text-gray-500 text-xs bg-gray-800/50 px-2 py-1 rounded-full">{game.genre}</span>
              </div>
              <button onClick={() => handleOrder(game)}
                className="w-full mt-4 neon-button-cyan py-2.5 rounded-xl text-sm transition-all">
                Заказать рекламу
              </button>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div className="bg-[#0d0d1a] border border-cyan-500/30 rounded-2xl p-6 w-full max-w-md"
              style={{ boxShadow: "0 0 40px rgba(6,182,212,0.3)" }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-bold text-lg font-orbitron">Заказать рекламу</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                  <Icon name="X" size={20} />
                </button>
              </div>
              {selectedGame && (
                <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                  <p className="text-cyan-300 text-sm font-semibold">{selectedGame.title}</p>
                  <p className="text-gray-400 text-xs mt-1">Стоимость: {selectedGame.price.toLocaleString()} ₽</p>
                </div>
              )}
              {sent ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="text-green-400 font-semibold">Заявка принята! Свяжемся с вами.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ваше имя" required
                    className="w-full bg-[#1a1a2e] border border-cyan-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-cyan-500" />
                  <input value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                    placeholder="Контакт (VK, Telegram, телефон)" required
                    className="w-full bg-[#1a1a2e] border border-cyan-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-cyan-500" />
                  <textarea value={form.details} onChange={e => setForm(f => ({ ...f, details: e.target.value }))}
                    placeholder="Что именно нужно рекламировать? Детали..." rows={3}
                    className="w-full bg-[#1a1a2e] border border-cyan-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-cyan-500 resize-none" />
                  <button type="submit" className="w-full neon-button-cyan py-3 rounded-xl text-white font-semibold">
                    Отправить заявку
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
