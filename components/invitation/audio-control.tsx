'use client'

import { Pause, Play } from 'lucide-react'
import { useRef, useState } from 'react'

export function AudioControl({ src, title }: { src: string; title: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  async function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      try {
        await audio.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 sm:bottom-8 sm:right-8">
      <audio ref={audioRef} src={src} loop preload="none" onEnded={() => setPlaying(false)} />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? `Opriți ${title.toLowerCase()}` : `Porniți ${title.toLowerCase()}`}
        className="flex items-center gap-3 border border-champagne bg-ivory/90 px-4 py-3 text-espresso backdrop-blur-sm transition-colors hover:border-espresso"
      >
        {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
        <span className="eyebrow">{playing ? 'Pauză' : 'Muzică'}</span>
      </button>
    </div>
  )
}
