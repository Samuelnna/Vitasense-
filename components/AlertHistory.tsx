import React from 'react';
import { type AIAnalysisResponse } from '../types';
import { AlertIcon, TrashIcon } from './IconComponents';

interface AlertHistoryProps {
  history: AIAnalysisResponse[];
  onClear: () => void;
}

const getStatusColor = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('hypothermia') || lowerStatus.includes('bradycardia')) return 'text-blue-400';
    // Default red for heat, fever, tachycardia
    return 'text-red-400';
}

const AlertHistoryItem: React.FC<{ alert: AIAnalysisResponse }> = ({ alert }) => {
    return (
      <li className="flex items-start gap-4 p-3 border-b border-slate-700 last:border-b-0">
        <AlertIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${getStatusColor(alert.temperatureAlert ? alert.temperatureStatus : alert.heartRateStatus)}`} />
        <div className="flex-grow">
          <div className="flex justify-between items-center flex-wrap gap-x-2">
            <div className="font-semibold flex flex-wrap gap-x-3">
                {alert.temperatureAlert && (
                    <span className={getStatusColor(alert.temperatureStatus)}>
                        [T] {alert.temperatureStatus}
                    </span>
                )}
                {alert.heartRateAlert && (
                    <span className={getStatusColor(alert.heartRateStatus)}>
                        [HR] {alert.heartRateStatus}
                    </span>
                )}
            </div>
            <span className="text-xs text-slate-500 flex-shrink-0">
              {alert.timestamp ? new Date(alert.timestamp).toLocaleString() : 'N/A'}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            {alert.temperatureAlert ? alert.temperatureSummary : ''} {alert.heartRateAlert ? alert.heartRateSummary : ''}
          </p>
        </div>
      </li>
    );
};

const AlertHistory: React.FC<AlertHistoryProps> = ({ history, onClear }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-300">Critical Alert History</h3>
        {history.length > 0 && (
          <button 
            onClick={onClear} 
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors duration-200"
            aria-label="Clear alert history"
          >
            <TrashIcon className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>
      <div className="bg-slate-900/50 rounded-lg max-h-60 overflow-y-auto">
        {history.length > 0 ? (
          <ul>
            {history.map((alert, index) => (
              <AlertHistoryItem key={`${alert.timestamp}-${index}`} alert={alert} />
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 px-4">
            <p className="text-sm text-slate-500">No critical alerts have been recorded.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertHistory;
