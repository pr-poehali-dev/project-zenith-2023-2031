import Icon from "@/components/ui/icon"

export function Footer() {
  return (
    <footer className="bg-black border-t border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg carnival-gradient-bg flex items-center justify-center">
                <span className="text-white font-bold">CP</span>
              </div>
              <h2 className="font-orbitron text-2xl font-bold text-white">
                Carnival <span className="carnival-gradient">Pantera</span>
              </h2>
            </div>
            <p className="font-space-mono text-gray-300 mb-2 max-w-md text-sm">
              Маркетплейс эксклюзивного видео-контента.
            </p>
            <p className="font-space-mono text-gray-400 mb-6 max-w-md text-sm">
              🐉 Форум <span className="text-blue-400">Carnival Dragon</span> — сообщество и поддержка
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                <Icon name="Twitter" size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <Icon name="MessageCircle" size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200">
                <Icon name="Instagram" size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                <Icon name="Mail" size={20} />
              </a>
            </div>
          </div>

          {/* Платформа */}
          <div>
            <h3 className="font-orbitron text-white font-semibold mb-4 text-purple-300">Платформа</h3>
            <ul className="space-y-2">
              <li>
                <a href="#catalog" className="font-space-mono text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm">
                  Каталог видео
                </a>
              </li>
              <li>
                <a href="#about" className="font-space-mono text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm">
                  Как это работает
                </a>
              </li>
              <li>
                <a href="#faq" className="font-space-mono text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm">
                  Вопросы и ответы
                </a>
              </li>
            </ul>
          </div>

          {/* Сообщество */}
          <div>
            <h3 className="font-orbitron text-white font-semibold mb-4 text-blue-300">Carnival Dragon</h3>
            <ul className="space-y-2">
              <li>
                <a href="#forum" className="font-space-mono text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm">
                  Форум
                </a>
              </li>
              <li>
                <a href="#" className="font-space-mono text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm">
                  Анонсы
                </a>
              </li>
              <li>
                <a href="#" className="font-space-mono text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm">
                  Техподдержка
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-purple-500/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="font-space-mono text-gray-400 text-sm">© 2025 Carnival Pantera. Все права защищены.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="font-space-mono text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200">
                Конфиденциальность
              </a>
              <a href="#" className="font-space-mono text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200">
                Условия использования
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
