export interface TemperatureReading {
  timestamp: number;
  temperature: number; // in Fahrenheit
}

export interface HeartRateReading {
  timestamp: number;
  heartRate: number; // in beats per minute (BPM)
}

export interface AIAnalysisResponse {
  temperatureSummary: string;
  temperatureStatus: string;
  temperatureRecommendation: string;
  temperatureProfessionalNote: string;
  temperatureAlert: boolean;

  heartRateSummary: string;
  heartRateStatus: string;
  heartRateRecommendation: string;
  heartRateProfessionalNote: string;
  heartRateAlert: boolean;
  
  timestamp?: number;
}

export enum TemperatureScenario {
  NORMAL = 'Normal',
  FEVER = 'Fever',
  HEAT_STRESS = 'Heat Stress',
  HYPOTHERMIA = 'Hypothermia',
}

export enum HeartRateScenario {
  RESTING = 'Resting',
  EXERCISE = 'Exercise',
  STRESS = 'Stress',
}
