import { useState, useRef } from "react"
import Icon from "@/components/ui/icon"

type Prize = {
  id: number
  label: string
  color: string
  emoji: string
  value: string
  probability: number
}

const PRIZES: Prize[] = [
  { id: 1, label: "Скидка 10%", color: "#a855f7", emoji: "💜", value: "Купон на скидку 10% на любой товар", probability: 25 },
  { id: 2, label: "Steam аккаунт", color: "#3b82f6", emoji: "🎮", value: "Аккаунт Steam с играми (стоимость до 2000₽)", probability: 5 },
  { id: 3, label: "Скидка 20%", color: "#06b6d4", emoji: "💎", value: "Купон на скидку 20% на любой товар", probability: 10 },
  { id: 4, label: "Фрукты 1кг", color: "#22c55e", emoji: "🍎", value: "1 кг любых фруктов из маркета", probability: 20 },
  { id: 5, label: "Ничего 😅", color: "#4b5563", emoji: "💨", value: "В следующий раз повезёт!", probability: 30 },
  { id: 6, label: "Discord Nitro", color: "#ec4899", emoji: "✨", value: "1 месяц Discord Nitro", probability: 8 },
  { id: 7, label: "VIP статус", color: "#f97316", emoji: "👑", value: "VIP статус на сайте на 1 месяц", probability: 2 },
]

export function RouletteSection() {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<Prize | null>(null)
  const [rotation, setRotation] = useState(0)
  const [history, setHistory] = useState<Prize[]>([])
  const [showModal, setShowModal] = useState(false)
  const spinCountRef = useRef(0)

  const spinRoulette = () => {
    if (spinning) return

    // Weighted random
    const total = PRIZES.reduce((s, p) => s + p.probability, 0)
    let rand = Math.random() * total
    let chosen = PRIZES[PRIZES.length - 1]
    for (const prize of PRIZES) {
      rand -= prize.probability
      if (rand <= 0) { chosen = prize; break }
    }

    setSpinning(true)
    setResult(null)

    const chosenIndex = PRIZES.indexOf(chosen)
    const segAngle = 360 / PRIZES.length
    const targetAngle = 360 * 5 + (360 - chosenIndex * segAngle - segAngle / 2)
    const newRotation = rotation + targetAngle + Math.random() * segAngle * 0.6

    setRotation(newRotation)
    spinCountRef.current += 1

    setTimeout(() => {
      setSpinning(false)
      setResult(chosen)
      setHistory(prev => [chosen, ...prev].slice(0, 5))
      setShowModal(true)
    }, 4000)
  }

  const segAngle = 360 / PRIZES.length

  return (
    <section id="roulette" className="py-20 bg-[#050508] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-orange-900/5 to-transparent pointer-events-none" />

      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-300 text-sm mb-4"
            style={{ boxShadow: "0 0 15px rgba(249,115,22,0.2)" }}>
            <Icon name="Star" size={16} />
            Розыгрыши
          </div>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white mb-4">
            Рулетка <span style={{ background: "linear-gradient(135deg,#f97316,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>призов</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">Крутите рулетку и выигрывайте призы за покупки! Один бесплатный спин в день.</p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Wheel */}
          <div className="relative flex-shrink-0">
            {/* Arrow pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[20px] border-l-transparent border-r-transparent border-t-white drop-shadow-lg" />
            </div>

            <div
              className="relative w-72 h-72 rounded-full"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
                boxShadow: "0 0 40px rgba(168,85,247,0.4), 0 0 80px rgba(168,85,247,0.15)"
              }}>
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {PRIZES.map((prize, i) => {
                  const startAngle = i * segAngle - 90
                  const endAngle = (i + 1) * segAngle - 90
                  const startRad = (startAngle * Math.PI) / 180
                  const endRad = (endAngle * Math.PI) / 180
                  const x1 = 100 + 100 * Math.cos(startRad)
                  const y1 = 100 + 100 * Math.sin(startRad)
                  const x2 = 100 + 100 * Math.cos(endRad)
                  const y2 = 100 + 100 * Math.sin(endRad)
                  const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180
                  const textX = 100 + 65 * Math.cos(midAngle)
                  const textY = 100 + 65 * Math.sin(midAngle)

                  return (
                    <g key={prize.id}>
                      <path
                        d={`M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`}
                        fill={prize.color}
                        opacity={0.85}
                        stroke="#000"
                        strokeWidth="1"
                      />
                      <text
                        x={textX}
                        y={textY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="8"
                        fill="white"
                        fontWeight="bold"
                        transform={`rotate(${startAngle + segAngle / 2}, ${textX}, ${textY})`}>
                        {prize.emoji}
                      </text>
                    </g>
                  )
                })}
                <circle cx="100" cy="100" r="12" fill="#0d0d1a" stroke="#a855f7" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Right panel */}
          <div className="flex-1 space-y-6">
            <button
              onClick={spinRoulette}
              disabled={spinning}
              className={`w-full py-4 rounded-2xl font-bold text-xl transition-all duration-300 ${
                spinning
                  ? "border border-gray-700 text-gray-500 cursor-not-allowed"
                  : "neon-button-primary text-white"
              }`}>
              {spinning ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Loader" size={20} className="animate-spin" />
                  Крутится...
                </span>
              ) : (
                "🎰 Крутить рулетку"
              )}
            </button>

            {/* Prizes list */}
            <div className="space-y-2">
              <p className="text-gray-400 text-sm font-semibold mb-3">Возможные призы:</p>
              {PRIZES.map(prize => (
                <div key={prize.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: prize.color, boxShadow: `0 0 6px ${prize.color}` }} />
                  <span className="text-sm">{prize.emoji}</span>
                  <span className="text-gray-300 text-sm flex-1">{prize.label}</span>
                  <span className="text-gray-600 text-xs">{prize.probability}%</span>
                </div>
              ))}
            </div>

            {/* History */}
            {history.length > 0 && (
              <div>
                <p className="text-gray-400 text-sm font-semibold mb-2">Последние выигрыши:</p>
                <div className="flex flex-wrap gap-2">
                  {history.map((p, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
                      {p.emoji} {p.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Win Modal */}
      {showModal && result && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#0d0d1a] rounded-3xl p-8 w-full max-w-sm text-center border"
            style={{ borderColor: result.color, boxShadow: `0 0 60px ${result.color}40` }}>
            <div className="text-7xl mb-4 animate-bounce">{result.emoji}</div>
            <h3 className="font-orbitron text-2xl font-bold text-white mb-2">Вы выиграли!</h3>
            <p className="text-gray-300 text-lg font-semibold mb-2" style={{ color: result.color }}>{result.label}</p>
            <p className="text-gray-400 text-sm mb-6">{result.value}</p>
            <button onClick={() => setShowModal(false)}
              className="w-full py-3 rounded-2xl font-semibold text-white transition-all"
              style={{ border: `1px solid ${result.color}`, boxShadow: `0 0 15px ${result.color}40` }}>
              Забрать приз
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
