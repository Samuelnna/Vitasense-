import React from 'react';
import { AlertIcon } from './IconComponents';

interface AlertProps {
  status: string;
  summary: string;
}

const Alert: React.FC<AlertProps> = ({ status, summary }) => {
  const lowerStatus = status.toLowerCase();
  
  const getAlertColor = () => {
    if (lowerStatus.includes('hypothermia') || lowerStatus.includes('bradycardia')) {
      return 'bg-blue-500/20 border-blue-500 text-blue-300';
    }
    // Default to red for all other critical alerts (heatstroke, high fever, tachycardia)
    return 'bg-red-500/20 border-red-500 text-red-300';
  };

  return (
    <div className={`mb-6 p-4 rounded-lg border flex items-start gap-4 ${getAlertColor()}`}>
      <AlertIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="font-bold text-white">{status} Detected!</h3>
        <p className="text-sm">{summary} Healthcare professionals have been notified.</p>
      </div>
    </div>
  );
};

export default Alert;
