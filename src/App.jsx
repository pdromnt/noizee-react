import { useEffect, useState, useRef } from 'react'
import SoundCard from './components/SoundCard'
import PauseAllButton from './components/PauseAllButton'
import logo from './assets/logo.png'

const App = () => {
  const [soundList, setSoundList] = useState([]);
  const [pauseAllSounds, setPauseAllSounds] = useState(false);
  const [playingCount, setPlayingCount] = useState(0);
  const [showMuted, setShowMuted] = useState(false);
  const muteTimeoutRef = useRef(null);
  const muteDuration = 3000 // ms

  const getSoundList = () => {
    fetch("./assets/soundlist.json")
      .then((response) => response.json())
      .then((data) => {
        setSoundList(data);
      });
  };

  const pauseAll = () => {
    // pause audio in children
    setPauseAllSounds(true);
    // mark no one is playing
    setPlayingCount(0);
    // show muted icon
    setShowMuted(true);

    // clear any existing mute timeout
    if (muteTimeoutRef.current) {
      clearTimeout(muteTimeoutRef.current);
      muteTimeoutRef.current = null;
    }

    muteTimeoutRef.current = setTimeout(() => {
      setShowMuted(false);
      muteTimeoutRef.current = null;
    }, muteDuration);

    // briefly set pause flag so children pause, then clear to allow user to play
    setTimeout(() => setPauseAllSounds(false), 300);
  };

  useEffect(() => {
    getSoundList();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <header className="mx-auto py-6 w-full max-w-6xl px-4 flex items-center justify-between">
        <img alt="Noizee" src={logo} className="h-12 sm:h-16"/>
        <PauseAllButton
          isPlaying={playingCount > 0}
          showMuted={showMuted}
          onClick={pauseAll}
          title={playingCount > 0 ? 'Pause all playing sounds' : (showMuted ? 'Muted (3s)' : '')}
        />
      </header>

      <div className="mx-auto grid grid-cols-3 gap-6 p-4 max-w-6xl w-full">
        {soundList.map((sound) => (
          <SoundCard
            key={sound.filename}
            sound={sound}
            pauseAllSounds={pauseAllSounds}
            onPlay={() => {
              // if muted was showing, cancel it and show pause instead
              if (muteTimeoutRef.current) {
                clearTimeout(muteTimeoutRef.current)
                muteTimeoutRef.current = null
              }
              if (showMuted) setShowMuted(false)
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
