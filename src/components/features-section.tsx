import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    title: "Каталог видео",
    description: "Большая библиотека уникального видео-контента на любой вкус. Новинки появляются регулярно.",
    emoji: "🎬",
    badge: "Видео",
    color: "from-purple-500/20 to-purple-500/5",
    badgeColor: "bg-purple-500/20 text-purple-300",
  },
  {
    title: "Carnival Dragon — Форум",
    description: "Живое сообщество, где команда отвечает на вопросы, рассматривает заявки и ведёт обсуждения.",
    emoji: "🐉",
    badge: "Форум",
    color: "from-blue-500/20 to-blue-500/5",
    badgeColor: "bg-blue-500/20 text-blue-300",
  },
  {
    title: "Техподдержка 24/7",
    description: "Чат-бот мгновенно ответит на ваши вопросы, а при необходимости — передаст запрос команде.",
    emoji: "💬",
    badge: "Поддержка",
    color: "from-cyan-500/20 to-cyan-500/5",
    badgeColor: "bg-cyan-500/20 text-cyan-300",
  },
  {
    title: "Покупка и доступ",
    description: "Удобная оплата и мгновенный доступ к купленному контенту в личном кабинете.",
    emoji: "🎟️",
    badge: "Покупки",
    color: "from-orange-500/20 to-orange-500/5",
    badgeColor: "bg-orange-500/20 text-orange-300",
  },
  {
    title: "Эксклюзивный контент",
    description: "Видео, которое не найти больше нигде. Только на Carnival Pantera — только для вас.",
    emoji: "⭐",
    badge: "Эксклюзив",
    color: "from-pink-500/20 to-pink-500/5",
    badgeColor: "bg-pink-500/20 text-pink-300",
  },
  {
    title: "Обновления и новинки",
    description: "Следите за новыми поступлениями на форуме Carnival Dragon — команда анонсирует первой.",
    emoji: "🔥",
    badge: "Новинки",
    color: "from-red-500/20 to-red-500/5",
    badgeColor: "bg-red-500/20 text-red-300",
  },
]

export function FeaturesSection() {
  return (
    <section id="catalog" className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-orbitron">
            Всё что нужно — <span className="carnival-gradient">в одном месте</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Carnival Pantera — это маркетплейс видео, форум и поддержка в одной экосистеме
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`carnival-border hover:shadow-lg transition-all duration-300 slide-up bg-gradient-to-br ${feature.color}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{feature.emoji}</span>
                  <Badge className={`${feature.badgeColor} border-0`}>
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground font-orbitron">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
