import React from 'react';
import { HeartRateScenario } from '../types';

interface HeartRateScenarioSelectorProps {
  currentScenario: HeartRateScenario;
  onScenarioChange: (scenario: HeartRateScenario) => void;
}

const scenarios = Object.values(HeartRateScenario);

const HeartRateScenarioSelector: React.FC<HeartRateScenarioSelectorProps> = ({ currentScenario, onScenarioChange }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
      <h3 className="text-md font-semibold text-slate-300 mb-3">Heart Rate Simulation</h3>
      <div className="grid grid-cols-3 gap-2">
        {scenarios.map((scenario) => (
          <button
            key={scenario}
            onClick={() => onScenarioChange(scenario)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500
              ${currentScenario === scenario 
                ? 'bg-cyan-600 text-white shadow-md' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
          >
            {scenario}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeartRateScenarioSelector;
