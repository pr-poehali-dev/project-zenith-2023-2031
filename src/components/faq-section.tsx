import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      question: "Как купить видео на Carnival Pantera?",
      answer:
        "Выберите интересующее видео в каталоге, нажмите «Купить», оплатите удобным способом — доступ откроется мгновенно в вашем личном кабинете.",
    },
    {
      question: "Что такое Carnival Dragon?",
      answer:
        "Carnival Dragon — это наш форум сообщества. Там команда отвечает на вопросы, рассматривает заявки и анонсирует новинки. Присоединяйтесь к обсуждениям!",
    },
    {
      question: "Как связаться с техподдержкой?",
      answer:
        "Воспользуйтесь чат-ботом в правом нижнем углу страницы — он мгновенно ответит на частые вопросы. Если нужна живая помощь, запрос автоматически передаётся автору.",
    },
    {
      question: "Можно ли вернуть деньги за видео?",
      answer:
        "Каждый случай рассматривается индивидуально. Напишите в техподдержку или на форум Carnival Dragon — разберёмся вместе.",
    },
    {
      question: "Как долго доступ к видео действует?",
      answer:
        "После покупки доступ к видео остаётся постоянным — смотрите в любое удобное время без ограничений.",
    },
    {
      question: "Где следить за новыми видео?",
      answer:
        "Все анонсы новинок публикуются первыми на форуме Carnival Dragon. Зарегистрируйтесь там, чтобы не пропустить ни одного обновления.",
    },
  ]

  return (
    <section id="faq" className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-orbitron">
            Частые <span className="carnival-gradient">вопросы</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-space-mono">
            Ответы на популярные вопросы о Carnival Pantera, Carnival Dragon и техподдержке
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-purple-500/20 mb-4">
                <AccordionTrigger className="text-left text-lg font-semibold text-white hover:text-purple-400 font-orbitron px-6 py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed px-6 pb-4 font-space-mono">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
