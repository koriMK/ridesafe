const API_BASE_URL = 'http://localhost:5001/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    
    let data;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error(`Server error: ${response.status}`);
    }

    if (!response.ok) {
      console.error('API Error:', response.status, data);
      throw new Error(data.error || data.message || `HTTP ${response.status}`);
    }

    return data;
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Auth APIs
  async sendOTP(phone) {
    return this.request('/auth/send-otp', {
      method: 'POST',
      body: { phone },
    });
  }

  async verifyOTP(phone, otp_code) {
    const response = await this.request('/auth/verify-otp', {
      method: 'POST',
      body: { phone, otp_code },
    });
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    return response;
  }

  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    return response;
  }

  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    return response;
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // Trip APIs
  async calculateFare(pickup_location, dropoff_location) {
    return this.request('/trips/calculate-fare', {
      method: 'POST',
      body: { pickup_location, dropoff_location },
    });
  }

  async requestTrip(tripData) {
    return this.request('/trips/request', {
      method: 'POST',
      body: tripData,
    });
  }

  async getMyTrips() {
    return this.request('/trips/my-trips');
  }

  // Payment APIs
  async initiateMpesaPayment(trip_id, phone_number) {
    return this.request('/payments/initiate-mpesa', {
      method: 'POST',
      body: { trip_id, phone_number },
    });
  }

  async checkPaymentStatus(paymentId) {
    return this.request(`/payments/check-status/${paymentId}`);
  }

  // Driver APIs
  async applyAsDriver(driverData) {
    return this.request('/drivers/apply', {
      method: 'POST',
      body: driverData,
    });
  }

  async getDriverProfile() {
    return this.request('/drivers/profile');
  }

  async updateLocation(lat, lng) {
    return this.request('/drivers/update-location', {
      method: 'POST',
      body: { lat, lng },
    });
  }
}

export default new ApiService();