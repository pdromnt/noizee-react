import { useAudio } from "react-use";
import { useEffect } from "react";

const SoundCard = ({ sound, pauseAllSounds }) => {
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

  useEffect(() => {
    controls.volume(.3);
  }, []);

  return (
    <div className="text-center">
      {audio}
      <img onClick={state.playing ? controls.pause : controls.play} className="w-16 mx-auto" title={sound.screenname} alt={sound.screenname}
           src={`/assets/icons/${sound.icon}`}/>
      <small className="text-white ml-5 text-nowrap">{sound.screenname}</small>&nbsp;
      <span className={`
            transition-opacity duration-500 ease-in-out text-white
            ${state.playing ? 'opacity-100' : 'opacity-0'}
          `}>▶</span>
      <br/>
      <input onInput={(event) => controls.volume(event.target.value)} type="range" min="0" max="1" step="0.01"
             value={state.volume}
             title={`Volume Control for ${sound.screenname}`}/>
    </div>
  )
}

export default SoundCard
