# Intelligent Freight & Chartering System — Frontend (F1)
**Smart India Hackathon (SIH 2026)**

Decision Support Platform for Dry Bulk Cargo Procurement and Chartering.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```
Open your browser at: **`http://localhost:3000`**

### 3. Build for Production
```bash
npm run build
```

---

## 🧭 Application Structure & Flow

```
freight-forecast/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Brand bar, live Baltic feed status, page switcher
│   │   ├── InputForm.jsx       # 4-section structured procurement input form
│   │   ├── ForecastChart.jsx   # Interactive Recharts rate history & projection
│   │   └── Recommendation.jsx  # Actionable decision support card & savings impact
│   ├── pages/
│   │   ├── Home.jsx            # Landing page, value pillars, quick CTAs
│   │   ├── NewAnalysis.jsx     # Analysis runner with 4-stage progressive loader
│   │   └── Dashboard.jsx       # Market Intelligence workspace & 5-metric overview
│   ├── services/
│   │   └── api.js              # Central API client & mock contract handler
│   ├── App.jsx                 # Top-level state and navigation
│   ├── main.jsx                # Application root entry point
│   └── index.css               # Maritime intelligence design system styles
```

---

## 🔌 Backend API Integration (`services/api.js`)

The frontend interacts with the backend server via a single configurable constant:
```javascript
const API_URL = "http://localhost:8000";
```

### Request Payload (POST `http://localhost:8000/analysis`):
```json
{
  "cargo": "coal",
  "quantity": 300000,
  "origin": "Indonesia",
  "destination": "Paradip",
  "deadline": "3 months",
  "contract": "short-term",
  "priority": "balanced"
}
```

### Expected Response Format:
```json
{
  "current_rate": 15.2,
  "forecast_rate": 13.7,
  "trend": "decreasing",
  "volatility": "medium",
  "confidence": 0.82,
  "recommendation": "WAIT FOR BETTER MARKET ENTRY",
  "historical_rates": [
    { "date": "2026-01-01", "rate": 16.2, "isForecast": false },
    { "date": "2026-02-01", "rate": 15.8, "isForecast": false },
    { "date": "2026-03-01", "rate": 15.2, "isForecast": false },
    { "date": "2026-04-01", "rate": 14.5, "isForecast": true },
    { "date": "2026-05-01", "rate": 13.9, "isForecast": true },
    { "date": "2026-06-01", "rate": 13.7, "isForecast": true }
  ]
}
```

---

## 💡 How to Demo for SIH Evaluators

1. **Start on Landing Page**: Show the professional hero and value pillars. Click **"Start New Analysis"** or **"Load SIH Demo Scenario"**.
2. **Form Interaction**: Show the prefilled scenario (*Coal, 300,000 tonnes, Indonesia → Paradip, 3 months, Short-term, Balanced*). Click the **"Auto-fill SIH Demo Scenario"** button to demonstrate easy preset switching.
3. **Validation**: Clear a field (e.g. quantity) to demonstrate inline validation.
4. **Animated Analysis Experience**: Click **"Run Analysis →"**. Watch the 4-stage radar loader:
   - *Reviewing cargo requirements ✓*
   - *Analyzing freight market ...*
   - *Preparing forecast*
   - *Generating recommendation*
5. **Market Intelligence Workspace**:
   - Point out the compact context banner at the top (*Coal | Indonesia → Paradip | 300,000t*).
   - Point out the 5 core market metrics: **Current Rate**, **Predicted Rate**, **Market Trend**, **Volatility**, and **Forecast Confidence**.
   - Hover over the **Interactive Rate History & Forecast Chart** (Recharts) to show historical fixtures vs forward projections.
   - Point out the **Chartering Decision Recommendation** (*WAIT FOR BETTER MARKET ENTRY*) and the estimated cargo savings (**$450,000** on 300k tonnes).
6. **Graceful Fallback & Retry**: If the backend at `localhost:8000` is offline, click **"Use Simulated Demo Data"** to present uninterrupted!
