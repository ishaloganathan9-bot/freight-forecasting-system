import React, { useState } from 'react';
import { 
  Ship, 
  Anchor, 
  Package, 
  ArrowLeft, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';

export default function Register({ onRegister, onNavigateLogin }) {
  const [activeTab, setActiveTab] = useState('ship-owner'); // 'ship-owner' | 'cargo-buyer' | 'port-operator'

  // Ship Owner fields
  const [soName, setSoName] = useState('');
  const [soCompany, setSoCompany] = useState('');
  const [soImo, setSoImo] = useState('9387499');
  const [soAddress, setSoAddress] = useState('');
  const [soImoVerified, setSoImoVerified] = useState(false);
  const [soVerifying, setSoVerifying] = useState(false);

  // Cargo Buyer fields
  const [cbOrgName, setCbOrgName] = useState('');
  const [cbCin, setCbCin] = useState('L27100DL1973GOI006454');
  const [cbGstin, setCbGstin] = useState('07AAACS1234F1Z5');
  const [cbAddress, setCbAddress] = useState('');
  const [cbCinVerified, setCbCinVerified] = useState(false);
  const [cbGstinVerified, setCbGstinVerified] = useState(false);
  const [cbVerifyingCin, setCbVerifyingCin] = useState(false);
  const [cbVerifyingGstin, setCbVerifyingGstin] = useState(false);

  // Port Operator fields
  const [poPortName, setPoPortName] = useState('Paradip Port');
  const [poLocation, setPoLocation] = useState('Odisha');
  const [poCountry, setPoCountry] = useState('India');
  const [poLocode, setPoLocode] = useState('INPRT');
  const [poGisis, setPoGisis] = useState('INPRT-0001');
  const [poBerths, setPoBerths] = useState('16');
  const [poDraft, setPoDraft] = useState('14.5');
  const [poLoa, setPoLoa] = useState('260');
  const [poLocodeVerified, setPoLocodeVerified] = useState(false);
  const [poGisisVerified, setPoGisisVerified] = useState(false);
  const [poVerifyingLocode, setPoVerifyingLocode] = useState(false);
  const [poVerifyingGisis, setPoVerifyingGisis] = useState(false);

  const verifyField = (setter, loadingSetter) => {
    loadingSetter(true);
    setTimeout(() => {
      loadingSetter(false);
      setter(true);
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(activeTab);
  };

  const tabs = [
    { id: 'ship-owner', label: 'Ship Owner', icon: Ship },
    { id: 'cargo-buyer', label: 'Cargo Buyer', icon: Package },
    { id: 'port-operator', label: 'Port Operator', icon: Anchor }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: 'var(--bg-app)',
      backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37, 99, 235, 0.18), transparent)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1rem',
      fontFamily: 'var(--font-sans)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '560px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        padding: '2.25rem 2rem',
        boxSizing: 'border-box'
      }}>
        {/* Back to Login */}
        <button
          type="button"
          onClick={onNavigateLogin}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '0.82rem',
            fontWeight: 500,
            cursor: 'pointer',
            marginBottom: '1.25rem',
            padding: 0
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Login</span>
        </button>

        {/* Title */}
        <h1 style={{
          fontSize: '1.85rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '1.5rem'
        }}>
          Create Account
        </h1>

        {/* Stakeholder Selector Tabs - Exactly 3 as requested */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.65rem',
          marginBottom: '1.75rem'
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 0.6rem',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '1.5px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-card-subtle)',
                  color: isSelected ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} style={{ color: isSelected ? 'var(--accent-cyan)' : 'inherit' }} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Form Content */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* TAB 1: SHIP OWNER */}
          {activeTab === 'ship-owner' && (
            <>
              <div>
                <label style={labelStyle}>Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={soName}
                  onChange={(e) => setSoName(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter company name"
                  value={soCompany}
                  onChange={(e) => setSoCompany(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>IMO Number</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9387499"
                    value={soImo}
                    onChange={(e) => { setSoImo(e.target.value); setSoImoVerified(false); }}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => verifyField(setSoImoVerified, setSoVerifying)}
                    style={verifyBtnStyle(soImoVerified)}
                  >
                    {soVerifying ? <Loader2 size={14} className="spin" /> : soImoVerified ? <><CheckCircle2 size={14} /> Verified</> : 'Verify'}
                  </button>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Office Address</label>
                <input
                  type="text"
                  required
                  placeholder="Enter registered office address"
                  value={soAddress}
                  onChange={(e) => setSoAddress(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </>
          )}

          {/* TAB 2: CARGO BUYER */}
          {activeTab === 'cargo-buyer' && (
            <>
              <div>
                <label style={labelStyle}>Organisation Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter organisation name"
                  value={cbOrgName}
                  onChange={(e) => setCbOrgName(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>CIN</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    required
                    placeholder="e.g. L27100DL1973GOI006454"
                    value={cbCin}
                    onChange={(e) => { setCbCin(e.target.value); setCbCinVerified(false); }}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => verifyField(setCbCinVerified, setCbVerifyingCin)}
                    style={verifyBtnStyle(cbCinVerified)}
                  >
                    {cbVerifyingCin ? <Loader2 size={14} className="spin" /> : cbCinVerified ? <><CheckCircle2 size={14} /> Verified</> : 'Verify'}
                  </button>
                </div>
              </div>

              <div>
                <label style={labelStyle}>GSTIN</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 07AAACS1234F1Z5"
                    value={cbGstin}
                    onChange={(e) => { setCbGstin(e.target.value); setCbGstinVerified(false); }}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => verifyField(setCbGstinVerified, setCbVerifyingGstin)}
                    style={verifyBtnStyle(cbGstinVerified)}
                  >
                    {cbVerifyingGstin ? <Loader2 size={14} className="spin" /> : cbGstinVerified ? <><CheckCircle2 size={14} /> Verified</> : 'Verify'}
                  </button>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Registered Address</label>
                <input
                  type="text"
                  required
                  placeholder="Enter registered business address"
                  value={cbAddress}
                  onChange={(e) => setCbAddress(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </>
          )}

          {/* TAB 3: PORT OPERATOR */}
          {activeTab === 'port-operator' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Port Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paradip Port"
                    value={poPortName}
                    onChange={(e) => setPoPortName(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Odisha"
                    value={poLocation}
                    onChange={(e) => setPoLocation(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Country</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. India"
                  value={poCountry}
                  onChange={(e) => setPoCountry(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>UN/LOCODE</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    required
                    placeholder="e.g. INPRT"
                    value={poLocode}
                    onChange={(e) => { setPoLocode(e.target.value); setPoLocodeVerified(false); }}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => verifyField(setPoLocodeVerified, setPoVerifyingLocode)}
                    style={verifyBtnStyle(poLocodeVerified)}
                  >
                    {poVerifyingLocode ? <Loader2 size={14} className="spin" /> : poLocodeVerified ? <><CheckCircle2 size={14} /> Verified</> : 'Verify'}
                  </button>
                </div>
              </div>

              <div>
                <label style={labelStyle}>IMO/GISIS</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    required
                    placeholder="e.g. INPRT-0001"
                    value={poGisis}
                    onChange={(e) => { setPoGisis(e.target.value); setPoGisisVerified(false); }}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => verifyField(setPoGisisVerified, setPoVerifyingGisis)}
                    style={verifyBtnStyle(poGisisVerified)}
                  >
                    {poVerifyingGisis ? <Loader2 size={14} className="spin" /> : poGisisVerified ? <><CheckCircle2 size={14} /> Verified</> : 'Verify'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
                <div>
                  <label style={labelStyle}>Total Operational Berths</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 16"
                    value={poBerths}
                    onChange={(e) => setPoBerths(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Max Draft (m)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 14.5"
                    value={poDraft}
                    onChange={(e) => setPoDraft(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Max LOA (m)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 260"
                    value={poLoa}
                    onChange={(e) => setPoLoa(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              backgroundColor: 'var(--accent-blue)',
              backgroundImage: 'linear-gradient(135deg, #1d68ff 0%, #1652cc 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem 1.25rem',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--nav-active-shadow)',
              marginTop: '0.75rem',
              transition: 'opacity 0.2s ease'
            }}
          >
            Create Account
          </button>

          {/* Helper note */}
          <p style={{
            fontSize: '0.74rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
            marginTop: '0.25rem'
          }}>
            Please complete the required verification before creating your account.
          </p>
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: '0.45rem'
};

const inputStyle = {
  width: '100%',
  backgroundColor: 'var(--bg-app)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-sm)',
  padding: '0.65rem 0.85rem',
  fontSize: '0.85rem',
  color: 'var(--text-primary)',
  outline: 'none',
  boxSizing: 'border-box'
};

const verifyBtnStyle = (verified) => ({
  backgroundColor: verified ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card-subtle)',
  border: verified ? '1px solid #10b981' : '1px solid var(--border-subtle)',
  color: verified ? '#10b981' : 'var(--text-primary)',
  borderRadius: 'var(--radius-sm)',
  padding: '0.65rem 1.15rem',
  fontSize: '0.78rem',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s ease'
});
