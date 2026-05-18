import { useState } from "react"
import Icon from "@/components/ui/icon"

type Product = {
  id: number
  name: string
  category: string
  price: number
  unit: string
  description: string
  emoji: string
  inStock: boolean
}

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: "Яблоки Голден", category: "Фрукты", price: 120, unit: "кг", description: "Сладкие яблоки, свежий урожай", emoji: "🍎", inStock: true },
  { id: 2, name: "Бананы", category: "Фрукты", price: 90, unit: "кг", description: "Спелые бананы из Эквадора", emoji: "🍌", inStock: true },
  { id: 3, name: "Апельсины", category: "Фрукты", price: 110, unit: "кг", description: "Сочные апельсины, богаты витамином С", emoji: "🍊", inStock: true },
  { id: 4, name: "Виноград Кишмиш", category: "Фрукты", price: 280, unit: "кг", description: "Без косточек, очень сладкий", emoji: "🍇", inStock: false },
  { id: 5, name: "Картофель", category: "Овощи", price: 45, unit: "кг", description: "Домашний картофель, без нитратов", emoji: "🥔", inStock: true },
  { id: 6, name: "Помидоры", category: "Овощи", price: 180, unit: "кг", description: "Грунтовые томаты, спелые", emoji: "🍅", inStock: true },
  { id: 7, name: "Огурцы", category: "Овощи", price: 120, unit: "кг", description: "Свежие огурцы, хрустящие", emoji: "🥒", inStock: true },
  { id: 8, name: "Морковь", category: "Овощи", price: 60, unit: "кг", description: "Сочная морковь, домашняя", emoji: "🥕", inStock: true },
  { id: 9, name: "Клубника", category: "Ягоды", price: 350, unit: "кг", description: "Садовая клубника, сезонная", emoji: "🍓", inStock: false },
  { id: 10, name: "Зелень (пучок)", category: "Зелень", price: 40, unit: "пучок", description: "Петрушка, укроп, базилик", emoji: "🌿", inStock: true },
]

export function MarketSection() {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS)
  const [filter, setFilter] = useState("Все")
  const [showAddForm, setShowAddForm] = useState(false)
  const [orderModal, setOrderModal] = useState<Product | null>(null)
  const [orderForm, setOrderForm] = useState({ name: "", qty: "1", contact: "", address: "" })
  const [addForm, setAddForm] = useState({ name: "", category: "", price: "", unit: "кг", description: "", contact: "" })
  const [sent, setSent] = useState(false)

  const categories = ["Все", "Фрукты", "Овощи", "Ягоды", "Зелень"]
  const filtered = filter === "Все" ? products : products.filter(p => p.category === filter)

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => { setSent(false); setOrderModal(null) }, 3000)
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => { setSent(false); setShowAddForm(false) }, 3000)
  }

  return (
    <section id="market" className="py-20 bg-black relative">
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-300 text-sm mb-4"
            style={{ boxShadow: "0 0 15px rgba(34,197,94,0.2)" }}>
            <Icon name="Leaf" size={16} />
            Продукция
          </div>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white mb-4">
            Овощи и <span style={{ background: "linear-gradient(135deg,#22c55e,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>фрукты</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">Свежая продукция с доставкой. Хочешь продавать — размести объявление!</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                filter === cat
                  ? "bg-green-500/20 border border-green-500/60 text-green-300"
                  : "border border-green-500/20 text-gray-400 hover:border-green-500/40 hover:text-green-300"
              }`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {filtered.map(p => (
            <div key={p.id}
              className={`bg-[#0d0d1a] rounded-2xl p-4 border transition-all duration-300 text-center ${
                p.inStock
                  ? "border-green-500/20 hover:border-green-500/50 cursor-pointer group"
                  : "border-gray-700/30 opacity-50 cursor-not-allowed"
              }`}
              onClick={() => p.inStock && setOrderModal(p)}>
              <div className="text-5xl mb-3">{p.emoji}</div>
              <h3 className={`text-sm font-semibold mb-1 ${p.inStock ? "text-white group-hover:text-green-300 transition-colors" : "text-gray-500"}`}>
                {p.name}
              </h3>
              <p className="text-xs text-gray-500 mb-2">{p.description}</p>
              <div className="text-lg font-bold" style={{ background: p.inStock ? "linear-gradient(135deg,#22c55e,#06b6d4)" : "none", WebkitBackgroundClip: p.inStock ? "text" : undefined, WebkitTextFillColor: p.inStock ? "transparent" : undefined, color: p.inStock ? undefined : "#4b5563" }}>
                {p.price} ₽/{p.unit}
              </div>
              {!p.inStock && <p className="text-xs text-red-400 mt-1">Нет в наличии</p>}
              {p.inStock && (
                <button className="w-full mt-3 text-xs py-1.5 rounded-lg border border-green-500/30 text-green-300 hover:bg-green-500/10 transition-colors">
                  Заказать
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <button onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl border border-green-500/40 text-green-300 font-semibold hover:bg-green-500/10 hover:border-green-500/70 transition-all"
            style={{ boxShadow: "0 0 15px rgba(34,197,94,0.15)" }}>
            <Icon name="Plus" size={18} />
            Разместить объявление
          </button>
        </div>

        {/* Order Modal */}
        {orderModal && (
          <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div className="bg-[#0d0d1a] border border-green-500/30 rounded-2xl p-6 w-full max-w-md"
              style={{ boxShadow: "0 0 40px rgba(34,197,94,0.2)" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{orderModal.emoji}</span>
                  <div>
                    <h3 className="text-white font-bold">{orderModal.name}</h3>
                    <p className="text-green-400 text-sm">{orderModal.price} ₽/{orderModal.unit}</p>
                  </div>
                </div>
                <button onClick={() => setOrderModal(null)} className="text-gray-400 hover:text-white">
                  <Icon name="X" size={20} />
                </button>
              </div>
              {sent ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="text-green-400 font-semibold">Заказ оформлен! Свяжемся с вами.</p>
                </div>
              ) : (
                <form onSubmit={handleOrder} className="space-y-3">
                  <input value={orderForm.name} onChange={e => setOrderForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ваше имя" required
                    className="w-full bg-[#1a1a2e] border border-green-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-green-500" />
                  <input value={orderForm.qty} onChange={e => setOrderForm(f => ({ ...f, qty: e.target.value }))}
                    placeholder="Количество (кг / штук)" type="number" min="1" required
                    className="w-full bg-[#1a1a2e] border border-green-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-green-500" />
                  <input value={orderForm.contact} onChange={e => setOrderForm(f => ({ ...f, contact: e.target.value }))}
                    placeholder="Контакт (телефон, VK, Telegram)" required
                    className="w-full bg-[#1a1a2e] border border-green-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-green-500" />
                  <input value={orderForm.address} onChange={e => setOrderForm(f => ({ ...f, address: e.target.value }))}
                    placeholder="Адрес доставки (или самовывоз)"
                    className="w-full bg-[#1a1a2e] border border-green-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-green-500" />
                  <button type="submit" className="w-full py-3 rounded-xl border border-green-500/50 text-green-300 font-semibold hover:bg-green-500/15 transition-all">
                    Оформить заказ
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Add product Modal */}
        {showAddForm && (
          <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div className="bg-[#0d0d1a] border border-green-500/30 rounded-2xl p-6 w-full max-w-md"
              style={{ boxShadow: "0 0 40px rgba(34,197,94,0.2)" }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-bold text-lg font-orbitron">Разместить товар</h3>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white">
                  <Icon name="X" size={20} />
                </button>
              </div>
              {sent ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="text-green-400 font-semibold">Объявление отправлено на модерацию!</p>
                </div>
              ) : (
                <form onSubmit={handleAdd} className="space-y-4">
                  <input value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Название товара" required
                    className="w-full bg-[#1a1a2e] border border-green-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-green-500" />
                  <select value={addForm.category} onChange={e => setAddForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-green-500/30 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500">
                    <option value="">Выберите категорию</option>
                    {["Фрукты", "Овощи", "Ягоды", "Зелень"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="flex gap-3">
                    <input value={addForm.price} onChange={e => setAddForm(f => ({ ...f, price: e.target.value }))}
                      placeholder="Цена ₽" type="number" min="1" required
                      className="flex-1 bg-[#1a1a2e] border border-green-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-green-500" />
                    <select value={addForm.unit} onChange={e => setAddForm(f => ({ ...f, unit: e.target.value }))}
                      className="flex-1 bg-[#1a1a2e] border border-green-500/30 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500">
                      <option value="кг">за кг</option>
                      <option value="шт">за шт</option>
                      <option value="пучок">пучок</option>
                      <option value="упак">упаковка</option>
                    </select>
                  </div>
                  <textarea value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Описание товара" rows={2}
                    className="w-full bg-[#1a1a2e] border border-green-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-green-500 resize-none" />
                  <input value={addForm.contact} onChange={e => setAddForm(f => ({ ...f, contact: e.target.value }))}
                    placeholder="Ваш контакт" required
                    className="w-full bg-[#1a1a2e] border border-green-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-green-500" />
                  <button type="submit" className="w-full py-3 rounded-xl border border-green-500/50 text-green-300 font-semibold hover:bg-green-500/15 transition-all">
                    Разместить
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
