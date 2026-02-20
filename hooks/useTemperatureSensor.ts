
import { useState, useEffect } from 'react';
import { type TemperatureReading, TemperatureScenario } from '../types';

const SCENARIO_CONFIG = {
  [TemperatureScenario.NORMAL]: { base: 98.6, fluctuation: 0.3, trend: 0 },
  [TemperatureScenario.FEVER]: { base: 100.5, fluctuation: 0.5, trend: 0.1 },
  [TemperatureScenario.HEAT_STRESS]: { base: 102.0, fluctuation: 0.6, trend: 0.25 },
  [TemperatureScenario.HYPOTHERMIA]: { base: 96.0, fluctuation: 0.4, trend: -0.15 },
};

export const useTemperatureSensor = (scenario: TemperatureScenario) => {
  const [readings, setReadings] = useState<TemperatureReading[]>([]);

  useEffect(() => {
    // Reset readings when scenario changes
    const initialTemp = SCENARIO_CONFIG[scenario].base;
    setReadings([{ timestamp: Date.now(), temperature: parseFloat(initialTemp.toFixed(1)) }]);

    const intervalId = setInterval(() => {
      setReadings(prevReadings => {
        const config = SCENARIO_CONFIG[scenario];
        const lastTemp = prevReadings.length > 0 ? prevReadings[prevReadings.length - 1].temperature : config.base;
        
        const randomFluctuation = (Math.random() - 0.5) * 2 * config.fluctuation;
        let newTemp = lastTemp + config.trend + randomFluctuation;

        // Clamp temperature to realistic bounds
        if (newTemp > 108) newTemp = 108;
        if (newTemp < 93) newTemp = 93;
        
        const newReading: TemperatureReading = {
          timestamp: Date.now(),
          temperature: parseFloat(newTemp.toFixed(1)),
        };
        
        const newReadings = [...prevReadings, newReading];
        // Keep the readings array from growing indefinitely
        return newReadings.length > 100 ? newReadings.slice(-100) : newReadings;
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, [scenario]);

  return { readings };
};
