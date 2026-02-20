import React from 'react';
import { type HeartRateReading, type AIAnalysisResponse } from '../types';
import { AlertIcon, HeartIcon } from './IconComponents';

interface HeartRateDisplayProps {
  reading: HeartRateReading | null;
  analysis: AIAnalysisResponse | null;
}

const HeartRateDisplay: React.FC<HeartRateDisplayProps> = ({ reading, analysis }) => {
  const status = analysis?.heartRateStatus;
  const alert = analysis?.heartRateAlert;

  const getStatusColor = () => {
    if (!status) return 'text-slate-100';
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('tachycardia')) return 'text-red-400';
    if (lowerStatus.includes('bradycardia')) return 'text-blue-400';
    if (lowerStatus.includes('elevated') || lowerStatus.includes('high')) return 'text-orange-400';
    if (lowerStatus.includes('normal')) return 'text-green-400';
    return 'text-slate-100';
  };
  
  const getPulseColor = () => {
    if (!status) return '';
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('tachycardia')) return 'bg-red-600';
    if (lowerStatus.includes('bradycardia')) return 'bg-blue-600';
    return '';
  };

  const colorClass = getStatusColor();
  const pulseColorClass = getPulseColor();


  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg flex flex-col items-center justify-center text-center h-full relative">
      {alert && pulseColorClass && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <span className={`absolute inline-flex h-36 w-36 rounded-full ${pulseColorClass} animate-ping opacity-50`}></span>
            <span className={`inline-flex rounded-full h-36 w-36 ${pulseColorClass} opacity-10`}></span>
        </div>
      )}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <h2 className="text-lg font-medium text-slate-400 mb-2">Current Heart Rate</h2>
        {reading ? (
          <>
            <div className={`text-7xl font-bold tracking-tighter ${colorClass}`}>
              {reading.heartRate}<span className="text-4xl text-slate-500"> BPM</span>
            </div>
            <div className={`mt-2 text-xl font-semibold flex items-center justify-center gap-2 ${colorClass}`}>
              {alert ? <AlertIcon className="w-6 h-6 flex-shrink-0" /> : <HeartIcon className="w-6 h-6 flex-shrink-0" />}
              {status || 'Monitoring...'}
            </div>
            <div className="text-xs text-slate-500 mt-4">
              Last updated: {new Date(reading.timestamp).toLocaleTimeString()}
            </div>
          </>
        ) : (
          <div className="text-4xl font-bold text-slate-500">-- BPM</div>
        )}
      </div>
    </div>
  );
};

export default HeartRateDisplay;
