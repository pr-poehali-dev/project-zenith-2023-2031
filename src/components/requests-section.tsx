import { useState } from "react"
import Icon from "@/components/ui/icon"

type RequestType = "general" | "alcohol" | "vape" | "tobacco"

const REQUEST_TABS = [
  { id: "general" as RequestType, label: "Общие заявки", icon: "FileText", color: "text-purple-300", border: "border-purple-500" },
  { id: "alcohol" as RequestType, label: "Алкоголь 🍺", icon: "Wine", color: "text-amber-300", border: "border-amber-500" },
  { id: "vape" as RequestType, label: "Вейпы 💨", icon: "Wind", color: "text-cyan-300", border: "border-cyan-500" },
  { id: "tobacco" as RequestType, label: "Табак 🚬", icon: "Flame", color: "text-orange-300", border: "border-orange-500" },
]

const ALCOHOL_ITEMS = ["Пиво", "Вино", "Водка", "Коньяк", "Виски", "Шампанское", "Ликёр", "Другое"]
const VAPE_ITEMS = ["Под-система", "Одноразовый вейп", "Жидкость для вейпа", "Испаритель/картридж", "Боксмод", "Другое"]
const TOBACCO_ITEMS = ["Сигареты", "Сигары", "Табак для кальяна", "Жевательный табак", "Снюс", "Нюхательный табак", "Другое"]

export function RequestsSection() {
  const [activeTab, setActiveTab] = useState<RequestType>("general")
  const [sent, setSent] = useState(false)
  const [generalForm, setGeneralForm] = useState({ name: "", text: "", contact: "" })
  const [adultForm, setAdultForm] = useState({ name: "", items: "", qty: "", contact: "", ageConfirm: false })
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const handleGeneral = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => { setSent(false); setGeneralForm({ name: "", text: "", contact: "" }) }, 3000)
  }

  const handleAdult = (e: React.FormEvent) => {
    e.preventDefault()
    if (!adultForm.ageConfirm) return
    setSent(true)
    setTimeout(() => { setSent(false); setAdultForm({ name: "", items: "", qty: "", contact: "", ageConfirm: false }); setSelectedItems([]) }, 3000)
  }

  const toggleItem = (item: string) => {
    setSelectedItems(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item])
  }

  const getItemsForTab = () => {
    if (activeTab === "alcohol") return ALCOHOL_ITEMS
    if (activeTab === "vape") return VAPE_ITEMS
    if (activeTab === "tobacco") return TOBACCO_ITEMS
    return []
  }

  const activeConfig = REQUEST_TABS.find(t => t.id === activeTab)!

  return (
    <section id="requests" className="py-20 bg-black relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-transparent pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm mb-4"
            style={{ boxShadow: "0 0 15px rgba(168,85,247,0.2)" }}>
            <Icon name="FileText" size={16} />
            Заявки
          </div>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white mb-4">
            Подать <span className="carnival-gradient">заявку</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">Оставьте заявку — мы обработаем её и свяжемся с вами.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {REQUEST_TABS.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSent(false); setSelectedItems([]) }}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                activeTab === tab.id
                  ? `${tab.border} ${tab.color} bg-white/5`
                  : "border-gray-700 text-gray-400 hover:text-gray-200"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-[#0d0d1a] rounded-2xl p-6 md:p-8"
          style={{ border: `1px solid ${activeTab === "general" ? "rgba(168,85,247,0.2)" : activeTab === "alcohol" ? "rgba(245,158,11,0.2)" : activeTab === "vape" ? "rgba(6,182,212,0.2)" : "rgba(249,115,22,0.2)"}` }}>

          {sent ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-white font-bold text-xl mb-2">Заявка отправлена!</h3>
              <p className="text-gray-400">Мы свяжемся с вами в ближайшее время.</p>
            </div>
          ) : activeTab === "general" ? (
            <form onSubmit={handleGeneral} className="space-y-5">
              <div>
                <label className="text-gray-300 text-sm font-semibold block mb-2">Ваше имя</label>
                <input value={generalForm.name} onChange={e => setGeneralForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Как вас зовут?" required
                  className="w-full bg-[#1a1a2e] border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="text-gray-300 text-sm font-semibold block mb-2">Текст заявки</label>
                <textarea value={generalForm.text} onChange={e => setGeneralForm(f => ({ ...f, text: e.target.value }))}
                  placeholder="Опишите вашу заявку подробно..." required rows={5}
                  className="w-full bg-[#1a1a2e] border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-purple-500 resize-none" />
              </div>
              <div>
                <label className="text-gray-300 text-sm font-semibold block mb-2">Контакт для связи</label>
                <input value={generalForm.contact} onChange={e => setGeneralForm(f => ({ ...f, contact: e.target.value }))}
                  placeholder="VK, Telegram, телефон или email" required
                  className="w-full bg-[#1a1a2e] border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-purple-500" />
              </div>
              <button type="submit" className="w-full neon-button-primary py-3.5 rounded-xl text-white font-bold text-base">
                Отправить заявку
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdult} className="space-y-5">
              {/* Age warning */}
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-300 text-sm font-semibold flex items-center gap-2">
                  <Icon name="AlertTriangle" size={16} />
                  Данный раздел — только для лиц старше 18 лет!
                </p>
                <p className="text-red-400/70 text-xs mt-1">Продажа алкоголя, вейпов и табака несовершеннолетним запрещена законом.</p>
              </div>

              <div>
                <label className="text-gray-300 text-sm font-semibold block mb-2">Ваше имя</label>
                <input value={adultForm.name} onChange={e => setAdultForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ваше имя" required
                  className="w-full bg-[#1a1a2e] border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-amber-500" />
              </div>

              <div>
                <label className="text-gray-300 text-sm font-semibold block mb-2">Выберите товары</label>
                <div className="flex flex-wrap gap-2">
                  {getItemsForTab().map(item => (
                    <button key={item} type="button" onClick={() => toggleItem(item)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all border ${
                        selectedItems.includes(item)
                          ? `${activeConfig.border} ${activeConfig.color} bg-white/5`
                          : "border-gray-700 text-gray-400 hover:border-gray-500"
                      }`}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-300 text-sm font-semibold block mb-2">Количество / детали</label>
                <textarea value={adultForm.items} onChange={e => setAdultForm(f => ({ ...f, items: e.target.value }))}
                  placeholder="Уточните: что именно, марку, количество..." rows={3}
                  className="w-full bg-[#1a1a2e] border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-amber-500 resize-none" />
              </div>

              <div>
                <label className="text-gray-300 text-sm font-semibold block mb-2">Контакт</label>
                <input value={adultForm.contact} onChange={e => setAdultForm(f => ({ ...f, contact: e.target.value }))}
                  placeholder="VK, Telegram, телефон" required
                  className="w-full bg-[#1a1a2e] border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-amber-500" />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={adultForm.ageConfirm} onChange={e => setAdultForm(f => ({ ...f, ageConfirm: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 accent-amber-500" />
                <span className="text-gray-300 text-sm">Подтверждаю, что мне исполнилось 18 лет и я несу полную ответственность за данный заказ</span>
              </label>

              <button type="submit" disabled={!adultForm.ageConfirm}
                className={`w-full py-3.5 rounded-xl font-bold text-base transition-all ${
                  adultForm.ageConfirm
                    ? `${activeConfig.border.replace("border-", "border ")} ${activeConfig.color} bg-white/5 hover:bg-white/10`
                    : "border border-gray-700 text-gray-600 cursor-not-allowed"
                }`}>
                Отправить заявку
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
