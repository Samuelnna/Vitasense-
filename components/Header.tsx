import React from 'react';
import { ThermometerIcon, SpeakerOnIcon, SpeakerOffIcon } from './IconComponents';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

const Header: React.FC<HeaderProps> = ({ isMuted, onToggleMute }) => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ThermometerIcon className="w-8 h-8 text-cyan-400" />
          <h1 className="text-2xl font-bold text-white tracking-tight">
            VitaSense <span className="text-cyan-400">AI</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-400 hidden sm:block">
            Continuous Health Monitoring
          </div>
          <button
            onClick={onToggleMute}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500"
            aria-label={isMuted ? "Unmute audio alerts" : "Mute audio alerts"}
          >
            {isMuted ? <SpeakerOffIcon className="w-5 h-5" /> : <SpeakerOnIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;