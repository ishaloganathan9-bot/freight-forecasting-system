import React, { useState } from 'react';
import { 
  Anchor, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Wind, 
  Sun, 
  FileText, 
  BarChart3, 
  Info,
  Radio,
  Sliders,
  ExternalLink
} from 'lucide-react';

export default function PortOperatorDashboard() {
  const [selectedBerth, setSelectedBerth] = useState('B3');
  const [viewMode, setViewMode] = useState('Week'); // 'Day' | 'Week'
  const [scheduleAdjustment, setScheduleAdjustment] = useState(65);
  const [adjustedMessage, setAdjustedMessage] = useState('');

  const berths = [
    { 
      id: 'B1', 
      type: 'Coal', 
      vessel: 'MV Ocean Star', 
      time: 'ETA: 15 Sep 09:00 → 18 Sep 18:00',
      startDay: 1, 
      span: 3.5, 
      color: '#38bdf8', 
      status: 'Occupied' 
    },
    { 
      id: 'B2', 
      type: 'Iron Ore', 
      vessel: 'MV Blue Horizon', 
      time: 'ETA: 16 Sep 14:00 → 20 Sep 06:00',
      startDay: 2, 
      span: 4, 
      color: '#10b981', 
      status: 'Occupied' 
    },
    { 
      id: 'B3', 
      type: 'Container', 
      vessel: 'MV Coral Queen', 
      time: 'ETA: 17 Sep 09:00 → 19 Sep 22:00',
      startDay: 3, 
      span: 2.8, 
      color: '#a855f7', 
      status: 'Occupied' 
    },
    { 
      id: 'B4', 
      type: 'Bulk', 
      vessel: 'MV Sunrise', 
      time: 'ETA: 18 Sep 11:00 → 21 Sep 14:00',
      startDay: 4, 
      span: 3.2, 
      color: '#f59e0b', 
      status: 'Occupied' 
    },
    { 
      id: 'B5', 
      type: 'Coal', 
      vessel: null, 
      time: '',
      startDay: 0, 
      span: 0, 
      color: '', 
      status: 'Available' 
    },
    { 
      id: 'B6', 
      type: 'Multi-purpose', 
      vessel: 'MV Pacific Wind', 
      time: 'ETA: 16 Sep 20:00 → 20 Sep 12:00',
      startDay: 2.5, 
      span: 3.8, 
      color: '#06b6d4', 
      status: 'Occupied' 
    },
    { 
      id: 'B7', 
      type: 'Container', 
      vessel: null, 
      time: '',
      startDay: 0, 
      span: 0, 
      color: '', 
      status: 'Available' 
    },
    { 
      id: 'B8', 
      type: 'Bulk', 
      vessel: null, 
      time: '',
      startDay: 0, 
      span: 0, 
      color: '', 
      status: 'Available' 
    },
  ];

  const days = [
    { day: '15 Sep', name: 'Mon' },
    { day: '16 Sep', name: 'Tue' },
    { day: '17 Sep', name: 'Wed' },
    { day: '18 Sep', name: 'Thu' },
    { day: '19 Sep', name: 'Fri' },
    { day: '20 Sep', name: 'Sat' },
    { day: '21 Sep', name: 'Sun' }
  ];

  const handleUpdateSchedule = () => {
    setAdjustedMessage('Berth B3 Schedule updated successfully! Pilots & stevedores notified.');
    setTimeout(() => setAdjustedMessage(''), 3000);
  };

  return (
    <div className="content-area">
      {/* Port Operator Hero Banner */}
      <div style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        marginBottom: '1.5rem',
        border: '1px solid var(--border-card)',
        minHeight: '130px',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(90deg, #071524 0%, rgba(7, 21, 36, 0.9) 45%, rgba(7, 21, 36, 0.4) 100%)'
      }}>
        <img 
          src="/assets/port_terminal_banner.jpg" 
          alt="Berth Operations" 
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: '60%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            opacity: 0.7
          }} 
        />
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '65%',
          background: 'linear-gradient(90deg, #071524 60%, rgba(7, 21, 36, 0.9) 80%, transparent 100%)',
          zIndex: 1
        }} />

        <div style={{ position: 'relative', zIndex: 2, padding: '1.5rem 2rem', maxWidth: '600px' }}>
          <h1 style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '0.35rem'
          }}>
            Berth Operations
          </h1>
          <p style={{
            fontSize: '0.84rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.4
          }}>
            Monitor berth availability, manage vessel schedules and keep port operations running smoothly.
          </p>
        </div>

        {/* Live Updates & Date Chips */}
        <div style={{
          position: 'absolute',
          right: '2rem',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            backgroundColor: 'rgba(7, 21, 36, 0.85)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.4rem 0.85rem',
            fontSize: '0.78rem',
            color: 'var(--text-primary)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem'
          }}>
            <Calendar size={14} style={{ color: 'var(--accent-cyan)' }} />
            <span>15 Sep 2025</span>
          </div>

          <button
            type="button"
            onClick={() => alert('Berth telemetry synced with AIS.')}
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              borderRadius: 'var(--radius-sm)',
              padding: '0.4rem 0.85rem',
              fontSize: '0.78rem',
              color: '#10b981',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span>Live Updates</span>
          </button>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '0.85rem',
        marginBottom: '1.5rem'
      }}>
        {/* KPI 1 */}
        <div className="panel-box" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)'
            }}>
              <Anchor size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Total Berths</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>8</div>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="panel-box" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(168, 85, 247, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-purple)'
            }}>
              <Radio size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Occupied</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-purple)' }}>5</div>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="panel-box" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-emerald)'
            }}>
              <CheckCircle2 size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Available</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>3</div>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="panel-box" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)'
            }}>
              <Clock size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Avg. Waiting Time</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>14 hrs</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--accent-emerald)' }}>↓ 28% vs last week</div>
            </div>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="panel-box" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-amber)'
            }}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Port Congestion</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-amber)' }}>Moderate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Berth Gantt Schedule (63%) & Right Berth Details / Actions (37%) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.6fr 1fr',
        gap: '1.25rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Berth Gantt Timeline */}
        <div className="panel-box" style={{ padding: '1.25rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem'
          }}>
            <h2 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Anchor size={16} style={{ color: 'var(--accent-cyan)' }} />
              <span>Berth Schedule</span>
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Date Nav */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                color: 'var(--text-primary)'
              }}>
                <button type="button" style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
                  <ChevronLeft size={14} />
                </button>
                <span>15 Sep 2025 – 21 Sep 2025</span>
                <button type="button" style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* View Toggle */}
              <div style={{
                display: 'flex',
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                padding: '2px'
              }}>
                {['Day', 'Week'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    style={{
                      border: 'none',
                      backgroundColor: viewMode === mode ? 'var(--accent-blue)' : 'transparent',
                      color: viewMode === mode ? '#ffffff' : 'var(--text-secondary)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer'
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline Grid Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '100px repeat(7, 1fr)',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '0.5rem',
            marginBottom: '0.75rem',
            textAlign: 'center',
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'var(--text-secondary)'
          }}>
            <div style={{ textAlign: 'left', paddingLeft: '0.5rem' }}>Berth No.</div>
            {days.map((d, i) => (
              <div key={i}>
                <div>{d.day}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{d.name}</div>
              </div>
            ))}
          </div>

          {/* Timeline Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {berths.map((b) => {
              const isSelected = selectedBerth === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBerth(b.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '100px 1fr',
                    alignItems: 'center',
                    backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.08)' : 'var(--bg-card-subtle)',
                    border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.45rem 0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {/* Berth Identifier */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: b.status === 'Occupied' ? '#38bdf8' : '#10b981'
                    }} />
                    <span style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                      {b.id}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {b.type}
                    </span>
                  </div>

                  {/* Vessel Occupancy Bar on 7-day grid */}
                  <div style={{
                    position: 'relative',
                    height: '32px',
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    {b.vessel ? (
                      <div style={{
                        position: 'absolute',
                        left: `${(b.startDay / 7) * 100}%`,
                        width: `${(b.span / 7) * 100}%`,
                        top: '2px',
                        bottom: '2px',
                        backgroundColor: b.color,
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.2rem 0.45rem',
                        color: '#ffffff',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                      }}>
                        <span>{b.vessel}</span>
                        <span style={{ fontSize: '0.58rem', opacity: 0.9, fontWeight: 400 }}>{b.time}</span>
                      </div>
                    ) : (
                      <div style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '0.7rem',
                        border: '1px dashed var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        Available
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Berth Details, Operations, & Adjustments */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Selected Berth Details Card */}
          <div className="panel-box" style={{ padding: '1.25rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.85rem'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Selected Berth Details
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {selectedBerth} — Container Berth
                </h3>
              </div>
              <span style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--accent-emerald)',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '0.2rem 0.55rem',
                borderRadius: '999px'
              }}>
                Occupied
              </span>
            </div>

            {/* Thumbnail and technical stats */}
            <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '1rem' }}>
              <img 
                src="/assets/panamax_vessel.jpg" 
                alt="Berth Vessel" 
                style={{ width: '85px', height: '65px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.7rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Max Vessel Size</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>260 m (LOA)</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Berth Depth</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>14.5 m</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Handling Capacity</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>60,000 TEU/day</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Berth Free</div>
                  <div style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>19 Sep 22:00</div>
                </div>
              </div>
            </div>

            {/* Vessel Schedule Stepper */}
            <div style={{
              backgroundColor: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                  MV Coral Queen
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', cursor: 'pointer', fontWeight: 600 }}>
                  View Vessel Info
                </span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                ETA: 17 Sep 09:00 &nbsp;|&nbsp; ETD: 19 Sep 22:00
              </div>

              {/* Progress Track */}
              <div style={{ position: 'relative', padding: '0.5rem 0' }}>
                <div style={{ height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '2px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, width: '65%', height: '100%', backgroundColor: 'var(--accent-blue)', borderRadius: '2px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                  <span>Current ETA<br /><b style={{ color: 'var(--text-primary)' }}>17 Sep 09:00</b></span>
                  <span style={{ textAlign: 'center' }}>Berth Time<br /><b style={{ color: 'var(--accent-cyan)' }}>17 Sep 12:00 - 19 Sep</b></span>
                  <span style={{ textAlign: 'right' }}>Current ETD<br /><b style={{ color: 'var(--text-primary)' }}>19 Sep 22:00</b></span>
                </div>
              </div>
            </div>

            {/* Adjust Schedule Controls */}
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Adjust Schedule
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setScheduleAdjustment(Math.max(20, scheduleAdjustment - 15))}
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.4rem',
                    fontSize: '0.72rem',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  + Early Finish
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleAdjustment(Math.min(100, scheduleAdjustment + 15))}
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.4rem',
                    fontSize: '0.72rem',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  + Time Extension
                </button>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={scheduleAdjustment}
                onChange={(e) => setScheduleAdjustment(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-blue)', marginBottom: '0.4rem' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                <span>17 Sep 09:00</span>
                <span>21 Sep 22:00</span>
              </div>

              {adjustedMessage && (
                <div style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10b981',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.4rem 0.6rem',
                  fontSize: '0.72rem',
                  color: '#10b981',
                  marginBottom: '0.75rem'
                }}>
                  {adjustedMessage}
                </div>
              )}

              <button
                type="button"
                onClick={handleUpdateSchedule}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--accent-blue)',
                  backgroundImage: 'linear-gradient(135deg, #1d68ff 0%, #1652cc 100%)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.65rem',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: 'var(--nav-active-shadow)'
                }}
              >
                Update Schedule
              </button>
            </div>
          </div>

          {/* Berth Notifications */}
          <div className="panel-box" style={{ padding: '1.25rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.85rem'
            }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Notifications
              </h3>
              <span 
                onClick={() => alert('All operational berth notifications.')}
                style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', cursor: 'pointer' }}
              >
                View All →
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.72rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={15} style={{ color: 'var(--accent-emerald)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    MV Blue Horizon completed berthing 2 hours early.
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Please confirm next operation. · 2h ago</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <AlertCircle size={15} style={{ color: 'var(--accent-amber)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    Time extension requested for MV Coral Queen (B3).
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Awaiting your approval. · 4h ago</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <Info size={15} style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    Cargo buyer updated ETA for MV Sunrise (B4).
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>6h ago</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Port Weather */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {/* Quick Actions */}
            <div className="panel-box" style={{ padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Quick Actions
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <button
                  type="button"
                  onClick={() => alert('Opening Paradip Port Master Layout & Berth specs.')}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.35rem 0.5rem',
                    fontSize: '0.68rem',
                    color: 'var(--text-secondary)',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  View Port Information
                </button>
                <button
                  type="button"
                  onClick={() => alert('Checking 7-day tide & congestion forecast.')}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.35rem 0.5rem',
                    fontSize: '0.68rem',
                    color: 'var(--text-secondary)',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  Check Congestion Forecast
                </button>
                <button
                  type="button"
                  onClick={() => alert('Generating Paradip Port Daily Logistics summary.')}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.35rem 0.5rem',
                    fontSize: '0.68rem',
                    color: 'var(--text-secondary)',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  Generate Report
                </button>
              </div>
            </div>

            {/* Port Weather */}
            <div className="panel-box" style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  Port Weather
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sun size={20} style={{ color: 'var(--accent-amber)' }} />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>Clear Sky | 28°C</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Paradip Harbor</div>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Wind size={12} style={{ color: 'var(--accent-cyan)' }} />
                  <span>Wind 12 km/h · Visibility Good</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
