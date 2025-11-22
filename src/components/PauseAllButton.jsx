import React from 'react'

const PauseAllButton = ({ isPlaying, showMuted, onClick, title }) => {
  const TRANS_MS = 200
  const visible = Boolean(isPlaying || showMuted)
  const [displayIcon, setDisplayIcon] = React.useState(null)

  React.useEffect(() => {
    // Immediately show muted when requested, or pause when playing
    if (showMuted) {
      setDisplayIcon('muted')
      return
    }
    if (isPlaying) {
      setDisplayIcon('pause')
      return
    }

    // Neither is active: keep showing the current icon for the duration of the fade,
    // then clear it so the button appears empty/hidden.
    const t = setTimeout(() => setDisplayIcon(null), TRANS_MS)
    return () => clearTimeout(t)
  }, [showMuted, isPlaying])

  return (
    <button
      onClick={onClick}
      title={title}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      aria-label={showMuted ? 'Muted' : 'Pause all sounds'}
      className={`text-xl bg-gray-600/30 hover:bg-gray-600/50 rounded px-3 py-2 flex items-center justify-center
        transform transition duration-200 ease-in-out
        ${visible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
    >
      {displayIcon === 'muted' ? '🔇' : displayIcon === 'pause' ? '⏸️' : null}
    </button>
  )
}

export default PauseAllButton
