import { useState } from 'react';
import { Mail, Smartphone, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

export const Login = () => {
  const [activeTab, setActiveTab] = useState('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const { login } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await apiService.sendOTP(`+254${phoneNumber}`);
      setShowOTP(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const code = otpCode.join('');
    if (code.length !== 6) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await apiService.verifyOTP(`+254${phoneNumber}`, code);
      login(response.user, response.access_token);
      
      // Role-based redirect
      if (response.user.role === 'admin') {
        window.location.href = '/admin';
      } else if (response.user.role === 'driver') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    setLoading(true);
    setError('');
    
    try {
      const response = await apiService.login(email, password);
      login(response.user, response.access_token);
      
      // Role-based redirect
      if (response.user.role === 'admin') {
        window.location.href = '/admin';
      } else if (response.user.role === 'driver') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '28rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--gray-900)' }}>Welcome Back</h2>
          <p style={{ marginTop: '0.5rem', color: 'var(--gray-600)' }}>Sign in to your SafeRide account</p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', marginBottom: '1.5rem', background: 'var(--gray-100)', borderRadius: 'var(--radius-lg)', padding: '0.25rem' }}>
            <button onClick={() => setActiveTab('email')} style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: '500', background: activeTab === 'email' ? 'white' : 'transparent', color: activeTab === 'email' ? 'var(--primary)' : 'var(--gray-600)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={16} style={{ marginRight: '0.5rem' }} />Email
            </button>
            <button onClick={() => setActiveTab('phone')} style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: '500', background: activeTab === 'phone' ? 'white' : 'transparent', color: activeTab === 'phone' ? 'var(--primary)' : 'var(--gray-600)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Smartphone size={16} style={{ marginRight: '0.5rem' }} />Phone
            </button>
          </div>

          {error && (
            <div style={{ padding: '0.75rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          {activeTab === 'email' && (
            <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--gray-700)', marginBottom: '0.5rem' }}>Email Address</label>
                <input name="email" type="email" required style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '1rem', outline: 'none' }} placeholder="Enter your email" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--gray-700)', marginBottom: '0.5rem' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input name="password" type={showPassword ? 'text' : 'password'} required style={{ width: '100%', padding: '0.5rem 0.75rem', paddingRight: '2.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '1rem', outline: 'none' }} placeholder="Enter your password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {showPassword ? <EyeOff size={16} color="var(--gray-400)" /> : <Eye size={16} color="var(--gray-400)" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          )}

          {activeTab === 'phone' && !showOTP && (
            <form onSubmit={handlePhoneLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--gray-700)', marginBottom: '0.5rem' }}>Phone Number</label>
                <div style={{ display: 'flex' }}>
                  <span style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)', border: '1px solid var(--border)', borderRight: 'none', background: 'var(--gray-50)', color: 'var(--gray-500)', fontSize: '0.875rem' }}>+254</span>
                  <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: '0 var(--radius-md) var(--radius-md) 0', fontSize: '1rem', outline: 'none' }} placeholder="700000000" />
                </div>
              </div>
              <Button type="submit" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Sending...' : 'Send OTP'}
              </Button>
            </form>
          )}

          {showOTP && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: 'var(--gray-900)' }}>Enter OTP</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginTop: '0.25rem' }}>We sent a 6-digit code to +254 700 000 000</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength="1"
                    value={otpCode[i]}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    style={{ width: '3rem', height: '3rem', textAlign: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '1.125rem', outline: 'none' }}
                  />
                ))}
              </div>
              <Button onClick={handleVerifyOTP} disabled={loading || otpCode.join('').length !== 6} style={{ width: '100%' }}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </div>
          )}

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
              Don't have an account? <a href="/signup" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};