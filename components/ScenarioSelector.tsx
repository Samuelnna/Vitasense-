
import React from 'react';
import { TemperatureScenario } from '../types';

interface ScenarioSelectorProps {
  currentScenario: TemperatureScenario;
  onScenarioChange: (scenario: TemperatureScenario) => void;
}

const scenarios = Object.values(TemperatureScenario);

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ currentScenario, onScenarioChange }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
      <h3 className="text-md font-semibold text-slate-300 mb-3">Simulation Control</h3>
      <div className="grid grid-cols-2 gap-2">
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
      <p className="text-xs text-slate-500 mt-3">Select a scenario to simulate different health conditions.</p>
    </div>
  );
};

export default ScenarioSelector;
