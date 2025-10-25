import { DollarSign, Clock, Shield, Users, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Driver = () => {
  return (
    <div style={{ minHeight: '100vh' }}>
      <section className="hero-gradient" style={{ color: 'white', padding: '5rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            Drive with SafeRide<br />
            <span style={{ color: 'var(--primary)' }}>Earn More, Drive Safe</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--gray-300)', marginBottom: '2rem', maxWidth: '32rem', margin: '0 auto 2rem' }}>
            Join Kenya's most trusted transportation platform. Flexible hours, competitive earnings, and a community that values safety.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/driver/onboarding" style={{ textDecoration: 'none' }}>
              <Button size="lg">
                Apply to Drive <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
              </Button>
            </a>
            <Button variant="secondary" size="lg">Learn More</Button>
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 0', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--gray-900)', marginBottom: '1rem' }}>Why Drive with SafeRide?</h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--gray-600)' }}>Join thousands of drivers earning good money while making a difference</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <DollarSign size={48} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Competitive Earnings</h3>
              <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>Earn KSh 2,000 - 5,000 per day with flexible working hours</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>Up to KSh 150,000/month</div>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <Clock size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Flexible Schedule</h3>
              <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>Work when you want, as much as you want. Perfect for part-time or full-time</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>24/7 Availability</div>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <Shield size={48} color="var(--warning)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Safety & Support</h3>
              <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>24/7 support, insurance coverage, and safety training included</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--warning)' }}>Full Protection</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--gray-900)', marginBottom: '1rem' }}>Requirements</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></div>
                  <span>Valid Kenyan driving license (minimum 2 years)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></div>
                  <span>Clean driving record with no major violations</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></div>
                  <span>Age between 21-65 years</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></div>
                  <span>Pass background check and safety training</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></div>
                  <span>Own smartphone with internet access</span>
                </div>
              </div>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>Ready to Get Started?</h3>
              <p style={{ color: 'var(--gray-600)', textAlign: 'center', marginBottom: '1.5rem' }}>
                Join SafeRide today and start earning with Kenya's most trusted transportation platform.
              </p>
              <a href="/driver/onboarding" style={{ textDecoration: 'none' }}>
                <Button style={{ width: '100%', marginBottom: '1rem' }} size="lg">
                  Apply Now
                </Button>
              </a>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', textAlign: 'center' }}>
                Application takes 5 minutes. Approval within 24-48 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--primary)', color: 'white', padding: '5rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>500+</div>
              <div style={{ opacity: 0.9 }}>Active Drivers</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>KSh 2M+</div>
              <div style={{ opacity: 0.9 }}>Paid to Drivers</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>4.8★</div>
              <div style={{ opacity: 0.9 }}>Driver Rating</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>24/7</div>
              <div style={{ opacity: 0.9 }}>Support Available</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};