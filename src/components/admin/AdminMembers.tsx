import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Icon from "@/components/ui/icon"
import { ROLES, ROLE_COLORS, AVATAR_GRADIENTS, type Member } from "./admin-types"

type NewMember = { name: string; vk_link: string; tg_link: string; role: string; is_moderator: boolean; note: string }

type Props = {
  members: Member[]
  moderators: Member[]
  newMember: NewMember
  addingMember: boolean
  memberAdded: boolean
  editId: number | null
  editData: Partial<Member>
  setNewMember: React.Dispatch<React.SetStateAction<NewMember>>
  setEditId: (id: number | null) => void
  setEditData: (d: Partial<Member>) => void
  addMember: () => void
  saveMember: (id: number) => void
  deleteMember: (id: number) => void
}

export function AdminMembers({
  members, moderators, newMember, addingMember, memberAdded,
  editId, editData, setNewMember, setEditId, setEditData,
  addMember, saveMember, deleteMember,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Форма добавления */}
      <Card className="carnival-border bg-[#0d0d1a] border-0">
        <CardContent className="pt-5 space-y-3">
          <p className="text-white font-orbitron font-semibold text-sm">Добавить участника / выдать роль</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input placeholder="Имя *" value={newMember.name} onChange={e => setNewMember(p => ({ ...p, name: e.target.value }))}
              className="bg-[#1a1a2e] border-purple-500/30 text-white placeholder:text-gray-500 text-sm" />
            <select value={newMember.role} onChange={e => setNewMember(p => ({ ...p, role: e.target.value }))}
              className="bg-[#1a1a2e] border border-purple-500/30 text-white rounded-md px-3 py-2 text-sm">
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <Input placeholder="Ссылка ВКонтакте" value={newMember.vk_link} onChange={e => setNewMember(p => ({ ...p, vk_link: e.target.value }))}
              className="bg-[#1a1a2e] border-purple-500/30 text-white placeholder:text-gray-500 text-sm" />
            <Input placeholder="Telegram @username" value={newMember.tg_link} onChange={e => setNewMember(p => ({ ...p, tg_link: e.target.value }))}
              className="bg-[#1a1a2e] border-purple-500/30 text-white placeholder:text-gray-500 text-sm" />
          </div>
          <Input placeholder="Заметка (необязательно)" value={newMember.note} onChange={e => setNewMember(p => ({ ...p, note: e.target.value }))}
            className="bg-[#1a1a2e] border-purple-500/30 text-white placeholder:text-gray-500 text-sm" />
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div onClick={() => setNewMember(p => ({ ...p, is_moderator: !p.is_moderator }))}
              className={`w-10 h-5 rounded-full transition-all duration-200 flex-shrink-0 ${newMember.is_moderator ? "carnival-gradient-bg" : "bg-gray-700"} relative`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 ${newMember.is_moderator ? "left-5" : "left-0.5"}`} />
            </div>
            <span className="text-gray-300 text-sm">Назначить модератором</span>
          </label>
          {memberAdded && <p className="text-green-400 text-xs flex items-center gap-1"><Icon name="CheckCircle" size={13} /> Участник добавлен!</p>}
          <Button onClick={addMember} disabled={!newMember.name.trim() || addingMember}
            className="carnival-gradient-bg hover:opacity-90 text-white border-0 text-sm">
            {addingMember ? "Добавляем..." : "Добавить участника"}
          </Button>
        </CardContent>
      </Card>

      {/* Модераторы */}
      {moderators.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Icon name="ShieldCheck" size={12} className="text-indigo-400" /> Модераторы ({moderators.length})
          </p>
          <div className="space-y-2">
            {moderators.map((m, i) => (
              <MemberRow key={m.id} member={m} index={i} editId={editId} editData={editData}
                setEditId={setEditId} setEditData={setEditData} onSave={saveMember} onDelete={deleteMember} />
            ))}
          </div>
        </div>
      )}

      {/* Все участники */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Icon name="Users" size={12} className="text-purple-400" /> Все участники ({members.length})
        </p>
        {members.length === 0
          ? <p className="text-center text-gray-600 py-8 text-sm">Участников пока нет — добавьте первого!</p>
          : <div className="space-y-2">
            {members.map((m, i) => (
              <MemberRow key={m.id} member={m} index={i} editId={editId} editData={editData}
                setEditId={setEditId} setEditData={setEditData} onSave={saveMember} onDelete={deleteMember} />
            ))}
          </div>
        }
      </div>
    </div>
  )
}

function MemberRow({ member, index, editId, editData, setEditId, setEditData, onSave, onDelete }: {
  member: Member
  index: number
  editId: number | null
  editData: Partial<Member>
  setEditId: (id: number | null) => void
  setEditData: (d: Partial<Member>) => void
  onSave: (id: number) => void
  onDelete: (id: number) => void
}) {
  const isEditing = editId === member.id
  const roleClass = ROLE_COLORS[member.role] || ROLE_COLORS["Участник"]

  const startEdit = () => {
    setEditId(member.id)
    setEditData({ role: member.role, vk_link: member.vk_link, tg_link: member.tg_link, note: member.note, is_moderator: member.is_moderator })
  }

  return (
    <div className={`rounded-xl border ${member.is_moderator ? "border-indigo-500/25" : "border-purple-500/10"} bg-[#0d0d1a] p-4`}>
      {!isEditing ? (
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]}`}>
            {member.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-white font-semibold text-sm">{member.name}</p>
              {member.is_moderator && <Icon name="ShieldCheck" size={13} className="text-indigo-400" />}
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge className={`${roleClass} border text-xs`}>{member.role}</Badge>
              {member.vk_link && <a href={member.vk_link} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs hover:underline">VK</a>}
              {member.tg_link && (
                <a href={member.tg_link.startsWith("http") ? member.tg_link : `https://t.me/${member.tg_link.replace("@", "")}`}
                  target="_blank" rel="noopener noreferrer" className="text-sky-400 text-xs hover:underline">TG</a>
              )}
              {member.note && <span className="text-gray-500 text-xs truncate max-w-[120px]">{member.note}</span>}
            </div>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={startEdit} className="p-1.5 rounded-lg text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 transition-all">
              <Icon name="Pencil" size={14} />
            </button>
            <button onClick={() => onDelete(member.id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
              <Icon name="Trash2" size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-purple-300 text-xs font-orbitron font-semibold mb-2">Редактирование: {member.name}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select value={editData.role || member.role} onChange={e => setEditData({ ...editData, role: e.target.value })}
              className="bg-[#1a1a2e] border border-purple-500/30 text-white rounded-md px-3 py-1.5 text-sm">
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <Input placeholder="ВКонтакте" value={editData.vk_link ?? member.vk_link} onChange={e => setEditData({ ...editData, vk_link: e.target.value })}
              className="bg-[#1a1a2e] border-purple-500/30 text-white placeholder:text-gray-600 text-sm h-9" />
            <Input placeholder="Telegram" value={editData.tg_link ?? member.tg_link} onChange={e => setEditData({ ...editData, tg_link: e.target.value })}
              className="bg-[#1a1a2e] border-purple-500/30 text-white placeholder:text-gray-600 text-sm h-9" />
            <Input placeholder="Заметка" value={editData.note ?? member.note} onChange={e => setEditData({ ...editData, note: e.target.value })}
              className="bg-[#1a1a2e] border-purple-500/30 text-white placeholder:text-gray-600 text-sm h-9" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div onClick={() => setEditData({ ...editData, is_moderator: !editData.is_moderator })}
              className={`w-10 h-5 rounded-full transition-all duration-200 flex-shrink-0 ${editData.is_moderator ? "carnival-gradient-bg" : "bg-gray-700"} relative`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 ${editData.is_moderator ? "left-5" : "left-0.5"}`} />
            </div>
            <span className="text-gray-400 text-xs">Является модератором</span>
          </label>
          <div className="flex gap-2">
            <Button onClick={() => onSave(member.id)} size="sm" className="carnival-gradient-bg hover:opacity-90 text-white border-0 text-xs h-8">Сохранить</Button>
            <Button onClick={() => { setEditId(null); setEditData({}) }} size="sm" variant="outline"
              className="text-gray-400 border-gray-600 hover:bg-gray-700 text-xs h-8 bg-transparent">Отмена</Button>
          </div>
        </div>
      )}
    </div>
  )
}
