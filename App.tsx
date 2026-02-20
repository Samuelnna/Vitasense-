import React, { useState, useEffect, useCallback } from 'react';
import { useTemperatureSensor } from './hooks/useTemperatureSensor';
import { useHeartRateSensor } from './hooks/useHeartRateSensor';
import { analyzeHealthData } from './services/geminiService';
import { playAlertSound } from './services/audioService';
import { TemperatureScenario, HeartRateScenario, type AIAnalysisResponse, type TemperatureReading, type HeartRateReading } from './types';

import Header from './components/Header';
import Alert from './components/Alert';
import AiAnalysis from './components/AiAnalysis';
import AlertHistory from './components/AlertHistory';
import TemperatureDisplay from './components/TemperatureDisplay';
import ScenarioSelector from './components/ScenarioSelector';
import TemperatureChart from './components/TemperatureChart';
import HeartRateDisplay from './components/HeartRateDisplay';
import HeartRateScenarioSelector from './components/HeartRateScenarioSelector';
import HeartRateChart from './components/HeartRateChart';

const App: React.FC = () => {
  // Temperature State
  const [tempScenario, setTempScenario] = useState<TemperatureScenario>(TemperatureScenario.NORMAL);
  const { readings: tempReadings } = useTemperatureSensor(tempScenario);

  // Heart Rate State
  const [hrScenario, setHrScenario] = useState<HeartRateScenario>(HeartRateScenario.RESTING);
  const { readings: hrReadings } = useHeartRateSensor(hrScenario);

  // Shared State
  const [analysis, setAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertHistory, setAlertHistory] = useState<AIAnalysisResponse[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('vitaSenseMuted') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('vitaSenseAlertHistory');
      if (storedHistory) {
        setAlertHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse alert history from localStorage", error);
    }
  }, []);
  
  const latestTempReading = tempReadings.length > 0 ? tempReadings[tempReadings.length - 1] : null;
  const latestHrReading = hrReadings.length > 0 ? hrReadings[hrReadings.length - 1] : null;

  const fetchAnalysis = useCallback(async (currentTempReadings: TemperatureReading[], currentHrReadings: HeartRateReading[]) => {
    if (currentTempReadings.length < 5 || currentHrReadings.length < 5) return;
    setIsLoading(true);
    try {
      const recentTemp = currentTempReadings.slice(-15);
      const recentHr = currentHrReadings.slice(-15);
      const result = await analyzeHealthData(recentTemp, recentHr, tempScenario, hrScenario);
      setAnalysis(result);

      if (result.temperatureAlert || result.heartRateAlert) {
        const lastAlert = alertHistory[0];
        if (!lastAlert || lastAlert.temperatureStatus !== result.temperatureStatus || lastAlert.heartRateStatus !== result.heartRateStatus) {
          const newAlert = { ...result, timestamp: Date.now() };
          const newHistory = [newAlert, ...alertHistory];
          setAlertHistory(newHistory);
          localStorage.setItem('vitaSenseAlertHistory', JSON.stringify(newHistory));

          if (!isMuted) {
            if (result.temperatureAlert) playAlertSound(result.temperatureStatus);
            if (result.heartRateAlert) playAlertSound(result.heartRateStatus);
          }
        }
      }

    } catch (error) {
      console.error("Error fetching AI analysis:", error);
      // Set a generic error state
    } finally {
      setIsLoading(false);
    }
  }, [alertHistory, tempScenario, hrScenario, isMuted]);

  useEffect(() => {
    const shouldFetch = tempReadings.length > 0 && hrReadings.length > 0 && tempReadings.length % 10 === 0;
    if (shouldFetch) {
      fetchAnalysis(tempReadings, hrReadings);
    }
  }, [tempReadings, hrReadings, fetchAnalysis]);
  
  const handleToggleMute = useCallback(() => {
    setIsMuted(prev => {
        const newMutedState = !prev;
        localStorage.setItem('vitaSenseMuted', String(newMutedState));
        return newMutedState;
    });
  }, []);

  const handleClearHistory = () => {
    setAlertHistory([]);
    localStorage.removeItem('vitaSenseAlertHistory');
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <Header isMuted={isMuted} onToggleMute={handleToggleMute} />
      <main className="container mx-auto p-4 md:p-6">
        {analysis?.temperatureAlert && <Alert status={analysis.temperatureStatus} summary={analysis.temperatureSummary} />}
        {analysis?.heartRateAlert && <Alert status={analysis.heartRateStatus} summary={analysis.heartRateSummary} />}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <TemperatureDisplay reading={latestTempReading} analysis={analysis} />
            <HeartRateDisplay reading={latestHrReading} analysis={analysis} />
            <ScenarioSelector currentScenario={tempScenario} onScenarioChange={setTempScenario} />
            <HeartRateScenarioSelector currentScenario={hrScenario} onScenarioChange={setHrScenario} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <TemperatureChart data={tempReadings} />
            <HeartRateChart data={hrReadings} />
            <AiAnalysis analysis={analysis} isLoading={isLoading} />
            <AlertHistory history={alertHistory} onClear={handleClearHistory} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
