import { useEffect, useState } from 'react'
import SoundCard from './components/SoundCard'
import logo from './assets/logo.png'

const App = () => {
  const [soundList, setSoundList] = useState([]);
  const [pauseAllSounds, setPauseAllSounds] = useState(false);

  const getSoundList = () => {
    fetch("./assets/soundlist.json")
      .then((response) => response.json())
      .then((data) => {
        setSoundList(data);
      });
  };

  const pauseAll = () => {
    setPauseAllSounds(true);
    setTimeout(() => {
      setPauseAllSounds(false);
    }, 500)
  };

  useEffect(() => {
    getSoundList();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <header className="mx-auto py-6 w-full max-w-6xl px-4 flex items-center justify-between">
        <img alt="Noizee" src={logo} className="h-12 sm:h-16"/>
        <button
          title="Stop all sounds"
          onClick={pauseAll}
          className="text-xl cursor-pointer bg-gray-600/30 hover:bg-gray-600/50 rounded px-3 py-1"
        >
          🔇
        </button>
      </header>

      <div className="mx-auto grid grid-cols-3 gap-6 p-4 max-w-6xl w-full">
        {soundList.map((sound) => (
          <SoundCard key={sound.filename} sound={sound} pauseAllSounds={pauseAllSounds}/>
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
