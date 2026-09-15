import React from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceDot 
} from 'recharts';

export default function ForecastChart({ historicalRates }) {
  const defaultData = [
    { month: "Sep 2025", rate: 24.8, minRange: 22.0, maxRange: 26.5 },
    { month: "Oct 2025", rate: 26.2, minRange: 23.5, maxRange: 28.0 },
    { month: "Nov 2025", rate: 28.0, minRange: 25.0, maxRange: 30.5 },
    { month: "Dec 2025", rate: 29.8, minRange: 26.5, maxRange: 32.5 },
    { month: "Jan 2026", rate: 32.0, minRange: 28.5, maxRange: 35.0 },
    { month: "Feb 2026", rate: 33.5, minRange: 29.5, maxRange: 37.0 }
  ];

  const rawData = (historicalRates && historicalRates.length > 0) ? historicalRates : defaultData;

  // Transform data so Recharts Area can render the range nicely
  const chartData = rawData.map((d) => ({
    ...d,
    month: d.month || d.date,
    rangeBase: d.minRange || (d.rate - 2),
    rangeSpan: (d.maxRange ? d.maxRange - (d.minRange || (d.rate - 2)) : 4.5),
    displayRate: d.rate || d.rate_forecast || 30.0
  }));

  return (
    <div style={{ width: '100%', minHeight: '340px', display: 'flex', flexDirection: 'column' }}>
      {/* Legend Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1.25rem', marginBottom: '0.5rem', paddingRight: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: '#38bdf8' }} />
          <span>Forecast</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
          <span style={{ width: '12px', height: '8px', borderRadius: '2px', background: 'rgba(56, 189, 248, 0.25)', border: '1px solid rgba(56, 189, 248, 0.5)' }} />
          <span>Range</span>
        </div>
      </div>

      <div style={{ width: '100%', height: 280, minHeight: 280 }}>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={chartData} margin={{ top: 25, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="forecastAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" vertical={false} />

            <XAxis 
              dataKey="month" 
              stroke="#64748b" 
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              tickLine={false}
              dy={6}
            />

            <YAxis 
              domain={[20, 40]}
              ticks={[20, 25, 30, 35, 40]}
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              tickLine={false}
              tickFormatter={(v) => `${v}`}
              unit=""
              label={{ value: 'USD/Ton', angle: -90, position: 'insideLeft', offset: 12, fill: '#64748b', fontSize: 10 }}
            />

            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(7, 21, 36, 0.95)', 
                borderColor: 'rgba(56, 189, 248, 0.35)', 
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                fontSize: '12px',
                padding: '8px 12px',
                color: '#f8fafc'
              }}
              formatter={(value, name) => {
                if (name === 'displayRate') return [`$${value} / ton`, 'Forecast Rate'];
                return null;
              }}
              labelFormatter={(label) => `Month: ${label}`}
            />

            {/* Shaded Forecast Range Area */}
            <Area
              type="monotone"
              dataKey="rangeSpan"
              stackId="1"
              stroke="none"
              fill="url(#forecastAreaGrad)"
            />

            {/* Primary Forecast Trend Line */}
            <Line 
              type="monotone" 
              dataKey="displayRate" 
              stroke="#38bdf8" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#38bdf8', stroke: '#071524', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#ffffff', stroke: '#38bdf8', strokeWidth: 3 }}
            />

            {/* Target Milestone Callout on Jan 2026 */}
            <ReferenceDot 
              x="Jan 2026" 
              y={32.0} 
              r={5} 
              fill="#2563eb" 
              stroke="#ffffff" 
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Jan 2026 Target Tag Indicator matching mockup */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-12px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(37, 99, 235, 0.2)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '999px',
          padding: '0.2rem 0.65rem',
          fontSize: '0.72rem',
          color: '#38bdf8',
          fontWeight: 600
        }}>
          <span>Jan 2026 Target: <strong>$32 / ton</strong></span>
        </div>
      </div>
    </div>
  );
}