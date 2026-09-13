import React, { useState } from 'react';
import { Ship, MapPin, Calendar, Sliders, ArrowRight, Sparkles } from 'lucide-react';

export default function InputForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    cargo: 'coal',
    quantity: 300000,
    origin: 'Indonesia',
    destination: 'Paradip',
    deadline: '3 months',
    contract: 'short-term',
    priority: 'balanced',
  });

  const [errors, setErrors] = useState({});

  const handleFillDemoScenario = () => {
    setFormData({
      cargo: 'coal',
      quantity: 300000,
      origin: 'Indonesia',
      destination: 'Paradip',
      deadline: '3 months',
      contract: 'short-term',
      priority: 'balanced',
    });
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!formData.cargo) errs.cargo = 'Cargo type is required';
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      errs.quantity = 'Please enter a valid tonnage quantity';
    }
    if (!formData.origin.trim()) errs.origin = 'Origin port is required';
    if (!formData.destination.trim()) errs.destination = 'Destination port is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="procurement-form-container">
      {/* Top Scenario Action Strip */}
      <div className="form-scenario-strip">
        <div>
          <span className="scenario-tagline">Procurement Parameters & Scenario Configuration</span>
        </div>
        <button
          type="button"
          onClick={handleFillDemoScenario}
          className="demo-autofill-btn"
        >
          <Sparkles size={14} />
          <span>Auto-fill Demo Scenario</span>
        </button>
      </div>

      {/* 4-Section Grid Layout */}
      <div className="procurement-grid">
        
        {/* Section 1: Cargo Specifications */}
        <div className="procurement-card">
          <div className="procurement-card-header">
            <div className="card-icon-bubble">
              <Ship size={16} />
            </div>
            <div>
              <h3>Cargo Specification</h3>
              <p>Commodity details and required fixture volume</p>
            </div>
          </div>

          <div className="procurement-card-body">
            <div className="input-field">
              <label>Commodity Type</label>
              <select
                value={formData.cargo}
                onChange={(e) => handleChange('cargo', e.target.value)}
                className="select-control"
              >
                <option value="coal">Thermal / Coking Coal</option>
                <option value="iron_ore">Iron Ore (Fines & Pellets)</option>
                <option value="grain">Agricultural Grains</option>
                <option value="bauxite">Bauxite / Bulk Ores</option>
              </select>
            </div>

            <div className="input-field">
              <label>Cargo Quantity (Metric Tonnes)</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', Number(e.target.value))}
                placeholder="e.g. 300000"
                className={`input-control ${errors.quantity ? 'error-border' : ''}`}
              />
              {errors.quantity && <span className="field-error-msg">{errors.quantity}</span>}
            </div>
          </div>
        </div>

        {/* Section 2: Trade Corridor */}
        <div className="procurement-card">
          <div className="procurement-card-header">
            <div className="card-icon-bubble">
              <MapPin size={16} />
            </div>
            <div>
              <h3>Trade Corridor</h3>
              <p>Loading origin and destination discharge ports</p>
            </div>
          </div>

          <div className="procurement-card-body">
            <div className="input-field">
              <label>Origin (Port or Region)</label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) => handleChange('origin', e.target.value)}
                placeholder="e.g. Indonesia"
                className={`input-control ${errors.origin ? 'error-border' : ''}`}
              />
              {errors.origin && <span className="field-error-msg">{errors.origin}</span>}
            </div>

            <div className="input-field">
              <label>Destination Port</label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => handleChange('destination', e.target.value)}
                placeholder="e.g. Paradip"
                className={`input-control ${errors.destination ? 'error-border' : ''}`}
              />
              {errors.destination && <span className="field-error-msg">{errors.destination}</span>}
            </div>
          </div>
        </div>

        {/* Section 3: Delivery Window & Contract */}
        <div className="procurement-card">
          <div className="procurement-card-header">
            <div className="card-icon-bubble">
              <Calendar size={16} />
            </div>
            <div>
              <h3>Delivery Schedule</h3>
              <p>Required laycan window and contract format</p>
            </div>
          </div>

          <div className="procurement-card-body">
            <div className="input-field">
              <label>Laycan Window / Target Horizon</label>
              <select
                value={formData.deadline}
                onChange={(e) => handleChange('deadline', e.target.value)}
                className="select-control"
              >
                <option value="1 month">Immediate (Within 1 Month)</option>
                <option value="3 months">Standard (Within 3 Months)</option>
                <option value="6 months">Forward (Within 6 Months)</option>
              </select>
            </div>

            <div className="input-field">
              <label>Contract Format</label>
              <select
                value={formData.contract}
                onChange={(e) => handleChange('contract', e.target.value)}
                className="select-control"
              >
                <option value="short-term">Single Voyage (Spot Fixture)</option>
                <option value="time-charter">Short-Term Time Charter</option>
                <option value="coa">Contract of Affreightment (COA)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Strategic Priorities */}
        <div className="procurement-card">
          <div className="procurement-card-header">
            <div className="card-icon-bubble">
              <Sliders size={16} />
            </div>
            <div>
              <h3>Procurement Objective</h3>
              <p>Optimization priorities for charter timing directive</p>
            </div>
          </div>

          <div className="procurement-card-body">
            <div className="priority-pills-group">
              {[
                { id: 'cost', title: 'Cost Minimization', desc: 'Hold out for the lowest rate, tolerate market swings' },
                { id: 'balanced', title: 'Balanced Risk & Rate', desc: 'Secure favorable fixtures while capping price spikes' },
                { id: 'reliability', title: 'Vessel Availability', desc: 'Prioritize prompt tonnage over rate waiting' },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleChange('priority', item.id)}
                  className={`priority-pill-option ${formData.priority === item.id ? 'active' : ''}`}
                >
                  <div className="pill-radio-circle">
                    {formData.priority === item.id && <div className="pill-radio-inner" />}
                  </div>
                  <div className="pill-text-content">
                    <span className="pill-label">{item.title}</span>
                    <span className="pill-sub">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Form Submission Footer */}
      <div className="form-action-footer">
        <button
          type="submit"
          disabled={isLoading}
          className="submit-analysis-btn"
        >
          <span>{isLoading ? 'Running Analytical Model...' : 'Run Freight Analysis'}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}