import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { RequestTrip } from './pages/RequestTrip';
import { Ride } from './pages/Ride';
import { About } from './pages/About';
import { Support } from './pages/Support';
import { Driver } from './pages/Driver';
import { DriverOnboarding } from './pages/DriverOnboarding';
import { AdminDashboard } from './pages/AdminDashboard';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/request-trip" element={<RequestTrip />} />
            <Route path="/ride/:id" element={<Ride />} />
            <Route path="/about" element={<About />} />
            <Route path="/support" element={<Support />} />
            <Route path="/driver" element={<Driver />} />
            <Route path="/driver/onboarding" element={<DriverOnboarding />} />
            <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;