import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';

export default function ForecastChart({ historicalRates }) {
  const data = historicalRates || [];

  return (
    <div style={{ width: '100%', height: 340 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 25, left: -5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          
          <XAxis 
            dataKey="date" 
            stroke="#64748b" 
            tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            dy={8}
          />
          
          <YAxis 
            domain={['dataMin - 1', 'dataMax + 1']}
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickFormatter={(v) => `$${v}`}
            dx={-6}
          />
          
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#071524', 
              borderColor: 'rgba(56, 189, 248, 0.35)', 
              borderRadius: 10,
              boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
              fontSize: '13px',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              padding: '10px 14px',
              color: '#f8fafc'
            }}
            formatter={(value) => [`$${value}/MT`, 'Rate Fixture']}
            labelFormatter={(label) => `Laycan Period: ${label}`}
          />

          <ReferenceLine 
            x="2026-03" 
            stroke="#f59e0b" 
            strokeDasharray="4 4" 
            label={{ 
              value: 'Current Fixture', 
              fill: '#f59e0b', 
              fontSize: 11, 
              position: 'top',
              fontFamily: 'JetBrains Mono, monospace'
            }} 
          />

          <Line 
            type="monotone" 
            dataKey="rate" 
            stroke="#38bdf8" 
            strokeWidth={3}
            dot={{ r: 4.5, fill: '#38bdf8', stroke: '#071524', strokeWidth: 2 }}
            activeDot={{ r: 6.5, fill: '#38bdf8' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}