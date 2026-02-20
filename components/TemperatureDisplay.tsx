import React from 'react';
import { type TemperatureReading, type AIAnalysisResponse } from '../types';
import { AlertIcon } from './IconComponents';

interface TemperatureDisplayProps {
  reading: TemperatureReading | null;
  analysis: AIAnalysisResponse | null;
}

const TemperatureDisplay: React.FC<TemperatureDisplayProps> = ({ reading, analysis }) => {
  const status = analysis?.temperatureStatus;
  const alert = analysis?.temperatureAlert;

  const getStatusColor = () => {
    if (!status) return 'text-slate-100';
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('heatstroke') || lowerStatus.includes('high fever')) return 'text-red-400';
    if (lowerStatus.includes('hypothermia')) return 'text-blue-400';
    if (lowerStatus.includes('fever')) return 'text-orange-400';
    if (lowerStatus.includes('normal')) return 'text-green-400';
    return 'text-slate-100';
  };

  const getPulseColor = () => {
    if (!status) return '';
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('heatstroke') || lowerStatus.includes('high fever')) return 'bg-red-600';
    if (lowerStatus.includes('hypothermia')) return 'bg-blue-600';
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
        <h2 className="text-lg font-medium text-slate-400 mb-2">Current Body Temperature</h2>
        {reading ? (
          <>
            <div className={`text-7xl font-bold tracking-tighter ${colorClass}`}>
              {reading.temperature.toFixed(1)}<span className="text-4xl text-slate-500 align-top -mr-4">°F</span>
            </div>
            <div className={`mt-2 text-xl font-semibold flex items-center justify-center gap-2 ${colorClass}`}>
              {alert && <AlertIcon className="w-6 h-6 flex-shrink-0" />}
              {status || 'Monitoring...'}
            </div>
            <div className="text-xs text-slate-500 mt-4">
              Last updated: {new Date(reading.timestamp).toLocaleTimeString()}
            </div>
          </>
        ) : (
          <div className="text-4xl font-bold text-slate-500">--.- °F</div>
        )}
      </div>
    </div>
  );
};

export default TemperatureDisplay;
