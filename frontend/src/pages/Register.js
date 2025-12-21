import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'customer' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(formData);
    if (result.success) {
      navigate('/products');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '3rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Register</h1>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input type="tel" className="form-control" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} pattern="[0-9]{10}" required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} minLength="6" required />
        </div>
        <div className="form-group">
          <label className="form-label">Role</label>
          <select className="form-select" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="customer">Customer</option>
            <option value="delivery_partner">Delivery Partner</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary btn-block">Register</button>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
};

export default Register;
