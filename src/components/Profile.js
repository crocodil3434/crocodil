import React, { useState } from 'react';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // firebaseConfig dosyanızın yolu doğru olduğundan emin olun

const Profile = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    try {
      // Mevcut şifre ile tekrar kimlik doğrulama yap
      await reauthenticateWithCredential(user, credential);
      // Yeni şifreyi güncelle
      await updatePassword(user, newPassword);
      setSuccess('Password updated successfully.');
      setError('');
    } catch (error) {
      setError('Failed to update password: ' + error.message);
      setSuccess('');
    }
  };

  return (
    <div>
      <h2>Update Your Password</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handlePasswordChange}>
        <div>
          <label>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Confirm New Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default Profile;
