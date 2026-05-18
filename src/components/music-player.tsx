import { useState, useRef, useEffect } from "react"
import Icon from "@/components/ui/icon"

type Track = {
  id: number
  title: string
  artist: string
  src: string
  duration: string
}

const TRACKS: Track[] = [
  { id: 1, title: "Neon Pantera", artist: "Carnival Beats", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", duration: "3:45" },
  { id: 2, title: "Purple Neon", artist: "Night Carnival", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", duration: "4:12" },
  { id: 3, title: "Cyber Pantera", artist: "Digital Wild", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", duration: "3:58" },
]

export function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    const onTimeUpdate = () => setProgress(audio.currentTime / (audio.duration || 1) * 100)
    const onEnded = () => {
      const next = (currentTrack + 1) % TRACKS.length
      setCurrentTrack(next)
    }
    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("ended", onEnded)
    return () => { audio.removeEventListener("timeupdate", onTimeUpdate); audio.removeEventListener("ended", onEnded) }
  }, [currentTrack, volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.src = TRACKS[currentTrack].src
    if (isPlaying) audio.play().catch(() => {})
  }, [currentTrack])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
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

  const track = TRACKS[currentTrack]

  return (
    <>
      <audio ref={audioRef} />

      {/* Mini player always visible */}
      <div className="fixed bottom-6 left-6 z-[9996]">
        {isOpen && (
          <div className="mb-3 bg-[#0d0d1a] border border-purple-500/30 rounded-2xl p-4 w-72 chat-pop"
            style={{ boxShadow: "0 0 30px rgba(168,85,247,0.2)" }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white font-semibold text-sm">{track.title}</p>
                <p className="text-gray-400 text-xs">{track.artist}</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
                <Icon name="X" size={16} />
              </button>
            </div>

            {/* Progress */}
            <input type="range" min="0" max="100" value={progress} onChange={seek}
              className="w-full h-1 mb-3 accent-purple-500 cursor-pointer" />

            {/* Controls */}
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => changeTrack((currentTrack - 1 + TRACKS.length) % TRACKS.length)}
                className="text-gray-400 hover:text-white transition-colors">
                <Icon name="SkipBack" size={18} />
              </button>
              <button onClick={togglePlay}
                className="w-10 h-10 rounded-full neon-button-primary flex items-center justify-center">
                <Icon name={isPlaying ? "Pause" : "Play"} size={18} />
              </button>
              <button onClick={() => changeTrack((currentTrack + 1) % TRACKS.length)}
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
            <div className="space-y-1">
              {TRACKS.map((t, i) => (
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
