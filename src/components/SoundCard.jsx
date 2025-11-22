import { useAudio } from "react-use";
import React, { useEffect } from "react";

const SoundCard = ({ sound, pauseAllSounds, onPlay, onPause }) => {
  const [audio, state, controls] = useAudio({
    src: `/assets/sounds/${sound.filename}.mp3`,
    autoPlay: false,
    loop: true,
    preload: 'none',
    type: 'audio/mpeg',
  });

  useEffect(() => {
    controls.pause();
  }, [pauseAllSounds])

  // Notify parent whenever play state changes
  // Debounced/confirmed play notification to avoid flicker when play briefly fails
  const notifiedRef = React.useRef(false)
  const playTimerRef = React.useRef(null)
  useEffect(() => {
    if (state.playing) {
      // start a short timer to confirm play
      if (!notifiedRef.current && !playTimerRef.current) {
        playTimerRef.current = setTimeout(() => {
          notifiedRef.current = true
          playTimerRef.current = null
          if (typeof onPlay === 'function') onPlay()
        }, 150)
      }
    } else {
      // if there was a pending play timer, cancel it
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current)
        playTimerRef.current = null
      }
      // if we had previously notified parent that this was playing, send onPause
      if (notifiedRef.current) {
        notifiedRef.current = false
        if (typeof onPause === 'function') onPause()
      }
    }
    return () => {
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current)
        playTimerRef.current = null
      }
    }
  }, [state.playing, onPlay, onPause])

  useEffect(() => {
    controls.volume(.3);
  }, []);

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') state.playing ? controls.pause() : controls.play(); }}
      onClick={() => state.playing ? controls.pause() : controls.play()}
      className={
        `flex flex-col items-center bg-gray-700/40 rounded-lg p-3
         transform transition duration-200 ease-in-out
         hover:scale-105 hover:shadow-xl active:scale-95 cursor-pointer`}
    >
      {audio}
      <div className="relative">
        <img
          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain mx-auto"
          title={sound.screenname}
          alt={sound.screenname}
          src={`/assets/icons/${sound.icon}`}
        />
            <span className={`absolute inset-0 flex items-center justify-center pointer-events-none transform transition duration-300 ${state.playing ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <span className="bg-black/50 rounded-full ring-1 ring-white/20 px-3 py-2 flex items-center justify-center text-white text-2xl">⏸</span>
            </span>
      </div>
      <div className="w-full mt-2 flex items-center justify-center md:justify-center">
        <small className="text-white w-full text-center md:text-center truncate">{sound.screenname}</small>
      </div>
      <input
        onInput={(event) => controls.volume(event.target.value)}
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={state.volume}
        title={`Volume Control for ${sound.screenname}`}
        className="mt-3 w-full"
      />
    </div>
  )
}

export default SoundCard
