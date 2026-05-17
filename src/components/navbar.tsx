import { useState } from "react"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-black/95 backdrop-blur-md border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg carnival-gradient-bg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CP</span>
            </div>
            <h1 className="font-orbitron text-xl font-bold text-white">
              Carnival <span className="carnival-gradient">Pantera</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#catalog" className="font-geist text-gray-300 hover:text-purple-400 transition-colors duration-200">
                Каталог видео
              </a>
              <a href="#forum" className="font-geist text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center gap-1">
                🐉 Carnival Dragon
              </a>
              <a href="#faq" className="font-geist text-gray-300 hover:text-orange-400 transition-colors duration-200">
                FAQ
              </a>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button className="carnival-gradient-bg hover:opacity-90 text-white font-geist border-0 font-semibold">
              Смотреть видео
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-purple-400 transition-colors duration-200"
            >
              <Icon name={isOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/98 border-t border-purple-500/20">
              <a
                href="#catalog"
                className="block px-3 py-2 font-geist text-gray-300 hover:text-purple-400 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Каталог видео
              </a>
              <a
                href="#forum"
                className="block px-3 py-2 font-geist text-gray-300 hover:text-blue-400 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                🐉 Carnival Dragon
              </a>
              <a
                href="#faq"
                className="block px-3 py-2 font-geist text-gray-300 hover:text-orange-400 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                FAQ
              </a>
              <div className="px-3 py-2">
                <Button className="w-full carnival-gradient-bg hover:opacity-90 text-white font-geist border-0">
                  Смотреть видео
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}