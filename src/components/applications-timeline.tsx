import { Timeline } from "@/components/ui/timeline"

export function ApplicationsTimeline() {
  const data = [
    {
      title: "Carnival Pantera",
      content: (
        <div>
          <p className="text-white text-sm md:text-base font-normal mb-6 leading-relaxed">
            Маркетплейс уникального видео-контента. Покупайте доступ к эксклюзивным видео напрямую от автора —
            без посредников и лишних шагов.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm" style={{ color: "#a855f7" }}>
              <div className="w-2 h-2 rounded-full" style={{ background: "#a855f7" }}></div>
              Эксклюзивный видео-контент от автора
            </div>
            <div className="flex items-center gap-3 text-sm" style={{ color: "#a855f7" }}>
              <div className="w-2 h-2 rounded-full" style={{ background: "#a855f7" }}></div>
              Мгновенный доступ после оплаты
            </div>
            <div className="flex items-center gap-3 text-sm" style={{ color: "#a855f7" }}>
              <div className="w-2 h-2 rounded-full" style={{ background: "#a855f7" }}></div>
              Регулярные пополнения каталога
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Carnival Dragon",
      content: (
        <div>
          <p className="text-white text-sm md:text-base font-normal mb-6 leading-relaxed">
            Живой форум сообщества. Команда Carnival Dragon отвечает на вопросы, рассматривает заявки
            и ведёт активные обсуждения вместе с участниками.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm" style={{ color: "#3b82f6" }}>
              <div className="w-2 h-2 rounded-full" style={{ background: "#3b82f6" }}></div>
              Команда модераторов онлайн
            </div>
            <div className="flex items-center gap-3 text-sm" style={{ color: "#3b82f6" }}>
              <div className="w-2 h-2 rounded-full" style={{ background: "#3b82f6" }}></div>
              Заявки и обращения обрабатываются быстро
            </div>
            <div className="flex items-center gap-3 text-sm" style={{ color: "#3b82f6" }}>
              <div className="w-2 h-2 rounded-full" style={{ background: "#3b82f6" }}></div>
              Анонсы новинок и обновлений
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Техподдержка",
      content: (
        <div>
          <p className="text-white text-sm md:text-base font-normal mb-6 leading-relaxed">
            Чат-бот технической поддержки мгновенно решает стандартные вопросы. 
            Сложные случаи — передаёт напрямую автору.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm" style={{ color: "#f97316" }}>
              <div className="w-2 h-2 rounded-full" style={{ background: "#f97316" }}></div>
              Мгновенные ответы на частые вопросы
            </div>
            <div className="flex items-center gap-3 text-sm" style={{ color: "#f97316" }}>
              <div className="w-2 h-2 rounded-full" style={{ background: "#f97316" }}></div>
              Помощь с оплатой и доступом
            </div>
            <div className="flex items-center gap-3 text-sm" style={{ color: "#f97316" }}>
              <div className="w-2 h-2 rounded-full" style={{ background: "#f97316" }}></div>
              Эскалация сложных запросов автору
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <section id="about" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
            Как это <span className="carnival-gradient">работает</span>
          </h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Три ключевых элемента платформы Carnival — видео, сообщество и поддержка
          </p>
        </div>

        <div className="relative">
          <Timeline data={data} />
        </div>
      </div>
    </section>
  )
}
