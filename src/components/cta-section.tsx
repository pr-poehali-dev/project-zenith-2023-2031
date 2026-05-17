import { Button } from "@/components/ui/button"

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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
        </div>
      </div>
    </section>
  )
}
