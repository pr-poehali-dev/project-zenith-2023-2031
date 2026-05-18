import { useState } from "react"
import Icon from "@/components/ui/icon"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: "#accounts", label: "Аккаунты", color: "hover:text-purple-400" },
    { href: "#games", label: "Игры", color: "hover:text-cyan-400" },
    { href: "#market", label: "Маркет", color: "hover:text-green-400" },
    { href: "#orders", label: "Заказы", color: "hover:text-orange-400" },
    { href: "#roulette", label: "Рулетка", color: "hover:text-pink-400" },
    { href: "#requests", label: "Заявки", color: "hover:text-blue-400" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-black/95 backdrop-blur-md border-b border-purple-500/30"
      style={{ boxShadow: "0 0 20px rgba(168,85,247,0.15)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex-shrink-0 flex items-center gap-3 group">
            <img
              src="https://cdn.poehali.dev/projects/3d74854d-9358-4a23-8c6e-df0850b2ae4f/bucket/393248e3-d91b-458e-8812-026d76f4809e.jpg"
              alt="Carnival Pantera"
              className="w-10 h-10 rounded-full object-cover"
              style={{ boxShadow: "0 0 12px rgba(168,85,247,0.6)" }}
            />
            <h1 className="font-orbitron text-xl font-bold text-white">
              Carnival <span className="carnival-gradient">Pantera</span>
            </h1>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {links.map(l => (
              <a key={l.href} href={l.href}
                className={`font-geist text-gray-300 ${l.color} transition-colors duration-200 text-sm`}>
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="#adult" className="neon-button-pink px-4 py-2 rounded-xl text-sm font-semibold">
              18+
            </a>
            <a href="/admin"
              className="neon-button px-4 py-2 rounded-xl text-sm">
              Админ
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-purple-400 transition-colors duration-200 neon-button p-2 rounded-lg"
            >
              <Icon name={isOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/98 border-t border-purple-500/20">
              {links.map(l => (
                <a key={l.href} href={l.href}
                  className={`block px-3 py-2 font-geist text-gray-300 ${l.color} transition-colors duration-200`}
                  onClick={() => setIsOpen(false)}>
                  {l.label}
                </a>
              ))}
              <div className="px-3 py-2 flex gap-2">
                <a href="#adult" onClick={() => setIsOpen(false)}
                  className="neon-button-pink px-4 py-2 rounded-xl text-sm font-semibold flex-1 text-center">
                  18+
                </a>
                <a href="/admin" onClick={() => setIsOpen(false)}
                  className="neon-button px-4 py-2 rounded-xl text-sm flex-1 text-center">
                  Админ
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
