import { Button } from "@/components/ui/button"

const DONATE_URL = "https://pay.cloudtips.ru/p/76ad6c3d"

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

          {/* Donate block */}
          <div className="max-w-md mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-yellow-500/30 bg-gradient-to-br from-yellow-900/20 via-orange-900/20 to-yellow-900/10 p-6">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(234,179,8,0.08),transparent)]" />
              <div className="relative z-10">
                <div className="text-3xl mb-2">❤️</div>
                <h3 className="text-white font-orbitron font-bold text-xl mb-2">Поддержать автора</h3>
                <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                  Если контент нравится — можно поддержать автора донатом. Любая сумма важна и мотивирует создавать больше!
                </p>
                <a
                  href={DONATE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white transition-all duration-200 shadow-lg shadow-yellow-500/20"
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