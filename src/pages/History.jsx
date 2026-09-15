import React, { useState } from 'react';
import { History as HistoryIcon, Search, Filter, Download, ArrowRight, Ship, Calendar } from 'lucide-react';
import { defaultAnalysisData } from '../services/api';

export default function History({ setCurrentPage, setAnalysisData }) {
  const [searchTerm, setSearchTerm] = useState('');

  const historyItems = [
    { id: 'HIST-901', date: '11 Sep 2025', corridor: 'Australia → Paradip', cargo: 'Bulk Commodity (Coal)', quantity: '50,000 MT', vessel: 'Panamax', rate: '$32.0 / t', cost: '$1.32M', status: 'Completed', trend: '+8%' },
    { id: 'HIST-900', date: '08 Sep 2025', corridor: 'Qatar → Paradip', cargo: 'Bauxite & Limestone', quantity: '45,000 MT', vessel: 'Supramax', rate: '$24.5 / t', cost: '$1.10M', status: 'Completed', trend: '+5%' },
    { id: 'HIST-899', date: '02 Sep 2025', corridor: 'Brazil → Paradip', cargo: 'Iron Ore Fines', quantity: '60,000 MT', vessel: 'Capesize', rate: '$18.9 / t', cost: '$1.13M', status: 'Completed', trend: '-4%' },
    { id: 'HIST-898', date: '26 Aug 2025', corridor: 'Indonesia → Paradip', cargo: 'Thermal Coal', quantity: '40,000 MT', vessel: 'Handysize', rate: '$16.2 / t', cost: '$648K', status: 'Archived', trend: '0%' },
    { id: 'HIST-897', date: '19 Aug 2025', corridor: 'South Africa → Paradip', cargo: 'Steam Coal', quantity: '75,000 MT', vessel: 'Panamax', rate: '$22.4 / t', cost: '$1.68M', status: 'Archived', trend: '+2%' },
  ];

  const filtered = historyItems.filter(item => 
    item.corridor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vessel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content-area">
      <div className="panel-box" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Chartering Analysis History
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Review past forward freight evaluations, fixtures, and route projections.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="search-wrapper" style={{ width: '220px' }}>
              <Search size={14} className="search-icon" />
              <input 
                type="text" 
                placeholder="Filter by corridor or vessel..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button 
              type="button" 
              onClick={() => setCurrentPage('new-analysis')}
              className="fast-submit-btn" 
              style={{ margin: 0 }}
            >
              <span>+ New Analysis</span>
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="matrix-table">
            <thead>
              <tr>
                <th>ID & Date</th>
                <th>Corridor Route</th>
                <th>Commodity & Quantity</th>
                <th>Selected Vessel</th>
                <th>Forecast Rate</th>
                <th>Est. Fixture Cost</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.id}</span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{row.date}</span>
                    </div>
                  </td>
                  <td><strong>{row.corridor}</strong></td>
                  <td>
                    <div>{row.cargo}</div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{row.quantity}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{row.vessel}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{row.rate}</span>
                    <span style={{ fontSize: '0.68rem', color: row.trend.startsWith('+') ? '#10b981' : '#f43f5e', marginLeft: '0.3rem' }}>
                      ({row.trend})
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.cost}</td>
                  <td>
                    <span className="suitability-pill good" style={{ fontSize: '0.68rem' }}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => setCurrentPage('recommendations')}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.72rem',
                        color: 'var(--accent-cyan)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <span>View</span>
                      <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
