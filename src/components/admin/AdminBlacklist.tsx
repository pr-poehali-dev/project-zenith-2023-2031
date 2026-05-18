import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Icon from "@/components/ui/icon"
import { type AdminTab, type BlacklistEntry } from "./admin-types"

type NewEntry = { name: string; reason: string; type: "blacklist" | "ban"; duration: string }

type Props = {
  tab: AdminTab
  blacklist: BlacklistEntry[]
  newEntry: NewEntry
  setNewEntry: React.Dispatch<React.SetStateAction<NewEntry>>
  setBlacklist: React.Dispatch<React.SetStateAction<BlacklistEntry[]>>
}

export function AdminBlacklist({ tab, blacklist, newEntry, setNewEntry, setBlacklist }: Props) {
  const filtered = blacklist.filter(e => tab === "bans" ? e.type === "ban" : e.type === "blacklist")

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="bg-[#0d0d1a] rounded-2xl border border-red-500/20 p-5">
        <p className="text-white font-semibold mb-4 flex items-center gap-2">
          <Icon name={tab === "bans" ? "Ban" : "UserX"} size={16} className="text-red-400" />
          {tab === "bans" ? "Выдать бан" : "Добавить в чёрный список"}
        </p>
        <div className="space-y-3">
          <Input placeholder="Имя / никнейм пользователя" value={newEntry.name}
            onChange={e => setNewEntry(p => ({ ...p, name: e.target.value }))}
            className="bg-[#1a1a2e] border-red-500/30 text-white placeholder:text-gray-500 text-sm" />
          <Input placeholder="Причина" value={newEntry.reason}
            onChange={e => setNewEntry(p => ({ ...p, reason: e.target.value }))}
            className="bg-[#1a1a2e] border-red-500/30 text-white placeholder:text-gray-500 text-sm" />
          <div className="flex gap-3">
            <select value={newEntry.type}
              onChange={e => setNewEntry(p => ({ ...p, type: e.target.value as "blacklist" | "ban" }))}
              className="flex-1 bg-[#1a1a2e] border border-red-500/30 text-white rounded-md px-3 py-2 text-sm">
              <option value="blacklist">Чёрный список</option>
              <option value="ban">Бан</option>
            </select>
            {newEntry.type === "ban" && (
              <Input placeholder="Срок (7 дней / Навсегда)" value={newEntry.duration}
                onChange={e => setNewEntry(p => ({ ...p, duration: e.target.value }))}
                className="flex-1 bg-[#1a1a2e] border-red-500/30 text-white placeholder:text-gray-500 text-sm" />
            )}
          </div>
          <Button
            onClick={() => {
              if (!newEntry.name.trim()) return
              const entry: BlacklistEntry = {
                id: Date.now(),
                name: newEntry.name,
                reason: newEntry.reason,
                date: new Date().toLocaleDateString("ru-RU"),
                type: newEntry.type,
                duration: newEntry.duration || undefined,
              }
              setBlacklist(prev => [entry, ...prev])
              setNewEntry({ name: "", reason: "", type: "blacklist", duration: "" })
            }}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-sm">
            {tab === "bans" ? "Выдать бан" : "Добавить в список"}
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map(entry => (
          <div key={entry.id} className="bg-[#0d0d1a] rounded-xl border border-red-500/15 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <Icon name={entry.type === "ban" ? "Ban" : "UserX"} size={18} className="text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">{entry.name}</p>
              <p className="text-gray-400 text-xs">{entry.reason}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-600 text-xs">{entry.date}</span>
                {entry.duration && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">{entry.duration}</span>}
              </div>
            </div>
            <button onClick={() => setBlacklist(prev => prev.filter(e => e.id !== entry.id))}
              className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
              <Icon name="Trash2" size={16} />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <Icon name="CheckCircle" size={36} className="mx-auto mb-3 opacity-40" />
            <p>Список пуст — всё чисто!</p>
          </div>
        )}
      </div>
    </div>
  )
}
