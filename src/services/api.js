// Central API service for Intelligent Freight & Chartering System
export const API_URL = "http://localhost:8000";

// Master baseline scenario matching the reference designs
export const defaultAnalysisData = {
  input: {
    cargo: "Bulk Commodity",
    quantity: 50000,
    origin: "Australia",
    destination: "Paradip Port, India",
    deadline: "Next 3 Months",
    contract: "Short-term Spot",
    priority: "Balanced"
  },
  timestamp: "11 Sep 2025",
  metrics: {
    freight_rate_range: "$26 – $32 / ton",
    freight_rate_current: 28.4,
    freight_rate_forecast: 32.0,
    freight_rate_change: "+ 8%",
    freight_rate_trend: "uptrend",
    recommended_vessel: "Panamax",
    recommended_vessel_dwt: "60,000 – 80,000 DWT",
    estimated_total_cost: "$1.25M – $1.45M",
    estimated_cost_exact: "$1.32M",
    estimated_cost_change: "+ 12%",
    chartering_window: "Nov 2025 – Jan 2026",
    chartering_note: "Expected lower rates",
    risk_level: "Low - Medium",
    overall_score: 92
  },
  route_details: {
    corridor: "Australia → Paradip",
    origin_name: "Australia (Hay Point)",
    origin_coords: { x: 74, y: 72 },
    destination_name: "Paradip Port, India",
    destination_coords: { x: 42, y: 32 },
    distance: "~ 6,800 NM",
    transit_time: "18 – 22 days",
    cargo_quantity: "50,000 tonnes",
    vessel_type: "Bulk Carrier",
    port_conditions: "Suitable",
    weather_risk: "Low – Moderate"
  },
  historical_rates: [
    { month: "Sep 2025", rate: 24.8, minRange: 22.0, maxRange: 26.5, isForecast: false },
    { month: "Oct 2025", rate: 26.2, minRange: 23.5, maxRange: 28.0, isForecast: false },
    { month: "Nov 2025", rate: 28.0, minRange: 25.0, maxRange: 30.5, isForecast: true },
    { month: "Dec 2025", rate: 29.8, minRange: 26.5, maxRange: 32.5, isForecast: true },
    { month: "Jan 2026", rate: 32.0, minRange: 28.5, maxRange: 35.0, isForecast: true, note: "$32 / ton" },
    { month: "Feb 2026", rate: 33.5, minRange: 29.5, maxRange: 37.0, isForecast: true }
  ],
  vessel_options: [
    {
      id: "handysize",
      name: "Handysize",
      capacity: "25,000 – 45,000 DWT",
      dwt_range: "25k-45k DWT",
      est_cost_range: "1.35M – 1.55M",
      est_cost_display: "$1.35M",
      port_suitability: "Moderate",
      risk_level: "Medium",
      suitability: "Good",
      overall_score: 68,
      is_recommended: false
    },
    {
      id: "supramax",
      name: "Supramax",
      capacity: "50,000 – 60,000 DWT",
      dwt_range: "50k-60k DWT",
      est_cost_range: "1.20M – 1.40M",
      est_cost_display: "$1.25M",
      port_suitability: "Good",
      risk_level: "Low",
      suitability: "Good",
      overall_score: 82,
      is_recommended: false
    },
    {
      id: "panamax",
      name: "Panamax",
      capacity: "60,000 – 80,000 DWT",
      dwt_range: "60k-80k DWT",
      est_cost_range: "1.25M – 1.45M",
      est_cost_display: "$1.32M",
      port_suitability: "Excellent",
      risk_level: "Low",
      suitability: "Excellent",
      overall_score: 92,
      is_recommended: true
    },
    {
      id: "capesize",
      name: "Capesize",
      capacity: "100,000+ DWT",
      dwt_range: "100k+ DWT",
      est_cost_range: "1.45M – 1.80M",
      est_cost_display: "$1.46M",
      port_suitability: "Limited",
      risk_level: "Medium",
      suitability: "Moderate",
      overall_score: 75,
      is_recommended: false
    }
  ],
  why_recommendation: [
    "Suitable cargo capacity (60,000 – 80,000 tonnes)",
    "Compatible with destination port draft & facilities",
    "Lower expected operational risk",
    "Better projected freight economics",
    "Reduced idle-time risk"
  ],
  scores: {
    overall: 92,
    cost: 35,
    risk: 25,
    efficiency: 20,
    sustainability: 20
  },
  explainable_ai: [
    { factor: "Freight Rate Forecast", weight: 28 },
    { factor: "Vessel Suitability", weight: 22 },
    { factor: "Port Constraints", weight: 18 },
    { factor: "Operational Cost", weight: 17 },
    { factor: "Risk Assessment", weight: 15 }
  ],
  next_steps: [
    { step: 1, title: "Confirm Vessel & Contract Terms", status: "pending" },
    { step: 2, title: "Coordinate with Shipping Line", status: "upcoming" },
    { step: 3, title: "Monitor Market Changes", status: "upcoming" },
    { step: 4, title: "Proceed with Chartering", status: "upcoming" }
  ],
  recent_activity: [
    { id: 1, title: "Analysis completed", desc: "Freight rate forecast generated", time: "2h ago", type: "success" },
    { id: 2, title: "New recommendation", desc: "Panamax vessel suggested", time: "3h ago", type: "info" },
    { id: 3, title: "Data update", desc: "Market data refreshed", time: "5h ago", type: "primary" },
    { id: 4, title: "Report generated", desc: "Summary report ready", time: "6h ago", type: "document" }
  ],
  recent_analyses: [
    { date: "11 Sep 2025", route: "Australia → Paradip", cargo: "50,000", vessel: "Panamax", trend: "Uptrend", trendDir: "up" },
    { date: "08 Sep 2025", route: "Qatar → Paradip", cargo: "45,000", vessel: "Supramax", trend: "Uptrend", trendDir: "up" },
    { date: "02 Sep 2025", route: "Brazil → Paradip", cargo: "60,000", vessel: "Capesize", trend: "Downtrend", trendDir: "down" },
    { date: "26 Aug 2025", route: "Indonesia → Paradip", cargo: "40,000", vessel: "Handysize", trend: "Stable", trendDir: "neutral" }
  ]
};

/**
 * Generates dynamic realistic mock data if testing without backend running
 */
export function generateMockResponse(formData) {
  const qty = Number(formData.quantity) || 50000;
  const isCapesize = qty >= 90000;
  const isPanamax = qty >= 45000 && qty < 90000;
  const isSupramax = qty >= 35000 && qty < 45000;
  const recommendedName = isCapesize ? "Capesize" : (isPanamax ? "Panamax" : (isSupramax ? "Supramax" : "Handysize"));

  const origin = formData.origin || "Australia";
  const destination = formData.destination || "Paradip Port, India";
  const cargo = formData.cargo || "Bulk Commodity";

  const baseRate = cargo.toLowerCase().includes("coal") ? 28.5 : 31.0;
  const targetRate = +(baseRate * 1.12).toFixed(1);

  return {
    ...defaultAnalysisData,
    input: {
      cargo,
      quantity: qty,
      origin,
      destination,
      deadline: formData.deadline || "Next 3 Months",
      contract: formData.contract || "Short-term Spot",
      priority: formData.priority || "Balanced"
    },
    metrics: {
      ...defaultAnalysisData.metrics,
      freight_rate_current: baseRate,
      freight_rate_forecast: targetRate,
      freight_rate_range: `$${baseRate - 2} – $${targetRate} / ton`,
      recommended_vessel: recommendedName,
      recommended_vessel_dwt: isCapesize ? "100,000+ DWT" : (isPanamax ? "60,000 – 80,000 DWT" : "50,000 – 60,000 DWT"),
      estimated_total_cost: `$${((qty * targetRate) / 1000000).toFixed(2)}M – $${((qty * (targetRate + 3)) / 1000000).toFixed(2)}M`,
      estimated_cost_exact: `$${((qty * targetRate) / 1000000).toFixed(2)}M`
    },
    route_details: {
      ...defaultAnalysisData.route_details,
      corridor: `${origin} → ${destination.split(',')[0]}`,
      origin_name: origin,
      destination_name: destination,
      cargo_quantity: `${qty.toLocaleString()} tonnes`
    },
    vessel_options: defaultAnalysisData.vessel_options.map(v => ({
      ...v,
      is_recommended: v.name.toLowerCase() === recommendedName.toLowerCase()
    }))
  };
}

/**
 * Sends freight analysis request to the backend service or generates mock
 */
export async function runFreightAnalysis(formData, forceMock = false) {
  if (forceMock) {
    await new Promise((resolve) => setTimeout(resolve, 1400));
    return generateMockResponse(formData);
  }

  const payload = {
    cargo: formData.cargo,
    quantity: Number(formData.quantity),
    origin: formData.origin,
    destination: formData.destination,
    deadline: formData.deadline,
    contract: formData.contract,
    priority: formData.priority
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
    return { ...generateMockResponse(formData), ...data };
  } catch (err) {
    console.warn("Backend API call offline, falling back to rich model simulation:", err.message);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return generateMockResponse(formData);
  }
}
