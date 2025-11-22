import React from 'react'

const PauseAllButton = ({ isPlaying, showMuted, onClick, title }) => {
  if (!isPlaying && !showMuted) return null

  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={showMuted ? 'Muted' : 'Pause all sounds'}
      className={
        `text-xl cursor-pointer bg-gray-600/30 hover:bg-gray-600/50 rounded px-3 py-2 flex items-center justify-center transition-opacity duration-200`
      }
    >
      {showMuted ? '🔇' : '⏸️'}
    </button>
  )
}

export default PauseAllButton
