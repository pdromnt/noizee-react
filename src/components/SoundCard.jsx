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
        <span className={`absolute inset-0 flex items-center justify-center pointer-events-none text-white text-2xl transform transition duration-300 ${state.playing ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>▶</span>
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
