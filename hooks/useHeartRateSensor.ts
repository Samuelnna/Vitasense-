import { useState, useEffect } from 'react';
import { type HeartRateReading, HeartRateScenario } from '../types';

const SCENARIO_CONFIG = {
  [HeartRateScenario.RESTING]: { base: 70, fluctuation: 3, trend: 0 },
  [HeartRateScenario.EXERCISE]: { base: 140, fluctuation: 8, trend: 0.1 },
  [HeartRateScenario.STRESS]: { base: 110, fluctuation: 6, trend: 0.2 },
};

export const useHeartRateSensor = (scenario: HeartRateScenario) => {
  const [readings, setReadings] = useState<HeartRateReading[]>([]);

  useEffect(() => {
    // Reset readings when scenario changes
    const initialHr = SCENARIO_CONFIG[scenario].base;
    setReadings([{ timestamp: Date.now(), heartRate: Math.round(initialHr) }]);

    const intervalId = setInterval(() => {
      setReadings(prevReadings => {
        const config = SCENARIO_CONFIG[scenario];
        const lastHr = prevReadings.length > 0 ? prevReadings[prevReadings.length - 1].heartRate : config.base;
        
        const randomFluctuation = (Math.random() - 0.5) * 2 * config.fluctuation;
        let newHr = lastHr + config.trend + randomFluctuation;

        // Clamp heart rate to realistic bounds
        if (newHr > 200) newHr = 200;
        if (newHr < 40) newHr = 40;
        
        const newReading: HeartRateReading = {
          timestamp: Date.now(),
          heartRate: Math.round(newHr),
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
