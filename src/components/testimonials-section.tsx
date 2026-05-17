import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Алексей К.",
    role: "Покупатель Carnival Pantera",
    avatar: "/cybersecurity-expert-man.jpg",
    content: "Нашёл контент, которого нет больше нигде. Покупка прошла быстро, доступ появился сразу. Рекомендую!",
    gradient: "from-purple-500/10 to-transparent",
    border: "border-purple-500/30",
  },
  {
    name: "Мария Д.",
    role: "Участница форума Carnival Dragon",
    avatar: "/professional-woman-scientist.png",
    content: "На форуме всегда оперативно отвечают. Задала вопрос — получила ответ в течение часа. Крутая команда!",
    gradient: "from-blue-500/10 to-transparent",
    border: "border-blue-500/30",
  },
  {
    name: "Виктор Л.",
    role: "Постоянный клиент",
    avatar: "/asian-woman-tech-developer.jpg",
    content: "Чат-бот поддержки решил мой вопрос за минуту. Не нужно ждать — всё быстро и понятно.",
    gradient: "from-orange-500/10 to-transparent",
    border: "border-orange-500/30",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-card-foreground mb-4 font-orbitron">
            Что говорят <span className="carnival-gradient">участники</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Отзывы покупателей и участников форума Carnival Dragon
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className={`carnival-border slide-up bg-gradient-to-br ${testimonial.gradient}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardContent className="p-6">
                <p className="text-card-foreground mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold carnival-gradient">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
