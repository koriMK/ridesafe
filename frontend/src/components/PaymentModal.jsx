import { useState, useEffect } from 'react';
import { X, Smartphone, CheckCircle, XCircle, Loader } from 'lucide-react';
import { Button } from './ui/Button';
import apiService from '../services/api';

export const PaymentModal = ({ isOpen, onClose, trip, onPaymentComplete }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('input'); // input, processing, pending, success, failed
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let interval;
    if (paymentStatus === 'pending' && paymentData?.payment_id) {
      interval = setInterval(async () => {
        try {
          const response = await apiService.checkPaymentStatus(paymentData.payment_id);
          if (response.status === 'completed') {
            setPaymentStatus('success');
            setTimeout(() => {
              onPaymentComplete();
              onClose();
            }, 2000);
          } else if (response.status === 'failed') {
            setPaymentStatus('failed');
          }
        } catch (err) {
          console.error('Error checking payment status:', err);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [paymentStatus, paymentData, onPaymentComplete, onClose]);

  const initiatePayment = async () => {
    if (!phoneNumber) return;
    
    setPaymentStatus('processing');
    setError('');
    
    try {
      const response = await apiService.initiateMpesaPayment(trip.id, `+254${phoneNumber}`);
      setPaymentData(response);
      setPaymentStatus('pending');
    } catch (err) {
      setError(err.message);
      setPaymentStatus('failed');
    }
  };

  const resetPayment = () => {
    setPaymentStatus('input');
    setPaymentData(null);
    setError('');
    setPhoneNumber('');
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '2rem', maxWidth: '32rem', width: '90%', margin: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Payment</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {paymentStatus === 'input' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <Smartphone size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>M-Pesa Payment</h3>
              <p style={{ color: 'var(--gray-600)', marginBottom: '0.5rem' }}>Amount: KSh {trip.final_fare || trip.fare_estimate}</p>
              <div style={{ background: '#dbeafe', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: '#1e40af' }}>
                💡 Test with: 254708374149 or 254711111111
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
                M-Pesa Phone Number
              </label>
              <div style={{ display: 'flex' }}>
                <span style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)', border: '1px solid var(--border)', borderRight: 'none', background: 'var(--gray-50)', color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                  +254
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: '0 var(--radius-md) var(--radius-md) 0', fontSize: '1rem', outline: 'none' }}
                  placeholder="708374149 (test number)"
                />
              </div>
            </div>

            {error && (
              <div style={{ padding: '0.75rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <Button onClick={initiatePayment} disabled={!phoneNumber} style={{ width: '100%' }}>
              Pay KSh {trip.final_fare || trip.fare_estimate}
            </Button>
          </div>
        )}

        {paymentStatus === 'processing' && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Loader size={48} color="var(--primary)" style={{ margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Processing Payment</h3>
            <p style={{ color: 'var(--gray-600)' }}>Initiating M-Pesa payment...</p>
          </div>
        )}

        {paymentStatus === 'pending' && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Smartphone size={48} color="var(--warning)" style={{ margin: '0 auto 1rem', animation: 'pulse 2s infinite' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Check Your Phone</h3>
            <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>
              Enter your M-Pesa PIN to complete the payment
            </p>
            
            {paymentData && (
              <div style={{ background: 'var(--muted)', padding: '1rem', borderRadius: 'var(--radius-lg)', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                <p>Merchant Request ID</p>
                <p style={{ fontFamily: 'monospace', fontWeight: '600' }}>{paymentData.merchant_request_id}</p>
                <p style={{ marginTop: '0.5rem' }}>Checkout Request ID</p>
                <p style={{ fontFamily: 'monospace', fontWeight: '600' }}>{paymentData.checkout_request_id}</p>
              </div>
            )}
          </div>
        )}

        {paymentStatus === 'success' && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <CheckCircle size={48} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--success)' }}>Payment Successful!</h3>
            <p style={{ color: 'var(--gray-600)' }}>Your payment has been processed successfully.</p>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <XCircle size={48} color="var(--danger)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--danger)' }}>Payment Failed</h3>
            <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
              {error || 'Payment was not completed. Please try again.'}
            </p>
            <Button onClick={resetPayment} style={{ width: '100%' }}>
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};