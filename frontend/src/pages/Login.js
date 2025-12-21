import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    if (result.success) {
      if (result.user.role === 'delivery_partner') {
        navigate('/delivery');
      } else {
        navigate('/products');
      }
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '3rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Login</h1>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        </div>
        <button type="submit" className="btn btn-primary btn-block">Login</button>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
};

export default Login;
