import React, { useState } from 'react';
import { 
  Ship, 
  Anchor, 
  Package, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';

export default function Login({ onLogin, onNavigateRegister, onCancel }) {
  const [selectedRole, setSelectedRole] = useState('cargo-buyer');
  const [email, setEmail] = useState('rajesh.sharma@sail.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Exactly 3 roles as requested: Ship Owner, Port Operator, Cargo Buyer
  const roles = [
    {
      id: 'ship-owner',
      label: 'Ship Owner',
      icon: Ship,
      defaultEmail: 'chartering@oceanic-shipping.com',
      buttonLabel: 'Login as Ship Owner'
    },
    {
      id: 'port-operator',
      label: 'Port Operator',
      icon: Anchor,
      defaultEmail: 'ops.berth@paradip-port.gov.in',
      buttonLabel: 'Login as Port Operator'
    },
    {
      id: 'cargo-buyer',
      label: 'Cargo Buyer',
      icon: Package,
      defaultEmail: 'rajesh.sharma@sail.in',
      buttonLabel: 'Login as SAIL / Cargo Buyer'
    }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    const roleObj = roles.find(r => r.id === roleId);
    if (roleObj) {
      setEmail(roleObj.defaultEmail);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  const activeRoleObj = roles.find(r => r.id === selectedRole) || roles[0];

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: 'var(--bg-app)',
      backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37, 99, 235, 0.18), transparent)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      fontFamily: 'var(--font-sans)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        padding: '2.25rem 2rem',
        position: 'relative',
        boxSizing: 'border-box'
      }}>
        {/* Back Link if inside application */}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              marginBottom: '1.25rem',
              padding: 0
            }}
          >
            <ArrowLeft size={15} />
            <span>Back to Dashboard</span>
          </button>
        )}

        {/* Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '0.35rem'
          }}>
            Welcome Back
          </h1>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)'
          }}>
            Login to continue to your stakeholder dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Stakeholder Role Selection - Strictly 3 Roles */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-secondary)',
              marginBottom: '0.65rem'
            }}>
              Select Your Stakeholder Role
            </label>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.65rem'
            }}>
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleSelect(role.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      padding: '0.85rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '1.5px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.08)' : 'var(--bg-card-subtle)',
                      color: isSelected ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    <Icon size={18} style={{ color: isSelected ? 'var(--accent-cyan)' : 'inherit' }} />
                    <span style={{ 
                      fontSize: '0.78rem', 
                      fontWeight: isSelected ? 700 : 500,
                      textAlign: 'center',
                      lineHeight: 1.2
                    }}>
                      {role.label}
                    </span>
                    {isSelected && (
                      <CheckCircle2 
                        size={13} 
                        style={{ 
                          position: 'absolute', 
                          top: '6px', 
                          right: '6px', 
                          color: 'var(--accent-cyan)' 
                        }} 
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.76rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: '0.45rem'
            }}>
              Official Business Email
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.65rem 0.85rem',
              gap: '0.65rem'
            }}>
              <Mail size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  width: '100%'
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <label style={{
                fontSize: '0.76rem',
                fontWeight: 600,
                color: 'var(--text-secondary)'
              }}>
                Password
              </label>
              <a
                href="#forgot"
                onClick={(e) => { e.preventDefault(); alert('Password recovery link sent to registered email.'); }}
                style={{
                  fontSize: '0.73rem',
                  color: 'var(--accent-cyan)',
                  textDecoration: 'none'
                }}
              >
                Forgot Password?
              </a>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.65rem 0.85rem',
              gap: '0.65rem'
            }}>
              <Lock size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  width: '100%',
                  letterSpacing: showPassword ? 'normal' : '0.15em'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{
                accentColor: 'var(--accent-cyan)',
                width: '15px',
                height: '15px',
                cursor: 'pointer'
              }}
            />
            <label 
              htmlFor="rememberMe"
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              Remember Me
            </label>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            style={{
              backgroundColor: 'var(--accent-blue)',
              backgroundImage: 'linear-gradient(135deg, #1d68ff 0%, #1652cc 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '0.8rem 1.25rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: 'var(--nav-active-shadow)',
              transition: 'opacity 0.2s ease',
              marginTop: '0.5rem'
            }}
          >
            <span>{activeRoleObj.buttonLabel}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer Link to Register */}
        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }}>
          <span>Don't have an account? </span>
          <button
            type="button"
            onClick={onNavigateRegister}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-cyan)',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0
            }}
          >
            Register
          </button>
        </div>

        {/* Stakeholder Login Details Quick Reference */}
        <div style={{
          marginTop: '1.5rem',
          padding: '0.85rem',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--bg-card-subtle)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.72rem'
        }}>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Demo Stakeholder Accounts:</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span><b>Cargo Buyer:</b> rajesh.sharma@sail.in</span>
              <span style={{ color: 'var(--text-muted)' }}>password123</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span><b>Ship Owner:</b> chartering@oceanic-shipping.com</span>
              <span style={{ color: 'var(--text-muted)' }}>password123</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span><b>Port Operator:</b> ops.berth@paradip-port.gov.in</span>
              <span style={{ color: 'var(--text-muted)' }}>password123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
