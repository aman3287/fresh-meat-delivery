import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      <h1>Profile</h1>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', marginTop: '2rem', maxWidth: '600px' }}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" value={user?.name || ''} readOnly />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={user?.email || ''} readOnly />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input type="tel" className="form-control" value={user?.phone || ''} readOnly />
        </div>
        <div className="form-group">
          <label className="form-label">Role</label>
          <input type="text" className="form-control" value={user?.role || ''} readOnly />
        </div>
      </div>
    </div>
  );
};

export default Profile;
