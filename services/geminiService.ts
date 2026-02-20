import { GoogleGenAI, Type } from "@google/genai";
import { type TemperatureReading, type HeartRateReading, type AIAnalysisResponse, TemperatureScenario, HeartRateScenario } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    temperatureSummary: { type: Type.STRING, description: "A brief, one-sentence summary for the user about their temperature." },
    temperatureStatus: { type: Type.STRING, description: "A status for temperature: Normal, Mild Fever, High Fever, Heatstroke Warning, or Hypothermia Warning." },
    temperatureRecommendation: { type: Type.STRING, description: "A short, actionable recommendation for the user regarding their temperature." },
    temperatureProfessionalNote: { type: Type.STRING, description: "A concise note for a healthcare professional about the temperature trend." },
    temperatureAlert: { type: Type.BOOLEAN, description: "Set to true if temperature status is critical ('Heatstroke Warning', 'High Fever', or 'Hypothermia Warning')." },
    
    heartRateSummary: { type: Type.STRING, description: "A brief, one-sentence summary for the user about their heart rate." },
    heartRateStatus: { type: Type.STRING, description: "A status for heart rate: Normal, Elevated (Tachycardia), or Low (Bradycardia)." },
    heartRateRecommendation: { type: Type.STRING, description: "A short, actionable recommendation for the user regarding their heart rate." },
    heartRateProfessionalNote: { type: Type.STRING, description: "A concise note for a healthcare professional about the heart rate trend." },
    heartRateAlert: { type: Type.BOOLEAN, description: "Set to true if heart rate status is critical ('Tachycardia' or 'Bradycardia')." },
  },
  required: [
    "temperatureSummary", "temperatureStatus", "temperatureRecommendation", "temperatureProfessionalNote", "temperatureAlert",
    "heartRateSummary", "heartRateStatus", "heartRateRecommendation", "heartRateProfessionalNote", "heartRateAlert"
  ],
};


export const analyzeHealthData = async (
  tempReadings: TemperatureReading[],
  hrReadings: HeartRateReading[],
  tempScenario: TemperatureScenario,
  hrScenario: HeartRateScenario
): Promise<AIAnalysisResponse> => {
  const tempHistory = tempReadings.map(r => r.temperature).join(', ');
  const hrHistory = hrReadings.map(r => r.heartRate).join(', ');
  const currentTemp = tempReadings[tempReadings.length - 1].temperature;
  const currentHr = hrReadings[hrReadings.length - 1].heartRate;

  const prompt = `
    You are an AI assistant for a smart wearable thermometer that also tracks heart rate.
    Analyze the following recent temperature readings (°F) and heart rate readings (BPM).
    The data is in chronological order, representing the last 30-45 minutes.

    Context is crucial for your analysis.
    - Temperature Scenario: "${tempScenario}"
    - Heart Rate Scenario: "${hrScenario}"

    Analyze the correlation between the two metrics. For example, a high heart rate during a 'Fever' scenario is expected, but a high heart rate during a 'Normal' temperature and 'Resting' HR scenario might indicate stress or another issue.

    - Temperature History (°F): [${tempHistory}]
    - Heart Rate History (BPM): [${hrHistory}]

    The current temperature is ${currentTemp}°F.
    The current heart rate is ${currentHr} BPM.

    Provide a separate, concise analysis for both temperature and heart rate.
    Return the response as a JSON object matching the provided schema.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      }
    });

    const jsonText = response.text;
    const parsedResponse = JSON.parse(jsonText);
    
    // Basic type guard to be safe
    if (
      typeof parsedResponse.temperatureStatus === 'string' &&
      typeof parsedResponse.heartRateStatus === 'string'
    ) {
      return parsedResponse as AIAnalysisResponse;
    } else {
      throw new Error("Invalid JSON structure from API");
    }

  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
};
