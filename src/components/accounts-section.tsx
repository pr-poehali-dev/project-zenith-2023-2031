import { useState } from "react"
import Icon from "@/components/ui/icon"
import { usePublishAuth } from "@/components/publish-auth"

type Account = {
  id: number
  title: string
  description: string
  price: number
  category: string
  seller: string
  badge?: string
}

const INITIAL_ACCOUNTS: Account[] = [
  { id: 1, title: "Steam аккаунт с играми", description: "200+ игр, 5000 часов налёта, уровень 80", price: 3500, category: "Steam", seller: "PanteraShop", badge: "ТОП" },
  { id: 2, title: "Аккаунт Instagram 10k", description: "10 000 живых подписчиков, ниша — авто", price: 4500, category: "Соцсети", seller: "CarnivalStore" },
  { id: 3, title: "Spotify Premium аккаунт", description: "Премиум на 6 месяцев, чистая история", price: 1200, category: "Музыка", seller: "PanteraShop", badge: "Хит" },
  { id: 4, title: "VPN аккаунт ProtonVPN", description: "Годовая подписка, 5 устройств", price: 2800, category: "VPN", seller: "CarnivalStore" },
  { id: 5, title: "ChatGPT Plus аккаунт", description: "GPT-4, 1 месяц использования", price: 1800, category: "AI", seller: "PanteraShop", badge: "Новинка" },
  { id: 6, title: "Discord Nitro аккаунт", description: "Nitro на год, буст 2 серверов", price: 2200, category: "Discord", seller: "CarnivalStore" },
]

export function AccountsSection() {
  const { requestPublishAuth } = usePublishAuth()
  const [accounts] = useState<Account[]>(INITIAL_ACCOUNTS)
  const [filter, setFilter] = useState("Все")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "Steam", contact: "" })
  const [sent, setSent] = useState(false)

  const categories = ["Все", "Steam", "Соцсети", "Музыка", "VPN", "AI", "Discord"]
  const filtered = filter === "Все" ? accounts : accounts.filter(a => a.category === filter)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => { setSent(false); setShowForm(false); setForm({ title: "", description: "", price: "", category: "Steam", contact: "" }) }, 3000)
  }

  return (
    <section id="accounts" className="py-20 bg-black relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm mb-4"
            style={{ boxShadow: "0 0 15px rgba(168,85,247,0.2)" }}>
            <Icon name="ShoppingCart" size={16} />
            Маркет аккаунтов
          </div>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white mb-4">
            Продажа <span className="carnival-gradient">аккаунтов</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">Проверенные аккаунты от 1 000 до 10 000 рублей. Гарантия качества.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                filter === cat
                  ? "neon-button-primary text-white"
                  : "neon-button"
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filtered.map(acc => (
            <div key={acc.id} className="carnival-border rounded-2xl p-5 bg-[#0d0d1a] hover:bg-[#111127] transition-all duration-300 group"
              style={{ boxShadow: "0 0 20px rgba(168,85,247,0.08)" }}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {acc.category}
                </span>
                {acc.badge && (
                  <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30"
                    style={{ boxShadow: "0 0 8px rgba(249,115,22,0.3)" }}>
                    {acc.badge}
                  </span>
                )}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-300 transition-colors">{acc.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{acc.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold carnival-gradient">{acc.price.toLocaleString()} ₽</span>
                <span className="text-gray-500 text-xs">от {acc.seller}</span>
              </div>
              <button className="w-full mt-4 neon-button py-2.5 rounded-xl text-sm transition-all"
                onClick={() => { setShowForm(true); setForm(f => ({ ...f, title: `Хочу купить: ${acc.title}` })) }}>
                Купить / Написать
              </button>
            </div>
          ))}
        </div>

        {/* Sell button */}
        <div className="text-center">
          <button onClick={() => requestPublishAuth(() => setShowForm(true))}
            className="neon-button-primary px-8 py-3 rounded-2xl text-white font-semibold inline-flex items-center gap-2">
            <Icon name="Plus" size={18} />
            Опубликовать свой аккаунт
            <Icon name="Lock" size={14} className="opacity-60" />
          </button>
        </div>

        {/* Sell form modal */}
        {showForm && (
          <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div className="bg-[#0d0d1a] carnival-border rounded-2xl p-6 w-full max-w-md"
              style={{ boxShadow: "0 0 40px rgba(168,85,247,0.3)" }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-bold text-lg font-orbitron">Опубликовать аккаунт</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                  <Icon name="X" size={20} />
                </button>
              </div>
              {sent ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="text-green-400 font-semibold">Заявка отправлена! Мы свяжемся с вами.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Название аккаунта" required
                    className="w-full bg-[#1a1a2e] border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-purple-500" />
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Описание (уровень, подписки, что входит...)" required rows={3}
                    className="w-full bg-[#1a1a2e] border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-purple-500 resize-none" />
                  <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="Цена (₽), от 1000 до 10000" type="number" min="1000" max="10000" required
                    className="w-full bg-[#1a1a2e] border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-purple-500" />
                  <input value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                    placeholder="Ваш контакт (VK, Telegram, телефон)" required
                    className="w-full bg-[#1a1a2e] border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-purple-500" />
                  <button type="submit" className="w-full neon-button-primary py-3 rounded-xl text-white font-semibold">
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