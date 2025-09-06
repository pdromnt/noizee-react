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
    <div className="flex flex-col">
      <header className="mx-auto">
        <img alt="Noizee" src={logo}/>
      </header>

      <div title="Stop all sounds" className="absolute right-1 mt-2 text-xl cursor-pointer"
           onClick={pauseAll}>🔇
      </div>

      <div className="mx-auto grid grid-cols-3 gap-10">
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
          <a className="text-green-600" target="_blank" href="https://github.com/pedromorais486">pedroMNT_</a>
        </small>
      </footer>
    </div>
  )
}

export default App
