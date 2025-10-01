'use client';

import { useEffect } from 'react';
import { useAuth } from '../../lib/AuthProvider';

export default function LogoutPage() {
  const { logout } = useAuth();

  useEffect(() => {
    console.log('LogoutPage: Initiating logout process');
    // Use the logout function from AuthProvider which handles everything
    logout();
  }, [logout]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <h1>Logging out...</h1>
      <p>Please wait while we log you out.</p>
    </div>
  );
}
