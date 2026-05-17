import { Button } from "@/components/ui/button"

const DONATE_URL = "https://pay.cloudtips.ru/p/76ad6c3d"
const OWNER_VK = "https://vk.com/renatplatonov"

export function CTASection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-orange-900/30" />
      <div className="absolute inset-0 bg-black/60" />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="slide-up">
          <h2 className="text-5xl font-bold text-white mb-6 font-orbitron text-balance">
            Готов стать частью <span className="carnival-gradient">Carnival?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            Смотри эксклюзивный контент на Carnival Pantera, общайся с командой на Carnival Dragon
            и получай мгновенную поддержку в любое время.
          </p>

          {/* Цена */}
          <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-gray-400 text-sm">Стоимость одного видео:</span>
            <span className="text-3xl font-extrabold font-orbitron carnival-gradient">500 ₽</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="carnival-gradient-bg hover:opacity-90 text-white pulse-button text-lg px-8 py-4 border-0 font-semibold"
            >
              Смотреть каталог
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-500/50 text-white hover:bg-purple-500/20 text-lg px-8 py-4 bg-transparent"
            >
              Carnival Dragon 🐉
            </Button>
          </div>

          {/* Прямая связь с владельцем */}
          <div className="max-w-md mx-auto mb-6">
            <a
              href={OWNER_VK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full px-6 py-3 rounded-2xl bg-[#0077FF]/15 border border-[#0077FF]/40 text-blue-300 font-semibold hover:bg-[#0077FF]/25 transition-all duration-200"
            >
              <span className="text-xl">👑</span>
              <span>Прямая связь с Владельцем — ВКонтакте</span>
            </a>
          </div>

          {/* Donate block */}
          <div className="max-w-md mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 bg-[#0d0d1a] p-6">
              {/* Градиентный фон */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-orange-900/20" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(168,85,247,0.12),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(249,115,22,0.10),transparent_60%)]" />

              <div className="relative z-10">
                <div className="text-3xl mb-2">❤️</div>
                <h3 className="text-white font-orbitron font-bold text-xl mb-2">Поддержать автора</h3>
                <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                  Если контент нравится — поддержи автора донатом. Любая сумма важна и мотивирует создавать больше!
                </p>
                <a
                  href={DONATE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 shadow-lg hover:opacity-90 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #a855f7 0%, #3b82f6 35%, #06b6d4 65%, #f97316 100%)",
                    boxShadow: "0 4px 20px rgba(168,85,247,0.35)",
                  }}
                >
                  <span>💛</span> Задонатить через CloudTips
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
