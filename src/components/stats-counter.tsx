import { useEffect, useRef, useState } from "react"
import Icon from "@/components/ui/icon"

type Stat = {
  icon: string
  label: string
  value: number
  suffix: string
  color: string
  glow: string
}

const STATS: Stat[] = [
  { icon: "Users", label: "Клиентов", value: 1247, suffix: "+", color: "text-purple-400", glow: "rgba(168,85,247,0.4)" },
  { icon: "ShoppingBag", label: "Заказов выполнено", value: 3841, suffix: "+", color: "text-cyan-400", glow: "rgba(6,182,212,0.4)" },
  { icon: "Star", label: "Средний рейтинг", value: 4.9, suffix: "★", color: "text-yellow-400", glow: "rgba(234,179,8,0.4)" },
  { icon: "TrendingUp", label: "Сделок сегодня", value: 28, suffix: "", color: "text-green-400", glow: "rgba(34,197,94,0.4)" },
  { icon: "Clock", label: "Лет на рынке", value: 3, suffix: "+", color: "text-orange-400", glow: "rgba(249,115,22,0.4)" },
  { icon: "Shield", label: "Гарантия возврата", value: 100, suffix: "%", color: "text-pink-400", glow: "rgba(236,72,153,0.4)" },
]

function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    const isFloat = target % 1 !== 0
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) { setCount(target); clearInterval(timer) }
      else setCount(isFloat ? Math.round(current * 10) / 10 : Math.floor(current))
    }, duration / steps)
    return () => clearInterval(timer)
  }, [target, duration, start])
  return count
}

function StatCard({ stat, animate }: { stat: Stat; animate: boolean }) {
  const count = useCountUp(stat.value, 1800, animate)
  const display = stat.value % 1 !== 0 ? count.toFixed(1) : count.toLocaleString()

  return (
    <div className="bg-[#0d0d1a] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all duration-300 text-center group"
      style={{ boxShadow: `0 0 20px ${stat.glow}15` }}>
      <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center"
        style={{ background: `${stat.glow.replace("0.4", "0.15")}`, boxShadow: `0 0 15px ${stat.glow}` }}>
        <Icon name={stat.icon} size={22} className={stat.color} />
      </div>
      <div className={`text-3xl font-bold font-orbitron ${stat.color} mb-1`}
        style={{ textShadow: `0 0 20px ${stat.glow}` }}>
        {display}{stat.suffix}
      </div>
      <p className="text-gray-400 text-sm">{stat.label}</p>
    </div>
  )
}

export function StatsCounter() {
  const [animate, setAnimate] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimate(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-16 bg-[#050508] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-white">
            Carnival Pantera <span className="carnival-gradient">в цифрах</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2">Нам доверяют — и мы это подтверждаем</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map(s => <StatCard key={s.label} stat={s} animate={animate} />)}
        </div>
      </div>
    </section>
  )
}
