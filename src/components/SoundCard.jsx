import React, { useEffect, useRef, useState } from "react";

const SoundCard = ({ sound, pauseAllSounds, onPlay, onPause }) => {
  const audioRef = useRef(null)
  const audioCtxRef = useRef(null)
  const trackRef = useRef(null)
  const gainRef = useRef(null)
  const [volume, setVolume] = useState(0.3)
  const [isPlaying, setIsPlaying] = useState(false)

  // create or resume audio context and connect nodes lazily on first play
  // (creation handled in togglePlay)

  // handle play/pause events and notify parent
  useEffect(() => {
    const el = audioRef.current
    if (!el) return

    const handlePlay = () => {
      setIsPlaying(true)
      if (typeof onPlay === 'function') onPlay()
    }
    const handlePause = () => {
      setIsPlaying(false)
      if (typeof onPause === 'function') onPause()
    }

    el.addEventListener('play', handlePlay)
    el.addEventListener('pause', handlePause)

    return () => {
      el.removeEventListener('play', handlePlay)
      el.removeEventListener('pause', handlePause)
    }
  }, [onPlay, onPause])

  // respond to external pauseAllSounds signal
  useEffect(() => {
    if (pauseAllSounds && audioRef.current) {
      audioRef.current.pause()
    }
  }, [pauseAllSounds])

  // cleanup audio context on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {})
        audioCtxRef.current = null
        trackRef.current = null
        gainRef.current = null
      }
    }
  }, [])
  // ensure the audio element's fallback volume matches state
  useEffect(() => {
    if (audioRef.current && !gainRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // toggle play state (create/resume AudioContext lazily)
  const togglePlay = async () => {
    if (!audioRef.current) return
    if (audioRef.current.paused) {
      // create audio context and nodes on first user interaction
      if (!audioCtxRef.current) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        const track = ctx.createMediaElementSource(audioRef.current)
        const gain = ctx.createGain()
        gain.gain.value = volume
        track.connect(gain).connect(ctx.destination)
        audioCtxRef.current = ctx
        trackRef.current = track
        gainRef.current = gain
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume().catch(() => {})
      }
      await audioRef.current.play().catch(() => {})
    } else {
      audioRef.current.pause()
    }
  }

  const onVolumeInput = (e) => {
    const v = Number(e.target.value)
    setVolume(v)
    if (gainRef.current) {
      gainRef.current.gain.value = v
    } else if (audioRef.current) {
      audioRef.current.volume = v
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') togglePlay(); }}
      onClick={() => togglePlay()}
      className={
        `flex flex-col items-center bg-gray-700/40 rounded-lg p-3
         transform transition duration-200 ease-in-out
         hover:scale-105 hover:shadow-xl active:scale-95 cursor-pointer`}
    >
      <audio
        id={sound.filename}
        ref={audioRef}
        src={`/assets/sounds/${sound.filename}.mp3`}
        loop
        preload="none"
        style={{ display: 'none' }}
      />
      <div className="relative">
        <img
          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain mx-auto"
          title={sound.screenname}
          alt={sound.screenname}
          src={`/assets/icons/${sound.icon}`}
        />
            <span className={`absolute inset-0 flex items-center justify-center pointer-events-none transform transition duration-300 ${isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <span className="bg-black/50 rounded-full ring-1 ring-white/20 px-3 py-2 flex items-center justify-center text-white text-2xl">⏸</span>
            </span>
      </div>
      <div className="w-full mt-2 flex items-center justify-center md:justify-center">
        <small className="text-white w-full text-center md:text-center truncate">{sound.screenname}</small>
      </div>
      <input
        onInput={onVolumeInput}
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        title={`Volume Control for ${sound.screenname}`}
        className="mt-3 w-full"
      />
    </div>
  )
}

export default SoundCard
