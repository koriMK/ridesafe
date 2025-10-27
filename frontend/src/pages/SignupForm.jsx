import { useState } from 'react';
import { Button } from '../components/ui/Button';

export const SignupForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'rider'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
        style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        required
        style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
      />
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
      >
        <option value="rider">Rider</option>
        <option value="driver">Driver</option>
      </select>
      <Button type="submit">Sign Up</Button>
    </form>
  );
};