import { useState, useRef, useEffect } from "react"
import Icon from "@/components/ui/icon"

const JAMENDO_URL = "https://functions.poehali.dev/c04270b8-f8fc-4f9c-bafc-dfed5d06202f"

const EXTRA_TRACKS = [
  { id: "custom-1", title: "Мальборо", artist: "SAYAN", src: "https://cdn12.deliciousoranges.com/s1/get/music/20260410/SAYAN_-_Malboro_81251971.mp3", duration: "3:15" },
]

type Track = {
  id: number | string
  title: string
  artist: string
  src: string
  duration: string
}

export function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    setLoading(true)
    fetch(JAMENDO_URL)
      .then(r => r.json())
      .then(data => {
        const remote = data.tracks?.length ? data.tracks : []
        setTracks([...EXTRA_TRACKS, ...remote])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    const onTimeUpdate = () => setProgress(audio.currentTime / (audio.duration || 1) * 100)
    const onEnded = () => setCurrentTrack(p => (p + 1) % tracks.length)
    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("ended", onEnded)
    return () => { audio.removeEventListener("timeupdate", onTimeUpdate); audio.removeEventListener("ended", onEnded) }
  }, [currentTrack, volume, tracks.length])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !tracks[currentTrack]) return
    audio.src = tracks[currentTrack].src
    if (isPlaying) audio.play().catch(() => {})
  }, [currentTrack, tracks])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio || !tracks[currentTrack]) return
    if (isPlaying) { audio.pause(); setIsPlaying(false) }
    else { audio.play().then(() => setIsPlaying(true)).catch(() => {}) }
  }

  const changeTrack = (idx: number) => {
    setCurrentTrack(idx)
    setIsPlaying(true)
    setTimeout(() => audioRef.current?.play().catch(() => {}), 100)
  }

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const val = Number(e.target.value)
    audio.currentTime = val / 100 * (audio.duration || 0)
    setProgress(val)
  }

  const track = tracks[currentTrack]

  return (
    <>
      <audio ref={audioRef} />

      <div className="fixed bottom-6 left-6 z-[9996]">
        {isOpen && (
          <div className="mb-3 bg-[#0d0d1a] border border-purple-500/30 rounded-2xl p-4 w-72 chat-pop"
            style={{ boxShadow: "0 0 30px rgba(168,85,247,0.2)" }}>

            <div className="flex items-center justify-between mb-3">
              <div className="flex-1 min-w-0">
                {loading ? (
                  <p className="text-gray-400 text-sm flex items-center gap-2">
                    <Icon name="Loader" size={14} className="animate-spin" /> Загружаем треки...
                  </p>
                ) : track ? (
                  <>
                    <p className="text-white font-semibold text-sm truncate">{track.title}</p>
                    <p className="text-gray-400 text-xs truncate">{track.artist}</p>
                  </>
                ) : (
                  <p className="text-gray-500 text-sm">Нет треков</p>
                )}
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white ml-2 flex-shrink-0">
                <Icon name="X" size={16} />
              </button>
            </div>

            {/* Jamendo badge */}
            <div className="mb-3 flex items-center gap-1 text-gray-600 text-xs">
              <Icon name="Music2" size={10} />
              <span>Jamendo · Creative Commons</span>
            </div>

            {/* Progress */}
            <input type="range" min="0" max="100" value={progress} onChange={seek}
              className="w-full h-1 mb-3 accent-purple-500 cursor-pointer" />

            {/* Controls */}
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => changeTrack((currentTrack - 1 + Math.max(tracks.length, 1)) % Math.max(tracks.length, 1))}
                className="text-gray-400 hover:text-white transition-colors">
                <Icon name="SkipBack" size={18} />
              </button>
              <button onClick={togglePlay} disabled={loading || !tracks.length}
                className="w-10 h-10 rounded-full neon-button-primary flex items-center justify-center disabled:opacity-40">
                <Icon name={isPlaying ? "Pause" : "Play"} size={18} />
              </button>
              <button onClick={() => changeTrack((currentTrack + 1) % Math.max(tracks.length, 1))}
                className="text-gray-400 hover:text-white transition-colors">
                <Icon name="SkipForward" size={18} />
              </button>
              <div className="flex items-center gap-1">
                <Icon name="Volume2" size={14} className="text-gray-500" />
                <input type="range" min="0" max="1" step="0.1" value={volume}
                  onChange={e => { setVolume(Number(e.target.value)); if (audioRef.current) audioRef.current.volume = Number(e.target.value) }}
                  className="w-14 h-1 accent-purple-500 cursor-pointer" />
              </div>
            </div>

            {/* Playlist */}
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {loading && (
                <div className="text-center py-4 text-gray-600 text-xs">
                  <Icon name="Loader" size={16} className="animate-spin mx-auto mb-1" />
                  Загружаем плейлист...
                </div>
              )}
              {tracks.map((t, i) => (
                <button key={t.id} onClick={() => changeTrack(i)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                    i === currentTrack ? "bg-purple-500/20 text-purple-300" : "text-gray-400 hover:bg-white/5"
                  }`}>
                  <Icon name={i === currentTrack && isPlaying ? "Volume2" : "Music"} size={12} />
                  <span className="text-xs flex-1 truncate">{t.title}</span>
                  <span className="text-xs text-gray-600">{t.duration}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <button onClick={() => setIsOpen(!isOpen)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 neon-button ${isPlaying ? "neon-pulse" : ""}`}
          style={{ boxShadow: isPlaying ? "0 0 20px rgba(168,85,247,0.6)" : undefined }}>
          <Icon name={isPlaying ? "Volume2" : "Music"} size={20} />
        </button>
      </div>
    </>
  )
}