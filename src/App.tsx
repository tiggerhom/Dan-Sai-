import React, { useState, useEffect } from 'react';
import { ControlBindings, DEFAULT_CONTROLS } from './types';
import StartMenu from './components/StartMenu';
import OptionsModal from './components/OptionsModal';
import GameScreen from './components/GameScreen';
import { startBackgroundRhythm, stopBackgroundRhythm, playClickSound, getMuteStatus, toggleMute } from './lib/audio';

export default function App() {
  const [gameState, setGameState] = useState<'MENU' | 'PLAYING'>('MENU');
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Default to muted to comply with browser autoplay policies

  const [controls, setControls] = useState<ControlBindings>(() => {
    try {
      const saved = localStorage.getItem('dansai_controls');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load saved controls:', e);
    }
    return { ...DEFAULT_CONTROLS };
  });

  // Handle first interaction to resume audio context and start music safely if desired
  useEffect(() => {
    const startAudioContext = () => {
      // If user isn't muted, start the beautiful traditional Isan drum loop!
      if (!isMuted) {
        startBackgroundRhythm();
      }
      // Remove after first trigger
      window.removeEventListener('click', startAudioContext);
    };

    window.addEventListener('click', startAudioContext);
    return () => window.removeEventListener('click', startAudioContext);
  }, [isMuted]);

  // Sync mute state changes
  const handleToggleMute = () => {
    const muted = toggleMute();
    setIsMuted(muted);
    if (muted) {
      stopBackgroundRhythm();
    } else {
      startBackgroundRhythm();
    }
  };

  const handleSaveControls = (newControls: ControlBindings) => {
    setControls(newControls);
    try {
      localStorage.setItem('dansai_controls', JSON.stringify(newControls));
    } catch (e) {
      console.error('Failed to save controls to localStorage:', e);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black font-kanit">
      
      {gameState === 'MENU' ? (
        <StartMenu
          onStartGame={() => {
            // Stop menu rhythm if active or transition cleanly
            setGameState('PLAYING');
          }}
          onOpenOptions={() => setIsOptionsOpen(true)}
          currentLeftKey={controls.left}
          currentRightKey={controls.right}
          currentJumpKey={controls.jump}
          currentActionKey={controls.action}
        />
      ) : (
        <GameScreen
          controls={controls}
          onBackToMenu={() => {
            setGameState('MENU');
            // Resume background rhythm if unmuted when returning to menu
            if (!isMuted) {
              startBackgroundRhythm();
            }
          }}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Options Overlay */}
      <OptionsModal
        isOpen={isOptionsOpen}
        onClose={() => setIsOptionsOpen(false)}
        controls={controls}
        onSaveControls={handleSaveControls}
      />
      
    </div>
  );
}
