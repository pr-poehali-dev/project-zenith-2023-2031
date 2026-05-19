import { useState, createContext, useContext, useEffect } from "react"
import Icon from "@/components/ui/icon"

const ALLOWED_ROLES = [
  { role: "Владелец", password: "owner2025" },
  { role: "Директор", password: "director2025" },
]

type AuthCtx = {
  publishRole: string | null
  requestPublishAuth: (onSuccess: () => void) => void
}

const PublishAuthContext = createContext<AuthCtx>({
  publishRole: null,
  requestPublishAuth: () => {},
})

export function usePublishAuth() {
  return useContext(PublishAuthContext)
}

export function PublishAuthProvider({ children }: { children: React.ReactNode }) {
  const [publishRole, setPublishRole] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [onSuccessCb, setOnSuccessCb] = useState<(() => void) | null>(null)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // Persist session
  useEffect(() => {
    const saved = sessionStorage.getItem("cp_publish_role")
    if (saved) setPublishRole(saved)
  }, [])

  const requestPublishAuth = (onSuccess: () => void) => {
    if (publishRole) { onSuccess(); return }
    setOnSuccessCb(() => onSuccess)
    setShowModal(true)
    setPassword("")
    setError("")
  }

  const handleLogin = () => {
    const found = ALLOWED_ROLES.find(r => r.password === password.trim())
    if (found) {
      setPublishRole(found.role)
      sessionStorage.setItem("cp_publish_role", found.role)
      setShowModal(false)
      onSuccessCb?.()
    } else {
      setError("Неверный пароль. Доступ только для Владельца и Директора.")
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleLogout = () => {
    setPublishRole(null)
    sessionStorage.removeItem("cp_publish_role")
  }

  return (
    <PublishAuthContext.Provider value={{ publishRole, requestPublishAuth }}>
      {children}

      {/* Role badge — shown when authorised */}
      {publishRole && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9990] flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/40 bg-black/90 backdrop-blur text-sm"
          style={{ boxShadow: "0 0 20px rgba(168,85,247,0.3)" }}>
          <Icon name="ShieldCheck" size={14} className="text-purple-400" />
          <span className="text-purple-300 font-semibold">{publishRole}</span>
          <span className="text-gray-500">· режим публикации</span>
          <button onClick={handleLogout} className="text-gray-600 hover:text-red-400 transition-colors ml-1">
            <Icon name="LogOut" size={13} />
          </button>
        </div>
      )}

      {/* Auth modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#0d0d1a] border border-purple-500/30 rounded-2xl p-8 w-full max-w-sm"
            style={{ boxShadow: "0 0 50px rgba(168,85,247,0.3)" }}>
            <button onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
              <Icon name="X" size={18} />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl carnival-gradient-bg flex items-center justify-center mx-auto mb-4">
                <Icon name="Lock" size={26} className="text-white" />
              </div>
              <h3 className="text-white font-bold text-xl font-orbitron">Доступ ограничен</h3>
              <p className="text-gray-400 text-sm mt-2">
                Публикация доступна только<br />
                <span className="text-purple-300 font-semibold">Владельцу</span> или <span className="text-purple-300 font-semibold">Директору</span>
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  placeholder="Пароль для публикации"
                  className={`w-full bg-[#1a1a2e] border rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none transition-colors ${
                    error ? "border-red-500" : "border-purple-500/30 focus:border-purple-500"
                  }`}
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs text-center flex items-center justify-center gap-1">
                  <Icon name="AlertCircle" size={12} /> {error}
                </p>
              )}

              <button onClick={handleLogin}
                className="w-full neon-button-primary py-3 rounded-xl text-white font-semibold">
                Войти в режим публикации
              </button>

              <p className="text-gray-600 text-xs text-center">
                Не знаете пароль? Обратитесь к Владельцу сайта.
              </p>
            </div>
          </div>
        </div>
      )}
    </PublishAuthContext.Provider>
  )
}
