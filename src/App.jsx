import { useEffect, useState, useRef } from 'react'
import SoundCard from './components/SoundCard'
import PauseAllButton from './components/MediaControlButton'
import logo from './assets/logo.png'

const App = () => {
  const [soundList, setSoundList] = useState([]);
  const [pauseAllSounds, setPauseAllSounds] = useState(false);
  const [playingCount, setPlayingCount] = useState(0);
  // whether there is a previously-playing set of tracks we can resume
  const [canResume, setCanResume] = useState(false)
  const lastPlayingRef = useRef(new Set())

  const getSoundList = () => {
    fetch("./assets/soundlist.json")
      .then((response) => response.json())
      .then((data) => {
        setSoundList(data);
      });
  };

  const pauseAll = () => {
    // remember which elements were playing so we can resume them later
    lastPlayingRef.current.clear()
    document.querySelectorAll('audio').forEach((a) => {
      try {
        if (!a.paused) lastPlayingRef.current.add(a.id)
      } catch (e) {}
    })
    setCanResume(lastPlayingRef.current.size > 0)

    // pause audio in children
    setPauseAllSounds(true)
    // mark no one is playing
    setPlayingCount(0)

    // briefly set pause flag so children pause, then clear to allow user to play
    setTimeout(() => setPauseAllSounds(false), 300)
  }

  const resumeLast = () => {
    const ids = Array.from(lastPlayingRef.current)
    if (ids.length === 0) return
    ids.forEach((id) => {
      const a = document.getElementById(id)
      if (a) a.play?.().catch(() => {})
    })
    lastPlayingRef.current.clear()
    setCanResume(false)
  }

  const globalToggle = () => {
    if (playingCount > 0) {
      pauseAll()
    } else if (canResume) {
      resumeLast()
    }
  }

  useEffect(() => {
    getSoundList();
  }, []);

  // Media Session API integration: metadata and action handlers
  useEffect(() => {
    if (!('mediaSession' in navigator)) return

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'Background Noise',
        artist: 'Noizee',
        album: 'Ambient Sounds',
        artwork: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }
        ]
      })
    } catch (e) {
      // Some browsers may throw when constructing MediaMetadata; ignore silently
    }

    const playHandler = () => {
      // Resume only the audio elements that were playing when we last paused/stopped
      const toResume = lastPlayingRef.current
      if (!toResume || toResume.size === 0) return
      document.querySelectorAll('audio').forEach((a) => {
        if (toResume.has(a.id)) {
          a.play?.().catch(() => {})
        }
      })
      // once resumed, clear the list
      lastPlayingRef.current.clear()
      setCanResume(false)
    }

    const pauseHandler = () => {
      // remember which elements were playing so we can selectively resume later
      lastPlayingRef.current.clear()
      document.querySelectorAll('audio').forEach((a) => {
        try {
          if (!a.paused) lastPlayingRef.current.add(a.id)
        } catch (e) {}
        a.pause()
      })
      setCanResume(lastPlayingRef.current.size > 0)
    }

    const stopHandler = () => {
      // remember which elements were playing, then stop and reset them
      lastPlayingRef.current.clear()
      document.querySelectorAll('audio').forEach((a) => {
        try {
          if (!a.paused) lastPlayingRef.current.add(a.id)
        } catch (e) {}
        a.pause()
        try { a.currentTime = 0 } catch (e) {}
      })
      setCanResume(lastPlayingRef.current.size > 0)
    }

    try {
      navigator.mediaSession.setActionHandler('play', playHandler)
    } catch (e) {}
    try {
      navigator.mediaSession.setActionHandler('pause', pauseHandler)
    } catch (e) {}
    try {
      navigator.mediaSession.setActionHandler('stop', stopHandler)
    } catch (e) {}

    return () => {
      try { navigator.mediaSession.setActionHandler('play', null) } catch (e) {}
      try { navigator.mediaSession.setActionHandler('pause', null) } catch (e) {}
      try { navigator.mediaSession.setActionHandler('stop', null) } catch (e) {}
      try { navigator.mediaSession.metadata = null } catch (e) {}
    }
  }, [])

  // Keep mediaSession.playbackState in sync with `playingCount`
  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    try {
      navigator.mediaSession.playbackState = playingCount > 0 ? 'playing' : 'paused'
    } catch (e) {}
  }, [playingCount])

  return (
    <div className="flex flex-col items-center">
      <header className="mx-auto py-6 w-full max-w-6xl px-4 flex items-center justify-between">
        <img alt="Noizee" src={logo} className="h-12 sm:h-16"/>
        <PauseAllButton
          isPlaying={playingCount > 0}
          canResume={canResume}
          onClick={globalToggle}
          title={playingCount > 0 ? 'Pause all playing sounds' : (canResume ? 'Resume previous sounds' : '')}
        />
      </header>

      <div className="mx-auto grid grid-cols-3 gap-6 p-4 max-w-6xl w-full">
        {soundList.map((sound) => (
          <SoundCard
            key={sound.filename}
            sound={sound}
            pauseAllSounds={pauseAllSounds}
            onPlay={() => {
              // clear any previously-tracked resume set when user manually starts a sound
              lastPlayingRef.current.clear()
              setCanResume(false)
              // ensure pauseAll is cleared so play isn't immediately paused
              if (pauseAllSounds) setPauseAllSounds(false)
              setPlayingCount((c) => c + 1)
            }}
            onPause={() => setPlayingCount((c) => Math.max(0, c - 1))}
          />
        ))}
      </div>

      <footer className="text-center text-white">
        <br/>
        <small>
          Icons by&nbsp;
          <a className="text-green-600" target="_blank" href="https://www.flaticon.com/br/autores/eucalyp"
             title="Eucalyp">Eucalyp</a>
          <br/>
          Sounds by&nbsp;
          <a className="text-green-600" target="_blank" href="https://freesound.org/" title="Freesound">Freesound</a>
          <br/>
          Developed with ♥️ by&nbsp;
          <a className="text-green-600" target="_blank" href="https://github.com/pdromnt/noizee-react">pdromnt</a>
        </small>
      </footer>
    </div>
  )
}

export default App
