import { useState } from 'react';
import { Upload, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import apiService from '../services/api';

export const DriverOnboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    license_number: '',
    license_expiry: '',
    id_number: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_year: '',
    vehicle_plate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applicationStatus, setApplicationStatus] = useState('pending');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    
    setLoading(true);
    setError('');

    console.log('Submitting driver application:', formData);

    try {
      const response = await apiService.applyAsDriver(formData);
      console.log('Application response:', response);
      setStep(2);
      setApplicationStatus('under_review');
    } catch (err) {
      console.error('Application error:', err);
      if (err.message.includes('401')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '32rem', width: '100%', textAlign: 'center' }}>
          <div className="card" style={{ padding: '3rem 2rem' }}>
            {applicationStatus === 'under_review' && (
              <>
                <Clock size={64} color="var(--warning)" style={{ margin: '0 auto 1.5rem' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Application Under Review</h2>
                <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
                  Thank you for applying! We're reviewing your documents and will get back to you within 24-48 hours.
                </p>
                <div style={{ background: 'var(--muted)', padding: '1rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                    <strong>Next Steps:</strong><br />
                    • Document verification<br />
                    • Background check<br />
                    • Vehicle inspection (if applicable)<br />
                    • Account activation
                  </p>
                </div>
              </>
            )}
            
            {applicationStatus === 'approved' && (
              <>
                <CheckCircle2 size={64} color="var(--success)" style={{ margin: '0 auto 1.5rem' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--success)' }}>Application Approved!</h2>
                <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
                  Congratulations! You're now a verified SafeRide driver. You can start accepting trips immediately.
                </p>
              </>
            )}

            {applicationStatus === 'rejected' && (
              <>
                <XCircle size={64} color="var(--danger)" style={{ margin: '0 auto 1.5rem' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--danger)' }}>Application Rejected</h2>
                <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
                  Unfortunately, we couldn't approve your application at this time. Please contact support for more information.
                </p>
                <Button onClick={() => setStep(1)} style={{ marginBottom: '1rem' }}>
                  Reapply
                </Button>
              </>
            )}

            <Button variant="secondary">
              <a href="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
                Go to Dashboard
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Become a SafeRide Driver</h1>
          <p style={{ color: 'var(--gray-600)' }}>Complete your application to start earning with SafeRide</p>
        </div>

        <div className="card">
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 'bold' }}>1</div>
              <div style={{ flex: 1, height: '2px', background: 'var(--gray-200)', marginLeft: '1rem' }}></div>
              <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--gray-200)', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 'bold' }}>2</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
              <span>Application Details</span>
              <span>Review & Approval</span>
            </div>
          </div>

          {error && (
            <div style={{ padding: '0.75rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Personal Information</h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
                    Driving License Number
                  </label>
                  <input
                    type="text"
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '1rem', outline: 'none' }}
                    placeholder="Enter license number"
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
                    License Expiry Date
                  </label>
                  <input
                    type="date"
                    name="license_expiry"
                    value={formData.license_expiry}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '1rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
                    National ID Number
                  </label>
                  <input
                    type="text"
                    name="id_number"
                    value={formData.id_number}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '1rem', outline: 'none' }}
                    placeholder="Enter ID number"
                  />
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Vehicle Information</h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
                    Vehicle Make
                  </label>
                  <input
                    type="text"
                    name="vehicle_make"
                    value={formData.vehicle_make}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '1rem', outline: 'none' }}
                    placeholder="e.g., Toyota (optional)"
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
                    Vehicle Model
                  </label>
                  <input
                    type="text"
                    name="vehicle_model"
                    value={formData.vehicle_model}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '1rem', outline: 'none' }}
                    placeholder="e.g., Camry (optional)"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
                      Year
                    </label>
                    <input
                      type="number"
                      name="vehicle_year"
                      value={formData.vehicle_year}
                      onChange={handleInputChange}
                      min="1990"
                      max="2025"
                      style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '1rem', outline: 'none' }}
                      placeholder="2020"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
                      License Plate
                    </label>
                    <input
                      type="text"
                      name="vehicle_plate"
                      value={formData.vehicle_plate}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '1rem', outline: 'none' }}
                      placeholder="KXX 000X"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--muted)', padding: '1rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Required Documents (Upload after submission)</h4>
              <ul style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', paddingLeft: '1rem' }}>
                <li>Valid driving license (front and back)</li>
                <li>National ID or passport</li>
                <li>Vehicle registration (if providing vehicle)</li>
                <li>Insurance certificate (if providing vehicle)</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button variant="secondary" style={{ flex: 1 }}>
                <a href="/driver" style={{ textDecoration: 'none', color: 'inherit' }}>Cancel</a>
              </Button>
              <Button type="submit" disabled={loading} style={{ flex: 1 }}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};