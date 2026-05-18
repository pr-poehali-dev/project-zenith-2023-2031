import Icon from "@/components/ui/icon"

type Order = {
  id: string
  title: string
  client: string
  status: "in_progress" | "done" | "pending" | "review"
  category: string
  progress: number
  startDate: string
}

const ORDERS: Order[] = [
  { id: "#001", title: "Реклама Steam аккаунта", client: "Антон К.", status: "done", category: "Аккаунты", progress: 100, startDate: "14.05.2026" },
  { id: "#002", title: "Продвижение CS2 команды", client: "Максим Р.", status: "in_progress", category: "Игры", progress: 65, startDate: "17.05.2026" },
  { id: "#003", title: "Оформление заявки на видео", client: "Анна С.", status: "review", category: "18+", progress: 90, startDate: "18.05.2026" },
  { id: "#004", title: "Доставка овощей (5кг)", client: "Иван П.", status: "in_progress", category: "Маркет", progress: 40, startDate: "19.05.2026" },
  { id: "#005", title: "Реклама Minecraft сервера", client: "Сергей М.", status: "pending", category: "Игры", progress: 0, startDate: "20.05.2026" },
  { id: "#006", title: "Продажа VPN аккаунта", client: "Ольга Т.", status: "done", category: "Аккаунты", progress: 100, startDate: "13.05.2026" },
]

const STATUS_CONFIG = {
  in_progress: { label: "Выполняется", color: "text-blue-300 bg-blue-500/20 border-blue-500/30", dot: "bg-blue-400 animate-pulse", icon: "Loader" as const },
  done: { label: "Выполнено", color: "text-green-300 bg-green-500/20 border-green-500/30", dot: "bg-green-400", icon: "CheckCircle" as const },
  pending: { label: "Ожидает", color: "text-yellow-300 bg-yellow-500/20 border-yellow-500/30", dot: "bg-yellow-400", icon: "Clock" as const },
  review: { label: "На проверке", color: "text-orange-300 bg-orange-500/20 border-orange-500/30", dot: "bg-orange-400 animate-pulse", icon: "Eye" as const },
}

const CATEGORY_COLORS: Record<string, string> = {
  "Аккаунты": "text-purple-300",
  "Игры": "text-cyan-300",
  "18+": "text-pink-300",
  "Маркет": "text-green-300",
}

export function OrdersSection() {
  const stats = {
    total: ORDERS.length,
    done: ORDERS.filter(o => o.status === "done").length,
    inProgress: ORDERS.filter(o => o.status === "in_progress").length,
    pending: ORDERS.filter(o => o.status === "pending").length,
  }

  return (
    <section id="orders" className="py-20 bg-black relative">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm mb-4"
            style={{ boxShadow: "0 0 15px rgba(59,130,246,0.2)" }}>
            <Icon name="Activity" size={16} />
            Статус выполнения
          </div>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white mb-4">
            Текущие <span style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>заказы</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">Прозрачность — наш приоритет. Видите статус каждого заказа в реальном времени.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Всего заказов", value: stats.total, color: "text-white", border: "border-gray-700" },
            { label: "Выполнено", value: stats.done, color: "text-green-400", border: "border-green-500/30" },
            { label: "В работе", value: stats.inProgress, color: "text-blue-400", border: "border-blue-500/30" },
            { label: "Ожидает", value: stats.pending, color: "text-yellow-400", border: "border-yellow-500/30" },
          ].map((s, i) => (
            <div key={i} className={`bg-[#0d0d1a] border ${s.border} rounded-2xl p-4 text-center`}>
              <div className={`text-3xl font-bold font-orbitron ${s.color}`}>{s.value}</div>
              <div className="text-gray-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Orders list */}
        <div className="space-y-3">
          {ORDERS.map(order => {
            const cfg = STATUS_CONFIG[order.status]
            return (
              <div key={order.id}
                className="bg-[#0d0d1a] border border-white/5 rounded-2xl p-4 md:p-5 hover:border-blue-500/20 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-gray-500 text-xs font-mono">{order.id}</span>
                      <span className={`text-xs ${CATEGORY_COLORS[order.category] || "text-gray-400"}`}>
                        {order.category}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold truncate">{order.title}</h3>
                    <p className="text-gray-500 text-sm mt-0.5">Клиент: {order.client} · Начало: {order.startDate}</p>
                  </div>

                  <div className="flex flex-col md:items-end gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                {order.status !== "pending" && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Прогресс</span>
                      <span>{order.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${order.progress}%`,
                          background: order.status === "done"
                            ? "linear-gradient(90deg,#22c55e,#06b6d4)"
                            : order.status === "review"
                              ? "linear-gradient(90deg,#f97316,#eab308)"
                              : "linear-gradient(90deg,#3b82f6,#06b6d4)"
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
