export const API = "https://functions.poehali.dev/6d575e2a-93a2-41c0-b2ff-4a247ee4f5b4"
export const ADMIN_PASSWORD = "carnival2025"

export const ROLES = [
  "Владелец",
  "Заместитель Владельца",
  "Директор",
  "Руководитель",
  "Заместитель Руководителя",
  "Администрация",
  "Техническая поддержка",
  "Бухгалтер",
  "Модератор",
  "Участник",
]

export const ROLE_COLORS: Record<string, string> = {
  "Владелец": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "Заместитель Владельца": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Директор": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Руководитель": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Заместитель Руководителя": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "Администрация": "bg-green-500/20 text-green-300 border-green-500/30",
  "Техническая поддержка": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Бухгалтер": "bg-pink-500/20 text-pink-300 border-pink-500/30",
  "Модератор": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  "Участник": "bg-gray-500/20 text-gray-300 border-gray-500/30",
}

export const AVATAR_GRADIENTS = [
  "bg-gradient-to-br from-purple-500 to-blue-600",
  "bg-gradient-to-br from-blue-500 to-cyan-600",
  "bg-gradient-to-br from-orange-500 to-red-600",
  "bg-gradient-to-br from-cyan-500 to-purple-600",
  "bg-gradient-to-br from-pink-500 to-orange-500",
]

export type AdminTab = "questions" | "requests" | "members" | "blacklist" | "bans"

export type ForumPost = {
  id: number
  author: string
  avatar: string
  text: string
  date: string
  answer?: string | null
  answered: boolean
}

export type Member = {
  id: number
  name: string
  vk_link: string
  tg_link: string
  role: string
  is_moderator: boolean
  note: string
  date: string
}

export type BlacklistEntry = {
  id: number
  name: string
  reason: string
  date: string
  type: "blacklist" | "ban"
  duration?: string
}

export const parseBody = <T,>(raw: unknown): T => {
  if (typeof raw === "string") return JSON.parse(raw) as T
  return raw as T
}
