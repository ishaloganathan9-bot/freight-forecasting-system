// Central API service for Intelligent Freight & Chartering System
export const API_URL = "http://localhost:8000";

// Fallback Mock Data as specified in frontend-backend contract
export const defaultMockForecast = {
  current_rate: 15.2,
  forecast_rate: 13.7,
  trend: "decreasing",
  volatility: "medium",
  confidence: 0.82,
  recommendation: "WAIT FOR BETTER MARKET ENTRY",
  historical_rates: [
    { date: "2026-01-01", rate: 16.2, isForecast: false },
    { date: "2026-01-15", rate: 16.0, isForecast: false },
    { date: "2026-02-01", rate: 15.8, isForecast: false },
    { date: "2026-02-15", rate: 15.5, isForecast: false },
    { date: "2026-03-01", rate: 15.2, isForecast: false },
    { date: "2026-03-15", rate: 14.8, isForecast: true },
    { date: "2026-04-01", rate: 14.4, isForecast: true },
    { date: "2026-04-15", rate: 14.0, isForecast: true },
    { date: "2026-05-01", rate: 13.7, isForecast: true }
  ]
};

/**
 * Generates dynamic realistic mock data if testing without backend running
 */
export function generateMockResponse(formData) {
  const isIronOre = formData.cargo?.toLowerCase().includes("iron");
  const isSouthAfrica = formData.origin?.toLowerCase().includes("south africa");
  const baseRate = isIronOre ? (isSouthAfrica ? 19.5 : 18.2) : (isSouthAfrica ? 16.8 : 15.2);
  const forecastRate = +(baseRate * 0.901).toFixed(1);

  return {
    current_rate: baseRate,
    forecast_rate: forecastRate,
    trend: "decreasing",
    volatility: "medium",
    confidence: 0.82,
    recommendation: "WAIT FOR BETTER MARKET ENTRY",
    historical_rates: [
      { date: "2026-01-01", rate: +(baseRate + 1.0).toFixed(1), isForecast: false },
      { date: "2026-01-15", rate: +(baseRate + 0.8).toFixed(1), isForecast: false },
      { date: "2026-02-01", rate: +(baseRate + 0.6).toFixed(1), isForecast: false },
      { date: "2026-02-15", rate: +(baseRate + 0.3).toFixed(1), isForecast: false },
      { date: "2026-03-01", rate: baseRate, isForecast: false },
      { date: "2026-03-15", rate: +(baseRate - 0.4).toFixed(1), isForecast: true },
      { date: "2026-04-01", rate: +(baseRate - 0.8).toFixed(1), isForecast: true },
      { date: "2026-04-15", rate: +(baseRate - 1.2).toFixed(1), isForecast: true },
      { date: "2026-05-01", rate: forecastRate, isForecast: true }
    ]
  };
}

/**
 * Sends freight analysis request to the backend service.
 * @param {Object} formData 
 * @param {boolean} forceMock - When true, bypasses network for guaranteed offline demo
 */
export async function runFreightAnalysis(formData, forceMock = false) {
  // If user selected demo simulation mode
  if (forceMock) {
    // Simulate real-time async processing delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return generateMockResponse(formData);
  }

  const payload = {
    cargo: formData.cargo?.toLowerCase(),
    quantity: Number(formData.quantity),
    origin: formData.origin,
    destination: formData.destination,
    deadline: formData.deadline,
    contract: formData.contract?.toLowerCase(),
    priority: formData.priority?.toLowerCase()
  };

  try {
    const response = await fetch(`${API_URL}/analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.warn("Backend API call failed:", err.message);
    throw new Error("Unable to connect to the analysis server. Please check your connection or start the backend at http://localhost:8000.");
  }
}
